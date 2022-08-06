const { mixin } = require('objection')
const BaseModel = require('./BaseModel')
const { DESTINATION_TYPES } = require('../constants')

class DestinationType extends mixin(BaseModel) {
  static get tableName() {
    return 'destinationTypes'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', enum: DESTINATION_TYPES },
      },
    }
  }
}

module.exports = DestinationType
