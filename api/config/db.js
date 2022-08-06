require('dotenv').config({ path: './../.env' })
const { knexSnakeCaseMappers } = require('objection')

module.exports = {
  migrations: { directory: '../migrations/' },
  seeds: { directory: '../seeds/' },
  client: 'pg',
  connection: process.env.POSTGRES_CONNECTION_STRING,
  ...knexSnakeCaseMappers(),
  debug: false //process.env.NODE_ENV === 'development',
}
