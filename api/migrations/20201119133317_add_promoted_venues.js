const promotedVenuePPNs = require('./data/promotedVenuePPNs-2020-09-28')

exports.up = async (knex) => {
  await knex('venues')
    .whereIn('hotelid_ppn', promotedVenuePPNs)
    .update('is_promoted', true)
}

exports.down = async (knex) => {
  await knex('venues')
    .whereIn('hotelid_ppn', promotedVenuePPNs)
    .update('is_promoted', false)
}
