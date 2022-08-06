const { mixin } = require('objection')
const BaseModel = require('./BaseModel')
const { decimal } = require('./utils/types')

class BookingRoom extends mixin(BaseModel) {
  static get tableName() {
    return 'bookingRooms'
  }

  static get idColumn() {
    return 'bookingId'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'bookingId',
        'ratePlanCode',
        'title',
        'quantity',
        'boardType',
        'pricePerNight',
        'resortFee',
        'subtotal',
        'taxesAndFees',
        'total',
        'occupancyLimit',
        'cancelationPolicy',
      ],
      properties: {
        bookingId: { type: 'integer' },
        ratePlanCode: { type: 'string' },
        title: { type: 'string' },
        quantity: { type: 'number' },
        boardType: { type: 'string' },
        pricePerNight: { type: decimal },
        resortFee: { type: decimal },
        subtotal: { type: decimal },
        taxesAndFees: { type: decimal },
        total: { type: decimal },
        occupancyLimit: { type: 'number' },
        cancelationPolicy: { tyoe: 'string' },
      },
    }
  }
}

module.exports = BookingRoom
