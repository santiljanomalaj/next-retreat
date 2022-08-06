
const NodeCache = require("node-cache")
const ApiCommonCache = new NodeCache()

const TTL = {
    SMALL: 60, //1 min
    MEDIUM: 600, // 10 min
    LARGE: 3600 // 1 hour
}

const CACHE_KEYS = {
    CURRENCIES: 'api-currencies'
}

const getCurrencies = async () => {
    if (ApiCommonCache.has(CACHE_KEYS.CURRENCIES)) return ApiCommonCache.get(CACHE_KEYS.CURRENCIES)

    const CurrencyRate = require('../models/CurrencyRate')

    const currencyRatesRaw = await CurrencyRate.knex().raw(`
      SELECT cr.value, cr.currency_iso_code FROM (
        select currency_iso_code, max(id) as id from currency_rates
        group by currency_iso_code
        ) as c
        inner join currency_rates as cr on cr.id = c.id
      `
    )
    const currencyRates = currencyRatesRaw.rows.map(row => ({ value: row.value, currencyIsoCode: row.currency_iso_code }))

    ApiCommonCache.set(CACHE_KEYS.CURRENCIES, currencyRates, TTL.MEDIUM)

    return currencyRates
}


module.exports = {
    getCurrencies
}