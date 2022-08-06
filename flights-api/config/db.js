require('dotenv').config({ path: './../.env' })
const { knexSnakeCaseMappers } = require('objection')

module.exports = {
  migrations: { directory: '../migrations/' },
  seeds: { directory: '../seeds/' },
  client: 'pg',
  connection: process.env.POSTGRES_CONNECTION_STRING,
  ...knexSnakeCaseMappers(),
  debug: process.env.NODE_ENV === 'development',
  pool: { min: 2, max:  process.env.NODE_ENV === 'development' ? 5 : 30 },
  acquireConnectionTimeout : 600000,
}
