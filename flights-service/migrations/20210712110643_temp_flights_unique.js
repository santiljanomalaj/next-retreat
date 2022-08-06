exports.up = (knex) =>
  knex.schema.alterTable('temporary_flights', async (table) => {
    table.unique(['airport_from', 'airport_to', 'date'])
  })

exports.down = (knex) =>
  knex.schema.alterTable('temporary_flights', (table) => {
    table.dropUnique(null, 'temporary_flights_airport_from_airport_to_date_unique')
  })
