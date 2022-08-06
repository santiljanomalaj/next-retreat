require('dotenv').config()
const fetch = require('node-fetch')
const Knex = require('knex')
const { Model } = require('objection')
const dbConfig = require('../config/db')
const logger = require('../src/utils/logger')
const { BASE_CURRENCY_ISO_CODE } = require('../src/constants')
const Currency = require('../src/models/Currency')
const CurrencyRate = require('../src/models/CurrencyRate')

const knex = Knex(dbConfig)
Model.knex(knex)

const fetchCurrencyRates = async (currencyIsoCodes) => {
  try {
    const response = await fetch(
      `http://api.exchangeratesapi.io/latest?base=${BASE_CURRENCY_ISO_CODE}&symbols=${currencyIsoCodes.join(
        ','
      )}&access_key=${process.env.EXCHANGERATES_API_KEY}`
    )
    const { error, rates } = await response.json()
    if (error) {
      throw new Error(error)
    }
    return rates
  } catch (error) {
    logger.error('fetchCurrencyRate:error', error)
    throw error
  }
}

const syncCurrencyRates = async () => {
  logger.info('currencyRates:sync')
  try {
    const currencyIsoCodesQuery = await Currency.query()
      .whereNot({ isoCode: BASE_CURRENCY_ISO_CODE })
      .select('isoCode')
    const currencyIsoCodes = currencyIsoCodesQuery.map(
      (currency) => currency.isoCode
    )
    const syncedCurrencyIsoCodeQuery = await CurrencyRate.query()
      .where(
        'createdAtUtc',
        '>',
        CurrencyRate.knex().raw(`(NOW() - INTERVAL '1 HOURS')`)
      )
      .select('currencyIsoCode')
    const syncedCurrencyIsoCode = syncedCurrencyIsoCodeQuery.map(
      ({ currencyIsoCode }) => currencyIsoCode
    )
    const currencyIsoCodesToSync = currencyIsoCodes.filter(
      (isoCode) => !syncedCurrencyIsoCode.includes(isoCode)
    )
    if (currencyIsoCodesToSync.length === 0) {
      logger.warn('currencyRates:alreadySynced')
      process.exit()
    }
    const rates = await fetchCurrencyRates(currencyIsoCodesToSync)
    const currencyRateValues = Object.entries(rates)
      .map(([key, value]) => `('${key}', ${value}, 'NOW()')`)
      .join(',')
    await CurrencyRate.knex().raw(`
      INSERT INTO currency_rates (currency_iso_code, value, created_at_utc) VALUES ${currencyRateValues}
    `)
    process.exit()
  } catch (error) {
    logger.error('currencyRates:sync', error)
    process.exit(1)
  }
}

const run = async () => {
  await syncCurrencyRates()
}
run()
