
const { mixin, Model } = require('objection')
const BaseModel = require('./BaseModel')
const UserTripVariationPrice = require('./UserTripVariationPrice')

class UserTripVariation extends mixin(BaseModel) {
  static get tableName() {
    return 'user_trip_variations'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['tripId', 'from', 'to', 'pax'],
      properties: {
        id: { type: 'integer' },
        tripId: { type: 'integer' },
        pax: { type: 'integer' },
        from: { type: 'date' },
        to: { type: 'date' },
        createdAt: { type: 'datetime' },
        updatedAt: { type: 'datetime' },
      },
    }
  }

  static get relationMappings() {
    return {
      prices: {
        relation: Model.HasManyRelation,
        modelClass: UserTripVariationPrice,
        join: {
          from: 'user_trip_variations.id',
          to: 'user_trip_variation_prices.trip_variation_id',
        },
      }
    }
  }
}

module.exports = UserTripVariation
