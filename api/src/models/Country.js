const { mixin } = require('objection')
const BaseModel = require('./BaseModel')

class Country extends mixin(BaseModel) {
  static get tableName() {
    return 'countries'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['code', 'name'],
      properties: {
        code: { type: 'string', minLength: 2, maxLength: 2 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
      },
    }
  }
}

module.exports = Country
