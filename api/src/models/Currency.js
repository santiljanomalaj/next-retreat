const { Model, mixin } = require('objection')
const BaseModel = require('./BaseModel')

class Currency extends mixin(BaseModel) {
  static get tableName() {
    return 'currencies'
  }

  static get idColumn() {
    return 'isoCode'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['isoCode', 'title', 'symbol'],
      properties: {
        isoCode: { type: 'string', minLength: 3, maxLength: 3 },
        title: { type: 'string' },
        symbol: { type: 'string' },
      },
    }
  }

  static get relationMappings() {
    return {
      currencyRates: {
        relation: Model.HasManyRelation,
        modelClass: Currency,
        join: {
          from: 'currencies.isoCode',
          to: 'currencyRates.currencyIsoCode',
        },
      },
    }
  }
}

module.exports = Currency
