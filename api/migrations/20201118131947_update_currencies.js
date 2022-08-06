const currencies = require('./data/currencies-2020-09-28')

exports.up = async (knex) => {
  await knex('currencies').insert(currencies)
}

exports.down = async (knex) => {
  await knex('currencies')
    .del()
    .whereIn('iso_code', currencies.map(({ iso_code: isoCode }) => isoCode))
}
