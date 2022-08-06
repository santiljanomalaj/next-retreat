const coordinates = require('./utils/coordinates')

exports.up = (knex) =>
  knex.schema.createTable('origin_locations', (table) => {
    table
      .increments('id')
      .primary()
      .unsigned()
    table.string('code', 10)
    table.string('kiwi_id', 255)
    table.string('name', 255)
    table.string('country', 255)
    coordinates({ table })
  })

exports.down = (knex) => knex.schema.dropTableIfExists('origin_locations')
