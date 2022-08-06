exports.up = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.boolean('is_approved')
  })

exports.down = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.dropColumn('is_approved')
  })
