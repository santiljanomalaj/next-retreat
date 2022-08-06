exports.up = (knex) =>
  knex.schema
    .alterTable('flights_by_month', async (table) => {
      table.string('city_from', 3)
    })
    .alterTable('flights_by_year', async (table) => {
      table.string('city_from', 3)
    })

exports.down = (knex) =>
  knex.schema
    .alterTable('flights_by_month', (table) => {
      table.dropColumn('city_from')
    })
    .alterTable('flights_by_year', (table) => {
      table.dropColumn('city_from')
    })
