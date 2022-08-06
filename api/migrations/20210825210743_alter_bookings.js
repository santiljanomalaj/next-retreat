exports.up = (knex) =>
  knex.schema.alterTable('bookings', (table) => {
    table.integer('user_id')
  })

exports.down = (knex) =>
  knex.schema.alterTable('bookings', (table) => {
    table.integer('user_id')
  })