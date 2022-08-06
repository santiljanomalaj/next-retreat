exports.up = (knex) =>
  knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name', 45)
  })
exports.down = (knex) => knex.schema.dropTableIfExists('users')
