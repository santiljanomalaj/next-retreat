exports.up = (knex) =>
  knex.schema.raw(`
    DELETE FROM amenities_venue a USING amenities_venue b
    WHERE a = b
      AND a.ctid < b.ctid
`)

exports.down = async () => {}
