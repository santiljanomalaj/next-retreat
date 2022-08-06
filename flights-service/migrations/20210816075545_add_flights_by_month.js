const money = require('./utils/money')

exports.up = async (knex) =>
    knex.schema.createTable('flights_by_month', (table) => {
        table.increments('id').primary()
        table.string('airport_from', 3)
        table.string('airport_to', 3)
        table.string('city_to', 3)
        table.string('date', 7)
        table.integer('duration')
        table.integer('step_overs')
        money({ table, name: 'price' })
        table.unique(['date', 'airport_from', 'airport_to', 'city_to'], 'flights_by_month_date_airports_city_unique')
    })

exports.down = (knex) =>
    knex.schema
        .alterTable('flights_by_month', (table) => {
            table.dropUnique(null, 'flights_by_month_date_airports_city_unique')
        })
        .dropTableIfExists('flights_by_month')