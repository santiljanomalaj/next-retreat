const { mixin } = require('objection')
const BaseModel = require('./BaseModel')
const { ADDITIONAL_SERVICES } = require('../constants')

class BookingService extends mixin(BaseModel) {
  static get tableName() {
    return 'bookingServices'
  }

  static get idColumn() {
    return 'bookingId'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['bookingId', 'service'],
      properties: {
        bookingId: { type: 'integer' },
        service: { type: 'string', enum: Object.values(ADDITIONAL_SERVICES) },
      },
    }
  }
}

module.exports = BookingService
