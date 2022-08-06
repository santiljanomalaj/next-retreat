const { mixin, Model } = require('objection')
const BaseModel = require('./BaseModel')
const UserTrip = require('./UserTrip')
const Venue = require('./Venue')

class UserTripVenue extends mixin(BaseModel) {
  static get tableName() {
    return 'userTripVenues'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['tripId', 'venueId'],
      properties: {
        id: { type: 'integer' },
        tripId: { type: 'integer' },
        venueId: { type: 'integer' },
      },
    }
  }

  static get relationMappings() {
    return {
      trip: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserTrip,
        join: {
          from: 'userTripVenues.tripId',
          to: 'userTrips.id',
        },
      },
      venue: {
        relation: Model.BelongsToOneRelation,
        modelClass: Venue,
        join: {
          from: 'userTripVenues.venueId',
          to: 'venues.id',
        },
      },
    }
  }
}

module.exports = UserTripVenue
