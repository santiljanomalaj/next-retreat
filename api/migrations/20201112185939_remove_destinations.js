/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const BaseModel = require('../src/models/BaseModel')
const Destination = require('../src/models/Destination')
const DestinationClimate = require('../src/models/DestinationClimate')
const Venue = require('../src/models/Venue')

const DESTINATIONS_TO_DELETE = [
  'HIGH_TATRAS_SK',
  'SAINT_PETERSBURG_RU',
  'MOSCOW_RU',
]

exports.up = async (knex) => {
  BaseModel.knex(knex)

  for (const id of DESTINATIONS_TO_DELETE) {
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

    const venueIds = await Destination.relatedQuery('venues')
      .for(id)
      .select('id')

    for (const venueId of venueIds) {
      await Venue.relatedQuery('amenities')
        .for(venueId)
        .unrelate()

      await Venue.relatedQuery('airports')
        .for(venueId)
        .unrelate()
    }

    // unlink destinations from venues
    await Destination.relatedQuery('venues')
      .for(id)
      .unrelate()

    await Destination.query()
      .delete()
      .where({ id })
  }
}

exports.down = async () => {}
