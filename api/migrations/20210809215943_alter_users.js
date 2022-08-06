exports.up = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.boolean('ml_sent')
  })

exports.down = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.dropColumn('ml_sent')
  })
