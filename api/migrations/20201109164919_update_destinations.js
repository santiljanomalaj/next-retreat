/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const airports = require('./data/airports-2020-09-28')
const destinations = require('./data/destinations-2020-09-28')
const Airport = require('../src/models/Airport')
const BaseModel = require('../src/models/BaseModel')
const Destination = require('../src/models/Destination')
const DestinationClimate = require('../src/models/DestinationClimate')
const DestinationType = require('../src/models/DestinationType')

exports.up = async (knex) => {
  BaseModel.knex(knex)

  await DestinationType.query().insert({ name: 'CITY' })

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

  Destination.query()
    .patch({
      desciption:
        'A historic county in South East England features all you need to escape from the reality: boat safari rides, stunning seafront estates and more.',
    })
    .where({ id: 'SUSSEX_UK' })
}

exports.down = async (knex) => {
  BaseModel.knex(knex)

  for (const { id } of destinations) {
    // unlink destinations from climates
    await DestinationClimate.query()
      .delete()
      .where({ destinationId: id })

    // unlink destination types from destinations
    await Destination.relatedQuery('types')
      .for(id)
      .unrelate()

    // unlink destinations from airports
    await Destination.relatedQuery('airports')
      .for(id)
      .unrelate()

    await Destination.query()
      .delete()
      .where({ id })
  }

  await Airport.query()
    .delete()
    .whereIn('code', airports.map(({ code }) => code))

  await DestinationType.query()
    .delete()
    .where({ name: 'CITY' })
}
