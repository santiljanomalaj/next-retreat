exports.up = (knex) =>
  knex.schema
    .alterTable('bookings', (table) => {
      table.integer('max_team_size')
      table.text('url')
    })
    .alterTable('booking_rooms', (table) => {
      table.integer('occupancy_limit')
      table.text('cancelation_policy')
    })

exports.down = (knex) =>
  knex.schema
    .alterTable('bookings', (table) => {
      table.dropColumn('max_team_size')
      table.dropColumn('url')
    })
    .alterTable('booking_rooms', (table) => {
      table.dropColumn('occupancy_limit')
      table.dropColumn('cancelation_policy')
    })
