exports.up = async (knex) => {
  await knex('destinations')
    .update({ title: 'Sicily' })
    .where({ id: 'SICILIA_IT' })
}

exports.down = async (knex) => {
  await knex('destinations')
    .update({ title: 'Sicilia' })
    .where({ id: 'SICILIA_IT' })
}
