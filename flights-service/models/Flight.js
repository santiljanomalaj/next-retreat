const { mixin } = require('objection')
const BaseModel = require('./BaseModel')
const { decimal } = require('./utils/types')

class Flight extends mixin(BaseModel) {
  static get tableName() {
    return 'temporaryFlights'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'price',
        'duration',
        'date',
        'cityFrom',
        'cityTo',
        'airportFrom',
        'airportTo',
        'stopoverCount',
      ],
      properties: {
        date: { type: 'string', minLength: 1, maxLength: 225 },
        price: { type: decimal },
        duration: { type: 'integer' },
        cityFrom: { type: 'string', minLength: 1, maxLength: 225 },
        cityTo: { type: 'string', minLength: 1, maxLength: 225 },
        airportFrom: { type: 'string', minLength: 1, maxLength: 225 },
        airportTo: { type: 'string', minLength: 1, maxLength: 225 },
        stopoverCount: { type: 'integer' },
        deepLink: { type: 'string', minLength: 1, maxLength: 5000 },
      },
    }
  }
}

module.exports = Flight
