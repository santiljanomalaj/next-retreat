exports.up = (knex) =>
  knex.schema.createTable('destinations_city_codes', (table) => {
    table.string('city_code').notNullable()
    table.string('destination_id').notNullable()
    table
      .foreign('destination_id')
      .references('id')
      .inTable('destinations')
      .onDelete('CASCADE')
    table.primary(['city_code', 'destination_id'])
  })

exports.down = (knex) =>
  knex.schema.dropTableIfExists('destinations_city_codes')
