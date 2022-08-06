exports.up = async (knex) => {
  await knex.schema
    .alterTable('destinations', (table) => {
      table
        .datetime('created_at')
        .notNullable()
        .defaultTo(knex.fn.now())
    })
    .alterTable('venues', (table) => {
      table
        .datetime('updated_at')
        .defaultTo(knex.raw(`NOW() - INTERVAL '1 week'`))
      table.bool('is_active').defaultTo(true)
    })
    .createTable('destination_venue_syncs', (table) => {
      table.increments('id').primary()
      table.string('destination_id').notNullable()
      table
        .foreign('destination_id')
        .references('id')
        .inTable('destinations')
        .onDelete('CASCADE')
      table
        .datetime('sync_start_at')
        .notNullable()
        .defaultTo(knex.fn.now())
      table.datetime('sync_end_at')
    })

  await knex.schema.raw(`
    UPDATE
      destinations
    SET
      created_at = NOW() - row_indices.row_index * (INTERVAL '1 minute') - INTERVAL '1 week'
    FROM (
      SELECT
        row_indices.id,
        row_number() OVER () AS row_index
      FROM
        destinations row_indices) row_indices
    WHERE
      row_indices.id = destinations.id;
  `)
}

exports.down = (knex) =>
  knex.schema
    .dropTableIfExists('destination_venue_syncs')
    .alterTable('venues', (table) => {
      table.dropColumn('is_active')
      table.dropColumn('updated_at')
    })
    .alterTable('destinations', (table) => {
      table.dropColumn('created_at')
    })
