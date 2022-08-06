const { Model, mixin } = require('objection')
const BaseModel = require('./BaseModel')
const Currency = require('./Currency')
const types = require('./utils/types')

class CurrencyRate extends mixin(BaseModel) {
  static get tableName() {
    return 'currencyRates'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['currencyIsoCode', 'value'],
      properties: {
        id: { type: 'integer' },
        currencyIsoCode: { type: 'string', minLength: 3, maxLength: 3 },
        value: { type: types.decimal },
        createdAtUtc: { type: 'datetime' },
      },
    }
  }

  static get relationMappings() {
    return {
      currency: {
        relation: Model.BelongsToOneRelation,
        modelClass: Currency,
        join: {
          from: 'currencyRates.currencyIsoCode',
          to: 'currencies.isoCode',
        },
      },
    }
  }
}

module.exports = CurrencyRate
