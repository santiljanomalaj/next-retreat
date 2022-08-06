exports.up = async (knex) =>
  knex.schema.createTable('flights_syncs', (table) => {
    table.increments('id').primary()
    table.date('date').notNullable()
    table
      .datetime('sync_start_at')
      .notNullable()
      .defaultTo(knex.fn.now())
    table.datetime('sync_end_at')
  })

exports.down = (knex) => knex.schema.dropTableIfExists('flights_syncs')
