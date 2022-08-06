const currencyRate = require('./utils/currencyRate')
const currencies = require('./data/currencies')

exports.up = async (knex) => {
  await knex.schema
    .createTable('currencies', (table) => {
      table.specificType('iso_code', 'CHAR(3) NOT NULL').primary()
      table.string('title', 255).notNullable()
    })
    .createTable('currency_rates', (table) => {
      table.increments('id').primary()
      table.specificType('currency_iso_code', 'CHAR(3) NOT NULL')
      table
        .foreign('currency_iso_code')
        .references('iso_code')
        .inTable('currencies')
        .onDelete('CASCADE')
      currencyRate({ table, name: 'value' }).notNullable()
      table.datetime('created_at_utc').notNullable()
    })
  await knex('currencies').insert(currencies)
}

exports.down = (knex) =>
  knex.schema
    .dropTableIfExists('currency_rates')
    .dropTableIfExists('currencies')
