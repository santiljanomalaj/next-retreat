const { mixin, Model } = require('objection')
const BaseModel = require('./BaseModel')

class UserSharedTrip extends mixin(BaseModel) {
  static get tableName() {
    return 'UserSharedTrips'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'tripId'],
      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
        tripId: { type: 'integer' }
      },
    }
  }
}

module.exports = UserSharedTrip
