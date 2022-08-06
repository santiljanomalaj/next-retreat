const { mixin } = require('objection')
const BaseModel = require('./BaseModel')

class FlightsSync extends mixin(BaseModel) {
  static get tableName() {
    return 'flightsSyncs'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['date'],
      properties: {
        id: { type: 'integer' },
        date: { type: 'string', minLength: 1, maxLength: 225 },
        syncStartAt: { type: 'datetime' },
        syncEndAt: { type: 'datetime' },
      },
    }
  }
}

module.exports = FlightsSync
