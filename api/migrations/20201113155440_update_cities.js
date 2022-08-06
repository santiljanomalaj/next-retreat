const cities = require('./data/cities-2020-09-28')
const removedCities = require('./data/cities-to-remove-2020-09-28')

exports.up = async (knex) => {
  await knex('destination_cities')
    .del()
    .whereIn('ppn_city_id', removedCities.map(({ ppnCityId }) => ppnCityId))
  await knex('destination_cities').insert(cities)
}

exports.down = async () => {}
