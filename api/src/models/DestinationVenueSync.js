const { mixin } = require('objection')
const BaseModel = require('./BaseModel')

class DestinationVenueSync extends mixin(BaseModel) {
  static get tableName() {
    return 'destinationVenueSyncs'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['destinationId'],
      properties: {
        id: { type: 'integer' },
        destinationId: { type: 'string' },
        syncStartAt: { type: 'datetime' },
        syncEndAt: { type: 'datetime' },
      },
    }
  }
}

module.exports = DestinationVenueSync
