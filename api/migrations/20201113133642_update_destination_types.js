/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const updatedTypes = require('./data/types-to-update-2020-09-28')
const BaseModel = require('../src/models/BaseModel')
const Destination = require('../src/models/Destination')
const DestinationType = require('../src/models/DestinationType')

exports.up = async (knex) => {
  BaseModel.knex(knex)

  for (const { id, types } of updatedTypes) {
    await Destination.relatedQuery('types')
      .for(id)
      .unrelate()

    for (const name of types) {
      const { id: destinationTypeId } = await DestinationType.query()
        .findOne({ name })
        .select('id')
      await Destination.relatedQuery('types')
        .for(id)
        .relate(destinationTypeId)
    }
  }
}

exports.down = async () => {}
