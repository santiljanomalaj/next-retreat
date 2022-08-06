exports.up = (knex) =>
  knex.schema.alterTable('user_trips', (table) => {
    table.string('share_token', 255)
  })

exports.down = (knex) =>
  knex.schema.alterTable('user_trips', (table) => {
    table.dropColumn('share_token')
  })
