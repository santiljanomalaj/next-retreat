exports.up = (knex) =>
  knex.schema.alterTable('venues', (table) => {
    table.boolean('is_quality')
    table.boolean('is_manual_quality')
    table.string('source', 3)
    table.integer('capacity')
  })

exports.down = (knex) =>
  knex.schema.alterTable('venues', (table) => {
    table.dropColumn('is_quality')
    table.dropColumn('is_manual_quality')
    table.dropColumn('source')
    table.dropColumn('capacity')
  })
