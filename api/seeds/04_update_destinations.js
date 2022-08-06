/* eslint-disable camelcase */
const destinations = require('./data/destinations')

exports.seed = async (knex) => {
  const destinationsKiwiCityIds = await knex('destinations').select(
    'id',
    'kiwi_city_id'
  )
  const destination_climate = destinations.reduce(
    (acc, { kiwiCityId, climateData }) => {
      const climatesArray = Object.entries(climateData)
      const destination = destinationsKiwiCityIds.find(
        (d) => d.kiwiCityId === kiwiCityId
      )
      return [
        ...acc,
        ...climatesArray.map(([month, valueCelsius]) => ({
          destination_id: destination.id,
          month,
          value_celsius: valueCelsius,
        })),
      ]
    },
    []
  )
  await knex('destination_climate').del()
  await knex('destination_climate').insert(destination_climate)
  await knex.transaction(async (trx) => {
    const queries = destinations.map(({ kiwiCityId, description }) =>
      knex('destinations')
        .where('kiwi_city_id', kiwiCityId)
        .update({ description })
        .transacting(trx)
    )
    await Promise.all(queries)
  })
}
