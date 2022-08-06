const { mixin } = require('objection')
const BaseModel = require('./BaseModel')

class Airport extends mixin(BaseModel) {
  static get tableName() {
    return 'airports'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'code', 'lat', 'lon'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        code: { type: 'string', minLength: 1, maxLength: 3 },
        lat: { type: 'number' },
        lon: { type: 'number' },
      },
    }
  }
}

module.exports = Airport
