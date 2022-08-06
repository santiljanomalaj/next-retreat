const { mixin } = require('objection')
const BaseModel = require('./BaseModel')

class AvailableAirport extends mixin(BaseModel) {
  static get tableName() {
    return 'available_airports'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        from: { type: 'string', minLength: 1, maxLength: 3 },
        to: { type: 'string', minLength: 1, maxLength: 3 }
      },
    }
  }
}

module.exports = AvailableAirport
