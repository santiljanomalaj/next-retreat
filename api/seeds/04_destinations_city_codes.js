const destinationsCityCodes = require('./data/destinations_city_codes')

exports.seed = async (knex) => {
  await knex('destinations_city_codes').del()
  await knex('destinations_city_codes').insert(destinationsCityCodes)
}
