/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
const destinations = require('./data/destinations')
const airports = require('./data/airports')
const BaseModel = require('../src/models/BaseModel')
const Destination = require('../src/models/Destination')
const DestinationType = require('../src/models/DestinationType')
const Airport = require('../src/models/Airport')
const DestinationClimate = require('../src/models/DestinationClimate')
const { DESTINATION_TYPES } = require('../src/constants')

exports.seed = async (knex) => {
  BaseModel.knex(knex)
  await knex('airports').del()
  await knex('destinations').del()
  await knex('destination_types').del()

  for (const name of DESTINATION_TYPES) {
    await DestinationType.query().insert({ name })
  }
  for (const airport of airports) {
    await Airport.query().insert(airport)
  }
  for (const {
    airportCodes,
    types,
    climateData,
    ...destination
  } of destinations) {
    await Destination.query().insert(destination)
    // link destinations to airports
    for (const code of airportCodes) {
      const { id: airportId } = await Airport.query()
        .findOne({ code })
        .select('id')
      await Destination.relatedQuery('airports')
        .for(destination.id)
        .relate(airportId)
    }
    // link destination types to destinations
    for (const name of types) {
      const { id: destinationTypeId } = await DestinationType.query()
        .findOne({ name })
        .select('id')
      await Destination.relatedQuery('types')
        .for(destination.id)
        .relate(destinationTypeId)
    }
    // link destinations to climates
    for (const [key, value] of Object.entries(climateData)) {
      await DestinationClimate.query().insert({
        destinationId: destination.id,
        month: key,
        valueCelsius: value,
      })
    }
  }
}
