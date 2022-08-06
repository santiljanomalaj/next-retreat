const destinations = require('./data/destinations')

exports.seed = async (knex) => {
  await knex('destinations').insert(
    destinations.map((destination) => ({ code: destination }))
  )
}
