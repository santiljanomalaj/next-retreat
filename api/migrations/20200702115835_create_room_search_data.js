exports.up = (knex) =>
  knex.schema.createTable('room_search_data', (table) => {
    table.increments('id').primary()
    table.integer('max_team_size')
    table.boolean('is_single_rooms_only')
    table.integer('room_count')
    table.string('ip')
    table
      .datetime('created_at')
      .notNullable()
      .defaultTo(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTableIfExists('room_search_data')
