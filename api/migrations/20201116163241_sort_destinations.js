const destinations = require('./data/destinations-2020-09-28')

const destinationIds = `(${destinations.map(({ id }) => `'${id}'`).join(', ')})`

exports.up = async (knex) => {
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
      row_indices.id = destinations.id
      AND destinations.id IN ${destinationIds};
  `)
}

exports.down = async () => {}
