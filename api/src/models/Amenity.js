const { mixin } = require('objection')
const BaseModel = require('./BaseModel')

class Amenity extends mixin(BaseModel) {
  static get tableName() {
    return 'amenities'
  }

  static get idColumn() {
    return 'id'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'ppnId'],
      properties: {
        id: { type: 'integer'},
        name: { type: 'string', minLength: 1, maxLength: 255 },
        ppn_id: { type: 'string', minLength: 1, maxLength: 10 },
      },
    }
  }
}

module.exports = Amenity
