const { mixin } = require('objection')
const BaseModel = require('./BaseModel')

class DestinationCityCode extends mixin(BaseModel) {
  static get tableName() {
    return 'destinationsCityCodes'
  }

  static get idColumn() {
    return ['cityCode', 'destinationId']
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['cityCode', 'destinationId'],
      properties: {
        cityCode: { type: 'string' },
        destination_id: { type: 'string' },
      },
    }
  }
}

module.exports = DestinationCityCode
