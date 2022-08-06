const { ADDITIONAL_SERVICES } = require('../src/constants')

exports.up = (knex) =>
  knex.schema
    .createTable('bookings', (table) => {
      table
        .increments('id')
        .primary()
        .unsigned()
      table.integer('user_id')
      table.integer('venue_id')
      table
        .foreign('venue_id')
        .references('id')
        .inTable('venues')
        .onDelete('SET NULL')
      table.integer('hotelid_ppn')
      table.string('hotel_name')
      table.string('currency_iso_code')
      table.date('check_in_date')
      table.date('check_out_date')
      table.string('email', 255)
      table.string('phone_number', 255)
      table.string('name', 255)
      table.string('company_name', 255)
      table.text('notes')
      table.string('country', 255)
      table.string('vat_number', 255)
      table.string('company_address')
      table.timestamps(true, true)
    })
    .createTable('booking_rooms', (table) => {
      table.integer('booking_id')
      table
        .foreign('booking_id')
        .references('id')
        .inTable('bookings')
        .onDelete('CASCADE')
      table.string('rate_plan_code')
      table.string('title', 255)
      table.integer('quantity')
      table.string('board_type')
      table.float('price_per_night')
      table.float('resort_fee')
      table.float('subtotal')
      table.float('taxes_and_fees')
      table.float('total')
    })
    .createTable('booking_services', (table) => {
      table.integer('booking_id')
      table
        .foreign('booking_id')
        .references('id')
        .inTable('bookings')
        .onDelete('CASCADE')
      table.enum('service', Object.values(ADDITIONAL_SERVICES))
    })
    .createTable('booking_origin_locations', (table) => {
      table.integer('booking_id')
      table
        .foreign('booking_id')
        .references('id')
        .inTable('bookings')
        .onDelete('CASCADE')
      table.integer('origin_locations_id')
      table
        .foreign('origin_locations_id')
        .references('id')
        .inTable('origin_locations')
        .onDelete('CASCADE')
    })

exports.down = (knex) =>
  knex.schema
    .dropTableIfExists('bookings')
    .dropTableIfExists('booking_rooms')
    .dropTableIfExists('booking_services')
