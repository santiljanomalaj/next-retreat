exports.up = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.string('query_param')
  })

exports.down = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.dropColumn('query_param')
  })
