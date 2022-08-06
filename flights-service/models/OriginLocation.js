// const { mixin } = require('objection')
// const BaseModel = require('./BaseModel')

// class OriginLocation extends mixin(BaseModel) {
//   static get tableName() {
//     return 'origin_locations'
//   }

//   static get jsonSchema() {
//     return {
//       type: 'object',
//       required: ['code', 'kiwiId'],
//       properties: {
//         id: { type: 'integer' },
//         code: { type: 'string', minLength: 1, maxLength: 10 },
//         kiwiId: { type: 'string', minLength: 1, maxLength: 225 },
//       },
//     }
//   }
// }

// module.exports = OriginLocation
