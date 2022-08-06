/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const destinationCities = require('./data/destination_cities')

exports.seed = async (knex) => {
  await knex('destination_cities').del()
  for (const destinationCity of destinationCities) {
    console.log('destinationCity', destinationCity)
    await knex('destination_cities').insert(destinationCity)
  }
  // await knex('destination_cities').insert(destinationCities)
}
