exports.up = (knex) =>
  knex.schema.alterTable('venue_photos', (table) => {
    table.boolean('is_hero')
    table.index(['venue_id'], 'venue_photos_venue_id_index')
  })

exports.down = (knex) =>
  knex.schema.alterTable('venue_photos', (table) => {
    table.dropColumn('is_hero')
    table.dropIndex(null, 'venue_photos_venue_id_index')
  })
