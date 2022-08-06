const { mixin } = require('objection')
const BaseModel = require('./BaseModel')
const { MONTHS } = require('../constants')

class DestinationClimate extends mixin(BaseModel) {
  static get tableName() {
    return 'destinationClimate'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['valueCelsius', 'month', 'destinationId'],
      properties: {
        id: { type: 'integer' },
        valueCelsius: { type: 'number' },
        month: { type: 'string', enum: MONTHS },
        destinationId: { type: 'string' },
      },
    }
  }
}

module.exports = DestinationClimate
