exports.up = (knex) =>
  knex.schema.alterTable('transformed_flights', async (table) => {
    table.index(['city_from'], 'transformed_flights_city_from_index')
    table.index(['city_to'], 'transformed_flights_city_to_index')
  })

exports.down = (knex) =>
  knex.schema.alterTable('transformed_flights', (table) => {
    table.dropIndex(null, 'transformed_flights_city_from_index')
    table.dropIndex(null, 'transformed_flights_city_to_index')
  })