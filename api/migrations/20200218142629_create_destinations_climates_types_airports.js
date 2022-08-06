const coordinates = require('./utils/coordinates')
const countries = require('./data/countries')
const { MONTHS, CONTINENTS } = require('../src/constants')

const mapNamesOfCountries = ({ name }) => name

exports.up = (knex) =>
  knex.schema
    .createTable('destinations', (table) => {
      table.string('id').primary()
      table.string('kiwi_city_id')
      table.string('title', 255)
      table.text('picture_url')
      table.text('description')
      coordinates({ table })
      table.text('country', countries.map(mapNamesOfCountries))
      table.enum('continent', CONTINENTS)
    })
    .createTable('destination_climate', (table) => {
      table.increments('id').primary()
      table.float('value_celsius')
      table.enum('month', MONTHS)
      table.string('destination_id').notNullable()
      table
        .foreign('destination_id')
        .references('id')
        .inTable('destinations')
        .onDelete('CASCADE')
    })
    .createTable('destination_types', (table) => {
      table.increments('id').primary()
      table.string('name', 255)
    })
    .createTable('destinations_destination_types', (table) => {
      table
        .integer('destination_types_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('destination_types')
      table
        .string('destinations_id')
        .notNullable()
        .references('id')
        .inTable('destinations')
    })
    .createTable('airports', (table) => {
      table.increments('id').primary()
      table.string('name', 255).unique()
      table.string('code', 3).unique()
      coordinates({ table })
    })
    .createTable('airports_destinations', (table) => {
      table
        .string('destinations_id')
        .notNullable()
        .references('id')
        .inTable('destinations')
      table
        .integer('airports_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('airports')
    })

exports.down = (knex) =>
  knex.schema
    .dropTableIfExists('destination_climate')
    .dropTableIfExists('destinations_destination_types')
    .dropTableIfExists('destination_types')
    .dropTableIfExists('airports_destinations')
    .dropTableIfExists('airports')
    .dropTableIfExists('destinations')
