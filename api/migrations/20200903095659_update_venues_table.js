exports.up = (knex) =>
  knex.schema.alterTable('venues', (table) => {
    table.boolean('bkg_flag')
  })

exports.down = (knex) =>
  knex.schema.alterTable('venues', (table) => {
    table.dropColumn('bkg_flag')
  })
