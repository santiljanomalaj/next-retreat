const coordinates = require('./utils/coordinates')
const money = require('./utils/money')

exports.up = (knex) =>
  knex.schema
    .createTable('venue_types', (table) => {
      table.increments('id').primary()
      table.string('name', 255)
    })
    .createTable('venues', (table) => {
      table.increments('id').primary()
      table.string('destination_id').notNullable()
      table
        .foreign('destination_id')
        .references('id')
        .inTable('destinations')
        .onDelete('CASCADE')
      table.integer('cityid_ppn')
      table.string('city')
      table.integer('hotelid_ppn').unique()
      table.integer('hotelid_a')
      table.integer('hotelid_t')
      table.integer('hotelid_b')
      table.string('hotel_type')
      table.string('hotel_name')
      table.string('hotel_address')
      table.string('state')
      table.string('country')
      table.string('country_code')
      table.string('state_code')
      coordinates({ table })
      table.string('area_id')
      table.string('postal_code')

      table.integer('star_rating')
      money({ table, name: 'low_rate' })
      table.string('currency_code')
      table.float('review_rating')
      table.integer('review_count')
      table.integer('rank_score_ppn')
      table.integer('chain_id_ppn')

      table.text('thumbnail')
      table.boolean('has_photos')
      table.integer('room_count')
      table.string('check_in')
      table.string('check_out')

      table.text('property_description')

      table.string('creation_date_time')
      table.string('mod_date_time')

      table.boolean('is_meeting_room_included').defaultTo(false)

      table.boolean('agd_flag')
      table.boolean('mer_flag')
      table.boolean('smop_flag')
    })
    .createTable('venue_photos', (table) => {
      table.increments('id').primary()
      table.text('url')
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
    .createTable('amenities', (table) => {
      table.string('ppn_id', 10).primary() // 6 is the max they use right now, but we should probably be future-proof here
      table.string('name', 255)
      table.integer('work_leisure_balance_score')
    })
    .createTable('amenities_venue', (table) => {
      table
        .string('amenity_id')
        .references('ppn_id')
        .inTable('amenities')
      table
        .integer('venue_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('venues')
    })
    .createTable('airports_venues', (table) => {
      table
        .integer('airports_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('airports')
      table
        .integer('venue_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('venues')
      table.float('distance_in_kilometers')
    })

exports.down = (knex) =>
  knex.schema
    .dropTableIfExists('amenities_venue')
    .dropTableIfExists('amenities')
    .dropTableIfExists('venue_photos')
    .dropTableIfExists('airports_venues')
    .dropTableIfExists('venues')
    .dropTableIfExists('venue_types')
