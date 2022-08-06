exports.up = (knex) =>
  knex.schema
    .alterTable('users', (table) => {
      table.dropColumn('name')
      table
        .string('email', 255)
        .notNullable()
        .unique()
      table.string('access_token', 255)
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('user_trips', (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('name', 255).notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('user_trip_venues', (table) => {
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
        .integer('venue_id')
        .unsigned()
        .notNullable()
      table
        .foreign('venue_id')
        .references('id')
        .inTable('venues')
        .onDelete('CASCADE')
    })

exports.down = (knex) =>
  knex.schema
    .alterTable('users', (table) => {
      table.string('name', 45)
      table.dropColumn('email')
      table.dropColumn('access_token')
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
    })
    .dropTableIfExists('user_trip_venues')
    .dropTableIfExists('user_trips')
