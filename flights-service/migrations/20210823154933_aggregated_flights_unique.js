exports.up = (knex) =>
  knex.schema
    .alterTable('flights_by_month', async (table) => {
      table.dropUnique(null, 'flights_by_month_date_airports_city_unique')
      table.unique(['date', 'airport_from', 'airport_to', 'city_to', 'city_from'], 'flights_by_month_date_airports_city_unique')
    })
    .alterTable('flights_by_year', async (table) => {
      table.dropUnique(null, 'flights_by_year_airports_city_unique')
      table.unique(['airport_from', 'airport_to', 'city_to', 'city_from'], 'flights_by_year_airports_city_unique')
    })

exports.down = (knex) =>
  knex.schema
    .alterTable('flights_by_month', (table) => {
      table.dropUnique(null, 'flights_by_month_date_airports_city_unique')
      table.unique(['date', 'airport_from', 'airport_to', 'city_to'], 'flights_by_month_date_airports_city_unique')
    })
    .alterTable('flights_by_month', (table) => {
      table.dropUnique(null, 'flights_by_year_airports_city_unique')
      table.unique(['airport_from', 'airport_to', 'city_to'], 'flights_by_year_airports_city_unique')
    })
