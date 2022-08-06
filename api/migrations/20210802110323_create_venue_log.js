exports.up = (knex) =>
  knex.schema.createTable('venue_log', (table) => {
    table.increments('id').primary()
    table.integer('venue_id')
    table.string('event')
    table.string('type')
    table.string('user')
    table
      .datetime('created_at')
      .notNullable()
      .defaultTo(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTableIfExists('venue_log')
