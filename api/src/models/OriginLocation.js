const { mixin, Model } = require('objection')
const BaseModel = require('./BaseModel')
const Country = require('./Country')

class OriginLocation extends mixin(BaseModel) {
  static get tableName() {
    return 'originLocations'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['code', 'kiwiId', 'countryCode'],
      properties: {
        id: { type: 'integer' },
        code: { type: 'string', minLength: 1, maxLength: 10 },
        kiwiId: { type: 'string', minLength: 1, maxLength: 225 },
        lat: { type: 'number' },
        lon: { type: 'number' },
        country: { type: 'string', minLength: 1, maxLength: 255 },
        countryCode: { type: 'string', minLength: 2, maxLength: 2 },
      },
    }
  }

  static get relationMappings() {
    return {
      country: {
        relation: Model.BelongsToOneRelation,
        modelClass: Country,
        join: {
          from: 'originLocations.countryCode',
          to: 'countries.code',
        },
      },
    }
  }
}

module.exports = OriginLocation
