exports.up = (knex) =>
  knex.schema
    .alterTable('user_trips', (table) => {
      table.string('requirements')
    })

exports.down = (knex) =>
  knex.schema.alterTable('trips', (table) => {
    table.dropColumn('requirements')
  })
