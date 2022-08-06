const promotedVenuePPNs = require('./data/promotedVenuePPNs')

exports.up = async (knex) => {
  await knex.schema.alterTable('venues', (table) => {
    table
      .boolean('is_promoted')
      .defaultTo(false)
      .notNullable()
  })
  await knex('venues')
    .whereIn('hotelid_ppn', promotedVenuePPNs)
    .update('is_promoted', true)
}

exports.down = (knex) =>
  knex.schema.alterTable('venues', (table) => {
    table.dropColumn('is_promoted')
  })
