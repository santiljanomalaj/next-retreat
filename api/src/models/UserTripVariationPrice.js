const { mixin } = require('objection')
const BaseModel = require('./BaseModel')

class UserTripVariationPrice extends mixin(BaseModel) {
  static get tableName() {
    return 'user_trip_variation_prices'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['venueId', 'tripVariationId', 'price'],
      properties: {
        id: { type: 'integer' },
        venueId: { type: 'integer' },
        tripVariationId: { type: 'integer' },
        price: { type: 'number' },
        is_available: { type: 'boolean' },
        createdAt: { type: 'datetime' },
        updatedAt: { type: 'datetime' },
      },
    }
  }
}

module.exports = UserTripVariationPrice
