exports.up = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.datetime('first_login')
  })

exports.down = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.dropColumn('first_login')
  })
