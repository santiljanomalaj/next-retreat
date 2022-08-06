const money = require('./utils/money')

exports.up = (knex) =>
  knex.schema
    .createTable('temporary_flights', (table) => {
      table
        .increments('id')
        .primary()
        .unsigned()
      table.date('date')
      table.integer('duration')
      money({ table, name: 'price' })
      table.string('city_from', 255)
      table.string('city_to', 255)
      table.string('airport_from', 255)
      table.string('airport_to', 255)
      table.integer('stopover_count')
      table.index(['date', 'duration', 'price', 'airport_from', 'airport_to'])
    })
    .createTable('transformed_flights', (table) => {
      table
        .increments('id')
        .primary()
        .unsigned()
      table.date('date')
      table.integer('duration')
      money({ table, name: 'price' })
      table.string('city_from', 255)
      table.string('city_to', 255)
      table.string('airport_from', 255)
      table.string('airport_to', 255)
      table.integer('stopover_count')
      table.timestamps(true, true)
      table.index([
        'date',
        'city_from',
        'city_to',
        'airport_from',
        'airport_to',
      ])
      table.unique(['date', 'airport_from', 'airport_to'])
    })

exports.down = (knex) =>
  knex.schema
    .dropTableIfExists('transformed_flights')
    .dropTableIfExists('temporary_flights')
