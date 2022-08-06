const format = require('date-fns/format')
const fetch = require('node-fetch')
const logger = require('../utils/logger')
const currency = require('../utils/currency')
const Booking = require('../models/Booking')
const OriginLocation = require('../models/OriginLocation')
const { sendEmail } = require('../utils/email')
const { SENDGRID_EMAIL_TEMPLATE_IDS } = require('../constants')

const getBookingDataForEmail = ({
  id,
  currencyIsoCode,
  checkInDate,
  checkOutDate,
  name,
  email,
  phoneNumber,
  companyName,
  country,
  vatNumber,
  companyAddress,
  venue: { hotelName, hotelidPpn, city, cityidPpn },
  rooms,
  services,
  originLocations,
  notes,
  maxTeamSize,
  url,
  totalPrice,
  totalResortFees,
  totalTaxesAndFees,
}) => ({
  id,
  checkInDate: format(checkInDate, 'dd/MM/yyyy'),
  checkOutDate: format(checkOutDate, 'dd/MM/yyyy'),
  name,
  email,
  phoneNumber,
  companyName,
  country,
  vatNumber,
  companyAddress,
  hotelName,
  hotelidPpn,
  city,
  cityidPpn,
  currencyIsoCode,
  originLocations: originLocations
    .map(
      ({ name: airportName, country: originLocationCountry }) =>
        `${airportName} (${originLocationCountry})`
    )
    .join(', '),
  rooms: rooms
    .map(
      ({
        title,
        quantity,
        boardType,
        pricePerNight,
        resortFee,
        subtotal,
        taxesAndFees,
        total,
        occupancyLimit,
        cancelationPolicy,
      }) =>
        `${title}: ${quantity}pc(s), ${boardType}. Occupancy limit: ${occupancyLimit}. Price (per night): ${pricePerNight}. Resort fee: ${resortFee}. Subtotal: ${subtotal}. Taxes and fees: ${taxesAndFees}. Total price: ${total}. Cancelation policy: ${cancelationPolicy}`
    )
    .join('<br>'),
  services: services.map(({ service }) => service).join(', '),
  notes,
  maxTeamSize,
  url,
  totalPrice,
  totalResortFees,
  totalTaxesAndFees,
})

module.exports = {
  Mutation: {
    requestBooking: async (
      _,
      {
        input: {
          userId,
          venueId,
          checkInDate,
          checkOutDate,
          email,
          phoneNumber,
          name,
          companyName,
          notes,
          country,
          vatNumber,
          companyAddress,
          originLocations,
          roomData,
          additionalServices,
          currencyIsoCode,
          hotelidPpn,
          hotelName,
          totalPrice,
          totalResortFees,
          totalTaxesAndFees,
          maxTeamSize,
          url,
        },
      }
    ) => {
      const booking = await Booking.transaction(async (trx) => {
        const bookingRecord = await Booking.query(trx).insert({
          userId,
          hotelidPpn,
          hotelName,
          venueId,
          currencyIsoCode,
          checkInDate,
          checkOutDate,
          email,
          phoneNumber,
          name,
          companyName,
          notes,
          country: country.name,
          vatNumber,
          companyAddress,
          maxTeamSize,
          url,
        })
        const { id: bookingId } = bookingRecord
        const originLocationsIds = await OriginLocation.query(trx)
          .whereIn(
            'code',
            originLocations.map(({ city }) => city)
          )
          .select('id')
        await bookingRecord
          .$relatedQuery('originLocations', trx)
          .relate(originLocationsIds.map(({ id }) => id))
        await bookingRecord.$relatedQuery('rooms', trx).insert(
          roomData.map(({ id: ratePlanCode, ...room }) => ({
            bookingId,
            ratePlanCode,
            ...room,
          }))
        )
        if(additionalServices && additionalServices.length > 0)
        {
          await bookingRecord
            .$relatedQuery('services', trx)
            .insert(additionalServices.map((service) => ({ bookingId, service })))
        }

        const bookingResult = await Booking.query(trx)
          .findById(bookingId)
          .withGraphFetched({
            originLocations: true,
            rooms: true,
            services: true,
            venue: { destination: true },
          })
          .select([
            'id',
            'currencyIsoCode',
            'checkInDate',
            'checkOutDate',
            'name',
            'companyName',
            'companyAddress',
            'email',
            'phoneNumber',
            'notes',
            'country',
            'vatNumber',
            'maxTeamSize',
            'url',
          ])
        try {
          await fetch(process.env.ZOHO_CRM_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              venueId,
              hotelidPpn,
              hotelName: bookingResult.venue.hotelName,
              currencyIsoCode,
              checkInDate,
              checkOutDate,
              email,
              phoneNumber,
              name,
              firstName: name && name.split(' ')[0],
              destinationName: bookingResult.venue.destination.title,
              companyName,
              notes,
              country: country.name,
              countryCode: country.code,
              vatNumber,
              companyAddress,
              rooms: roomData.map(
                ({
                  id,
                  quantity,
                  title,
                  boardType,
                  pricePerNight,
                  resortFee,
                  subtotal,
                  taxesAndFees,
                  total,
                }) =>
                  [
                    `id: ${id}`,
                    `quantity: ${quantity}`,
                    `title: ${title}`,
                    `boardType: ${boardType}`,
                    `pricePerNight: ${pricePerNight}`,
                    `resortFee: ${resortFee}`,
                    `subtotal: ${subtotal}`,
                    `taxesAndFees: ${taxesAndFees}`,
                    `total: ${total}`,
                  ].join(', ')
              ),
              totalResortFees: currency.round(totalResortFees),
              totalTaxesAndFees: currency.round(totalTaxesAndFees),
              totalPrice: currency.round(totalPrice),
              services: additionalServices,
              originLocations: originLocations.map(({ city, size }) =>
                [`city: ${city}`, `size: ${size}`].join(', ')
              ),
            }),
          })
        } catch (error) {
          logger.error(
            'requestBooking: Zoho CRM lead',
            new Error(
              'Something went wrong while creating CRM lead during the booking request.'
            )
          )
        }
        return bookingResult
      })
      await sendEmail({
        from: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
        to: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
        templateId: SENDGRID_EMAIL_TEMPLATE_IDS.NEW_BOOKING_REQUEST,
        dynamicTemplateData: getBookingDataForEmail({
          ...booking,
          totalPrice,
          totalResortFees,
          totalTaxesAndFees,
        }),
      })
      return booking.id
    },
  },
}
