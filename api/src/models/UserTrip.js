const { mixin, Model } = require('objection')
const BaseModel = require('./BaseModel')
const Venue = require('./Venue')
const UserTripVariation = require('./UserTripVariation')

class UserTrip extends mixin(BaseModel) {
  static get tableName() {
    return 'userTrips'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'name'],
      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        logo_url: { type: 'string'},
        hero_url: { type: 'string'},
        is_proposal: { type: 'boolean'},
        shareToken: { type: 'string' },
        requirements: { type: 'string' },
        createdAt: { type: 'datetime' },
        updatedAt: { type: 'datetime' },
      },
    }
  }

  static get relationMappings() {
    return {
      venues: {
        relation: Model.ManyToManyRelation,
        modelClass: Venue,
        join: {
          from: 'userTrips.id',
          through: {
            from: 'userTripVenues.tripId',
            to: 'userTripVenues.venueId',
          },
          to: 'venues.id',
        },
      },
      variations: {
        relation: Model.HasManyRelation,
        modelClass: UserTripVariation,
        join: {
          from: 'user_trips.id',
          to: 'user_trip_variations.trip_id',
        },
      }
    }
  }
}

module.exports = UserTrip
