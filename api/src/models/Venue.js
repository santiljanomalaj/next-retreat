const path = require('path')
const { mixin, Model } = require('objection')
const BaseModel = require('./BaseModel')
const Amenity = require('./Amenity')
const Airport = require('./Airport')
const VenuePhoto = require('./VenuePhoto')
const { decimal } = require('./utils/types')

class Venue extends mixin(BaseModel) {
  static get tableName() {
    return 'venues'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'destinationId',
        'cityid_ppn',
        'city',
        'hotelid_ppn',
        'hotel_name',
        'hotel_address',
        'country',
        'country_code',
        'lat',
        'lon',
        'review_rating',
        'thumbnail',
        'room_count',
        'check_in',
        'check_out',
      ],
      properties: {
        id: { type: 'integer' },
        destinationId: { type: 'string' },
        cityid_ppn: { type: 'integer' },
        city: { type: 'string' },
        hotelid_ppn: { type: 'integer' },
        hotelid_a: { type: 'integer' },
        hotelid_t: { type: 'integer' },
        hotelid_b: { type: 'integer' },
        hotel_type: { type: 'string' },
        hotel_name: { type: 'string' },
        hotel_address: { type: 'string' },
        state: { type: 'string' },
        country: { type: 'string' },
        country_code: { type: 'string' },
        state_code: { type: 'string' },
        lat: { type: 'number' },
        lon: { type: 'number' },
        area_id: { type: 'string' },
        postal_code: { type: 'string' },

        star_rating: { type: 'integer' },
        low_rate: { type: decimal },
        currency_code: { type: 'string' },
        review_rating: { type: 'number' },
        review_count: { type: 'integer' },
        rank_score_ppn: { type: 'integer' },
        chain_id_ppn: { type: 'integer' },

        thumbnail: { type: 'text' },
        has_photos: { type: 'boolean' },
        room_count: { type: 'integer' },
        check_in: { type: 'string' },
        check_out: { type: 'string' },

        property_description: { type: 'text' },

        creation_date_time: { type: 'datetime' },
        mod_date_time: { type: 'datetime' },

        agd_flag: { type: 'boolean' },
        mer_flag: { type: 'boolean' },
        smop_flag: { type: 'boolean' },

        isPromoted: { type: 'boolean' },
        isActive: { type: 'boolean' },
        updatedAt: { type: 'datetime' },

        bkg_flag: { type: 'boolean' },

        isQuality: { type: 'boolean' },
        isManualQuality: { type: 'boolean' },
        source: { type: 'string' },
        capacity: { type: 'integer' },
      },
    }
  }

  static get relationMappings() {
    return {
      amenities: {
        relation: Model.ManyToManyRelation,
        modelClass: Amenity,
        join: {
          from: 'venues.id',
          through: {
            from: 'amenitiesVenue.venueId',
            to: 'amenitiesVenue.amenityId',
          },
          to: 'amenities.id',
        },
      },
      destination: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Destination'),
        join: {
          from: 'venues.destinationId',
          to: 'destinations.id',
        },
      },
      airports: {
        relation: Model.ManyToManyRelation,
        modelClass: Airport,
        join: {
          from: 'venues.id',
          through: {
            from: 'airportsVenues.venueId',
            to: 'airportsVenues.airportsId',
            extra: ['distanceInKilometers'],
          },
          to: 'airports.id',
        },
      },
      photos: {
        relation: Model.HasManyRelation,
        modelClass: VenuePhoto,
        join: {
          from: 'venues.id',
          to: 'venuePhotos.venueId',
        },
      },
    }
  }
}

module.exports = Venue
