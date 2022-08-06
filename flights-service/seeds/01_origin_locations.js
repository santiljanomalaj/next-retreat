const europe = require('./data/originLocations/europe')
const northAmerica = require('./data/originLocations/north-america')
const southAmerica = require('./data/originLocations/south-america')
const asia = require('./data/originLocations/asia')
const africa = require('./data/originLocations/africa')
const oceania = require('./data/originLocations/oceania')

const mapKiwiOriginLocationsToDb = ({ id: kiwiId, code }) => ({ kiwiId, code })

exports.seed = async (knex) => {
  await knex('origin_locations').insert(europe.map(mapKiwiOriginLocationsToDb))
  await knex('origin_locations').insert(
    northAmerica.map(mapKiwiOriginLocationsToDb)
  )
  await knex('origin_locations').insert(
    southAmerica.map(mapKiwiOriginLocationsToDb)
  )
  await knex('origin_locations').insert(asia.map(mapKiwiOriginLocationsToDb))
  await knex('origin_locations').insert(africa.map(mapKiwiOriginLocationsToDb))
  await knex('origin_locations').insert(oceania.map(mapKiwiOriginLocationsToDb))
}
