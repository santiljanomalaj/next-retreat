exports.up = (knex) =>
  knex.schema.alterTable('amenities', (table) => {
    table.dropColumn('work_leisure_balance_score')
  })

exports.down = (knex) =>
  knex.schema.alterTable('amenities', async (table) => {
    table.integer('work_leisure_balance_score')
  })
