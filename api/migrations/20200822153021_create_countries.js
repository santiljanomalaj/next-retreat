/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const countries = require('./data/countries')
const destinations = require('../seeds/data/destinations')
const europe = require('../seeds/data/originLocations/europe')
const northAmerica = require('../seeds/data/originLocations/north-america')
const southAmerica = require('../seeds/data/originLocations/south-america')
const asia = require('../seeds/data/originLocations/asia')
const africa = require('../seeds/data/originLocations/africa')
const oceania = require('../seeds/data/originLocations/oceania')

const allLocations = [].concat(
  europe,
  northAmerica,
  southAmerica,
  asia,
  africa,
  oceania
)
const transformedCountries = countries.map(({ name, code }) => ({
  code,
  name,
}))

exports.up = async (knex) => {
  await knex.schema
    .createTable('countries', (table) => {
      table.string('code', 2).primary()
      table.string('name', 255).notNullable()
    })
    .alterTable('destinations', (table) => {
      table.string('country_code')
      table
        .foreign('country_code')
        .references('code')
        .inTable('countries')
        .onDelete('CASCADE')
    })
    .alterTable('origin_locations', (table) => {
      table.string('country_code')
      table
        .foreign('country_code')
        .references('code')
        .inTable('countries')
        .onDelete('CASCADE')
    })

  await knex('countries').insert(transformedCountries)

  const dBdestinations = await knex('destinations').select('id')
  for (const { id: dbId } of dBdestinations) {
    await knex('destinations')
      .update({
        country_code: destinations.find(({ id: dataId }) => dataId === dbId)
          .countryCode,
      })
      .where({ id: dbId })
  }

  const dbOriginLocations = await knex('origin_locations').select('code')
  for (const { code: dbCode } of dbOriginLocations) {
    await knex('origin_locations')
      .update({
        country_code: allLocations.find(
          ({ code: dataCode }) => dataCode === dbCode
        ).country.code,
      })
      .where({ code: dbCode })
  }

  await knex.schema
    .alterTable('destinations', (table) => {
      table
        .string('country_code')
        .notNullable()
        .alter()
    })
    .alterTable('origin_locations', (table) => {
      table
        .string('country_code')
        .notNullable()
        .alter()
    })
}

exports.down = async (knex) =>
  knex.schema
    .alterTable('origin_locations', (table) => {
      table.dropColumn('country_code')
    })
    .alterTable('destinations', (table) => {
      table.dropColumn('country_code')
    })
    .dropTableIfExists('countries')
