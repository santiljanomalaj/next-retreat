exports.up = async (knex) =>
  knex.schema.createTable('available_airports', (table) => {
    table.increments('id').primary()
    table.string('from', 3)
    table.string('to', 3)
  })

exports.down = (knex) => knex.schema.dropTableIfExists('available_airports')
