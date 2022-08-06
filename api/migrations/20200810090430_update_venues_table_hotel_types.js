/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */

const hotelTypeMap = require('../scripts/data/hotelTypeMap')

exports.up = async (knex) => {
  await knex.transaction(async (trx) => {
    for (const [word, hotel_type] of hotelTypeMap) {
      await knex('venues')
        .update({ hotel_type })
        .whereNull('hotel_type')
        .andWhereRaw(`hotel_name ~* '\\y(\\?:${word.replace(/'/g, "''")})\\y'`)
        .transacting(trx)
    }
    await knex('venues')
      .update('hotel_type', 'Other')
      .whereNull('hotel_type')
      .transacting(trx)
  })
}

exports.down = async () => {}
