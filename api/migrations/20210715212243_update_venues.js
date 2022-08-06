exports.up = async (knex) => {
  await knex('venues')
    .where('is_active', '=', '1')
    .update('is_quality', true)
}

exports.down = async () => {}
