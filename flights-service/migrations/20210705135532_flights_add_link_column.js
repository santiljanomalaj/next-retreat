exports.up = (knex) =>
  knex.schema
    .alterTable('transformed_flights', async (table) => {
      table.string('deep_link', 5000)
    })
    .alterTable('temporary_flights', async (table) => {
      table.string('deep_link', 5000)
    })

exports.down = (knex) =>
  knex.schema
    .alterTable('transformed_flights', (table) => {
      table.dropColumn('deep_link')
    })
    .alterTable('temporary_flights', (table) => {
      table.dropColumn('deep_link')
    })
