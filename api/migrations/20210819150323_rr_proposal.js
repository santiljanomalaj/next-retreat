exports.up = (knex) =>
  knex.schema
    .alterTable('user_trips', (table) => {
      table.string('logo_url')
      table.string('hero_url')
      table.boolean('is_proposal')
    })
    .createTable('user_shared_trips', (table) => {
      table.increments('id').primary()
      table
        .integer('trip_id')
        .unsigned()
        .notNullable()
      table
        .foreign('trip_id')
        .references('id')
        .inTable('user_trips')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
    .createTable('user_trip_variations', (table) => {
      table.increments('id').primary()
      table
        .integer('trip_id')
        .unsigned()
        .notNullable()
      table
        .foreign('trip_id')
        .references('id')
        .inTable('user_trips')
        .onDelete('CASCADE')
      table.date('from', 255).notNullable()
      table.date('to', 255).notNullable()
      table.integer('pax').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('user_trip_variation_prices', (table) => {
      table.increments('id').primary()
      table
        .integer('trip_variation_id')
        .unsigned()
        .notNullable()
      table
        .foreign('trip_variation_id')
        .references('id')
        .inTable('user_trip_variations')
        .onDelete('CASCADE')
      table.integer('venue_id').notNullable()
      table.float('price')
      table.boolean('is_available')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })

exports.down = (knex) =>
  knex.schema.alterTable('user_trips', (table) => {
    table.dropColumn('logo_url')
    table.dropColumn('hero_url')
    table.dropColumn('is_proposal')
  })
    .dropTableIfExists('user_shared_trips')
    .dropTableIfExists('user_trip_variation_prices')
    .dropTableIfExists('user_trip_variations')
