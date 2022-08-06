exports.up = (knex) =>
  knex.schema.createTable('destination_cities', (table) => {
    table.string('city', 255)
    table.integer('ppn_city_id').notNullable()
    table.string('destination_id').notNullable()
    table
      .foreign('destination_id')
      .references('id')
      .inTable('destinations')
      .onDelete('CASCADE')
    table.primary(['ppn_city_id', 'destination_id'])
  })

exports.down = (knex) => knex.schema.dropTableIfExists('destination_cities')
