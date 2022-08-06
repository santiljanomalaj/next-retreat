const { mixin } = require('objection')
const BaseModel = require('./BaseModel')

class RoomSearchData extends mixin(BaseModel) {
  static get tableName() {
    return 'roomSearchData'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['isSingleRoomsOnly', 'roomCount'],
      properties: {
        id: { type: 'integer' },
        maxTeamSize: { type: 'integer' },
        isSingleRoomsOnly: { type: 'boolean' },
        roomCount: { type: 'integer' },
        ip: { type: 'string' },
        createdAt: { type: 'datetime' },
      },
    }
  }
}

module.exports = RoomSearchData
