const Knex = require('knex')
const knexLogger = require('knex-logger')
const { Model } = require('objection')
const dbConfig = require('../../config/db')

const knex = Knex(dbConfig)

module.exports = {
  init: (server) => {
    if (process.env.NODE_ENV === 'development') {
      server.use(knexLogger(knex))
    }
    Model.knex(knex)
  },
  knex,
}
