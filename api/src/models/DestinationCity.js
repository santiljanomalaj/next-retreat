const { mixin } = require('objection')
const BaseModel = require('./BaseModel')

class DestinationCity extends mixin(BaseModel) {
  static get tableName() {
    return 'destinationCities'
  }

  static get idColumn() {
    return ['ppnCityId', 'destinationId']
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ppnCityId', 'city', 'destinationId'],
      properties: {
        id: { type: 'integer' },
        city: { type: 'string', minLength: 1, maxLength: 255 },
        ppnCityId: { type: 'string' },
        destination_id: { type: 'integer' },
      },
    }
  }
}

module.exports = DestinationCity
