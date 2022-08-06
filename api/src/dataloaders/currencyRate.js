const { BASE_CURRENCY_ISO_CODE } = require('../constants')
const CurrencyRate = require('../models/CurrencyRate')

const currencyRate = async ([currencyIsoCode]) => {
  if (currencyIsoCode === BASE_CURRENCY_ISO_CODE) {
    return [1]
  }
  const currencyRateFromDb = await CurrencyRate.query()
    .where({ currencyIsoCode })
    .orderBy('createdAtUtc', 'desc')
    .select('value')
    .first()
  return [currencyRateFromDb.value]
}

module.exports = currencyRate
