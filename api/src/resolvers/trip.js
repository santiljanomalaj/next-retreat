const { nanoid } = require('nanoid')
const crypto = require('crypto')
const User = require('../models/User')
const UserTrip = require('../models/UserTrip')
const UserTripVenue = require('../models/UserTripVenue')
const UserTripVariation = require('../models/UserTripVariation')
const UserTripVariationPrice = require('../models/UserTripVariationPrice')
const UserSharedTrip = require('../models/UserSharedTrip')
const Venue = require('../models/Venue')
const { NotFoundError, ValidationError } = require('../utils/graphqlErrors')
const { transformVenue } = require('./utils/venue')
const { sendEmail } = require('../utils/email')
const { SENDGRID_EMAIL_TEMPLATE_IDS } = require('../constants')
const { S3Client } = require("@aws-sdk/client-s3");
const { PassThrough } = require('stream')
const { Upload } = require("@aws-sdk/lib-storage")
const Path = require('path')
const { createUser } = require('../utils/user')

const validateAndReturnTripByIdAndUserId = async ({ id, userId }) => {
  const trip = await UserTrip.query().findOne({ id, userId })
  if (!trip) {
    throw new NotFoundError({ message: 'Trip not found' })
  }
  return trip
}

const fetchPriceForVenue = async ({ venueId, from, to, pax, price }) => {
  // const venue = await Venue.query().findOne({ id: venueId }).select(['source', 'hotelid_ppn'])

  // if (venue.source == 'NEX') return {...price, price:0, isAvailable: false}

  //here go to PPN and check
  return { ...price, price: 1, isAvailable: false }
}

module.exports = {
  Trip: {
    tripVenues: (trip) => UserTripVenue.query().where({ tripId: trip.id }),
    shareToken: async (trip) => {
      if (trip.shareToken) {
        return trip.shareToken
      }
      const shareToken = nanoid(12)
      await UserTrip.query()
        .patch({ shareToken })
        .findById(trip.id)
      return shareToken
    },
    variations: async (trip) => {
      let result = await UserTripVariation.query().withGraphJoined({
        prices: true,
      }).where({ tripId: trip.id }).orderBy('id')

      result =  result.map(variation => ({
        ...variation,
        from: (new Date(variation.from)).toISOString(),
        to: (new Date(variation.to)).toISOString(),
      }))
      return result
  }
  },
  TripVenue: {
    venue: async (tripVenue, _, { dataloaders }) => {
      const venue = await dataloaders.tripVenues.load(tripVenue.venueId)
      if (!venue) {
        throw new NotFoundError({
          message: 'Invalid venue id',
        })
      }
      return {
        ...transformVenue(venue),
        hotelidPpn: venue.hotelidPpn,
      }
    },
    trip: (tripVenue) => UserTrip.query().findById(tripVenue.tripId),
  },
  Query: {
    trip: async (_, { input }, { user }) => {
      const { id, shareToken } = input
      if ((!id && !shareToken) || (id && !user)) {
        throw new ValidationError()
      }
      let trip = await UserTrip.query().findOne({
        ...(id ? { id, userId: user.id } : {}),
        ...(shareToken ? { shareToken } : {}),
      })
      if (!trip) {
        // const sharedTrip = await 
        //check in shared trips (RR) => if found, return trip, else error
        if (id) {
          const sharedTrip = await UserSharedTrip.query().findOne({ userId: user.id, tripId: id })
          if (sharedTrip) {
            trip = await UserTrip.query().findOne({ id })
            if (trip) return trip
          }
        }
        throw new NotFoundError({ message: 'Trip not found' })
      }
      return trip
    },
    trips: (_, __, { user }) => UserTrip.query().where({ userId: user.id }),
    tripSharedUsers: async (_, { id }, { user }) => {
      const trip = await validateAndReturnTripByIdAndUserId({
        id: id,
        userId: user.id,
      })

      const results = await UserSharedTrip.knex().raw(`
      select u.email, u.access_token as "accessToken" from user_shared_trips as ust inner join users as u on u.id = ust.user_id where ust.trip_id = ${id} order by ust.id`)

      return [{ email: user.email }, ...results.rows]
    },
    fetchPricesForTripVariation: async (_, { input }) => {
      const { from, to, pax, prices } = input
      return await Promise.all(prices.map(price => fetchPriceForVenue({
        from,
        to,
        pax,
        price
      })))
    },
    fetchPriceForTripVariation: async (_, { input }) => {
      const { from, to, pax, price } = input

      return await fetchPriceForVenue({ from, to, pax, price })
    },
  },
  Mutation: {
    createTrip: (_, { input }, { user }) =>
      UserTrip.query().insert({ userId: user.id, name: input.name }),
    updateTrip: async (_, { input }, { user }) => {
      const { id, name } = input
      const trip = await validateAndReturnTripByIdAndUserId({
        id,
        userId: user.id,
      })
      return trip
        .$query()
        .patch({ name })
        .returning('*')
    },
    deleteTrip: async (_, { id }, { user }) => {
      const trip = await validateAndReturnTripByIdAndUserId({
        id,
        userId: user.id,
      })
      await trip.$query().delete()
      return true
    },
    addTripVenue: async (_, { input }, { user }) => {
      const { tripId, venueId } = input
      const trip = await validateAndReturnTripByIdAndUserId({
        id: tripId,
        userId: user.id,
      })
      const tripVenue = await UserTripVenue.query().findOne({ tripId, venueId })
      if (!tripVenue) {
        await UserTripVenue.query().insert({ tripId, venueId })
      }

      if (trip.isProposal) {
        const variations = await UserTripVariation.query().where({ tripId: tripId })
        Promise.all(
          variations.map(variation =>
            UserTripVariationPrice.query()
              .insert({ tripVariationId: variation.id, venueId: tripVenue.venueId })
          )
        )
      }

      return trip
    },
    removeTripVenue: async (_, { id }, { user }) => {
      const tripVenue = await UserTripVenue.query().findById(id)
      if (!tripVenue) {
        throw new NotFoundError({ message: 'Trip venue not found' })
      }
      const trip = await validateAndReturnTripByIdAndUserId({
        id: tripVenue.tripId,
        userId: user.id,
      })
      await tripVenue.$query().delete()

      if (trip.isProposal) {
        const variations = await UserTripVariation.query().where({ tripId: tripVenue.tripId })
        Promise.all(
          variations.map(variation =>
            UserTripVariationPrice.query()
              .where({ tripVariationId: variation.id, venueId: tripVenue.venueId }).del()
          )
        )
      }

      return trip
    },
    tripAskQuestion: async (_, { input }) => {
      const { venueIds, ...rest } = input
      const venues = await Venue.query().whereIn('id', venueIds)
      await sendEmail({
        from: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
        to: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
        templateId: SENDGRID_EMAIL_TEMPLATE_IDS.ASK_A_QUESTION_FORM,
        dynamicTemplateData: {
          ...rest,
          venues: venues.map(
            ({ id, hotelName, city, countryCode }) =>
              `ID: ${id}, ${hotelName}(${countryCode}, ${city})`
          ),
        },
      })
      await sendEmail({
        from: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
        to: input.email,
        templateId: SENDGRID_EMAIL_TEMPLATE_IDS.REQUEST_RECEIVED_CONFIRMATION,
      })
      return true
    },
    tripCheckAvailability: async (_, { input }) => {
      const { venueIds, dateRange, exactDate, ...rest } = input
      const venues = await Venue.query().whereIn('id', venueIds)
      await sendEmail({
        from: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
        to: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
        templateId: SENDGRID_EMAIL_TEMPLATE_IDS.CHECK_AVAILABILITY_FORM,
        dynamicTemplateData: {
          ...rest,
          exactDate: exactDate ? 'Yes' : 'No',
          dateFrom: dateRange.from,
          dateTo: dateRange.to,
          venues: venues.map(
            ({ id, hotelName, city, countryCode }) =>
              `ID: ${id}, ${hotelName}(${countryCode}, ${city})`
          ),
        },
      })
      await sendEmail({
        from: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
        to: input.email,
        templateId: SENDGRID_EMAIL_TEMPLATE_IDS.REQUEST_RECEIVED_CONFIRMATION,
      })
      return true
    },
    uploadTripLogo: async (_, { tripId, file }, { user }) => {
      const trip = await validateAndReturnTripByIdAndUserId({
        id: tripId,
        userId: user.id,
      })

      const { filename, mimetype, createReadStream, } = await file;
      const entry = createReadStream()
      const logoname = crypto.randomBytes(20).toString('hex')
      const input = {
        Body: entry.pipe(new PassThrough()),
        Bucket: process.env.AWS_CDN_S3_BUCKET_NAME,
        Key: `trips/${tripId}/${logoname}${Path.extname(filename)}`,
        ACL: "public-read",
        ContentType: mimetype,
      }

      try {
        const multipartUpload = new Upload({
          client: new S3Client({
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            },
            region: process.env.AWS_CDN_S3_REGION
          }),
          params: input,
        });

        await multipartUpload.done();

        //sasve the info to the 
        const fullUrl = `https://cdn.nextretreat.com/trips/${tripId}/${logoname}${Path.extname(filename)}`
        await UserTrip.query().where({ id: tripId }).update({ logoUrl: fullUrl, userId: user.id, name: trip.name })
        return fullUrl
      } catch (err) {
        console.error(err);
        return false
      }
    },
    removeTripLogo: async (_, { tripId }, { user }) => {
      const trip = await validateAndReturnTripByIdAndUserId({
        id: tripId,
        userId: user.id,
      })
      await UserTrip.query().where({ id: tripId }).update({ logoUrl: null, userId: user.id, name: trip.name })
      return true
    },
    saveTripVariations: async (_, { input }, { user }) => {
      const { tripId, variations } = input
      const trip = await validateAndReturnTripByIdAndUserId({
        id: tripId,
        userId: user.id,
      })

      const saveVariation = async (variation) => {
        const { from, to, pax, prices } = variation
        let tripVariation
        await UserTripVariation.transaction(async (trx) => {
          if (variation.id) {
            //fetch variation
            tripVariation = await UserTripVariation.query(trx).where({ id: variation.id, tripId }).first()
            if (tripVariation == null) return true
            await UserTripVariation.query(trx).where({ id: variation.id }).update({ from: new Date((from)),
              to: new Date((to)), pax, tripId })
          }
          else {
            //insert variation
            tripVariation = await UserTripVariation.query(trx).insert({
              tripId,
              from: new Date((from)),
              to: new Date((to)),
              pax
            })
          }

          if (prices && prices.length > 0) {
            const pricesToInsert = prices.filter(price => !price.id || !variation.id)
            if (pricesToInsert.length > 0) await UserTripVariationPrice.query(trx).insert(
              pricesToInsert.map(price => ({
                tripVariationId: tripVariation.id,
                price: price.price,
                isAvailable: price.isAvailable,
                venueId: price.venueId
              }))
            )
            const pricesToUpdate = prices.filter(price => price.id && variation.id)
            if (pricesToUpdate.length > 0) await Promise.all(
              pricesToUpdate.map(price => UserTripVariationPrice.query(trx).update(
                {
                  tripVariationId: tripVariation.id,
                  ...price
                }).where({ id: price.id }))
            )
          }

        })

      }

      await Promise.all(variations.map(variation => saveVariation(variation)))

      return true
    },
    deleteTripVariation: async (_, { id }, { user }) => {
      const tripVariation = await UserTripVariation.query().findById(id)
      if (!tripVariation) {
        throw new NotFoundError({ message: 'Trip variation not found' })
      }
      const trip = await validateAndReturnTripByIdAndUserId({
        id: tripVariation.tripId,
        userId: user.id,
      })
      await tripVariation.$query().delete()
      return true
    },
    shareTripWithUser: async (_, { input }, { user }) => {
      const trip = await validateAndReturnTripByIdAndUserId({
        id: input.id,
        userId: user.id,
      })

      const userToShare = await User.query().findOne({ email: input.email })

      if (!userToShare) {
        //create new user
        const user = await createUser(input.email)

        //if input.sendnotification? then send email
      }

      const userSharedTrip = await UserSharedTrip.query().findOne({ userId: userToShare.id, tripId: input.id })

      if (userSharedTrip) throw new NotFoundError({ message: 'Trip already shared' })

      await UserSharedTrip.query().insert({ userId: userToShare.id, tripId: input.id })

      return {
        email: userToShare.email,
        accessToken: userToShare.accessToken
      }
    },
    deleteTripSharedUser: async (_, { input }, { user }) => {
      const trip = await validateAndReturnTripByIdAndUserId({
        id: input.id,
        userId: user.id,
      })

      const userToRemoceAccess = await User.query().findOne({ email: input.email })

      if (!userToRemoceAccess) throw new NotFoundError({ message: 'User not found' })

      const userSharedTrip = await UserSharedTrip.query().findOne({ userId: userToRemoceAccess.id, tripId: input.id })

      if (!userSharedTrip) throw new NotFoundError({ message: 'Shared trip with user not found' })

      await userSharedTrip.$query().delete()

      return true
    }
  },
}
