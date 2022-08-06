const { mixin } = require('objection')
const BaseModel = require('./BaseModel')

class VenuePhoto extends mixin(BaseModel) {
  static get tableName() {
    return 'venuePhotos'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['venueId', 'url'],
      properties: {
        id: { type: 'integer' },
        venueId: { type: 'integer' },
        url: { type: 'string' },
        is_hero: { type: 'boolean' },
      },
    }
  }
}

module.exports = VenuePhoto
