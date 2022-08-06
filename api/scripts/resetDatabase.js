require('dotenv').config({ path: './.env' })
const Knex = require('knex')
const dbConfig = require('../config/db')

const knex = Knex(dbConfig)

const resetDatabase = async () => {
  console.log(`'${process.env.DB_NAME}': dropping database.`)
  await knex.raw(`DROP DATABASE ${process.env.DB_NAME};`)
  console.log(`'${process.env.DB_NAME}' has been droped.`)
  await knex.raw(
    `CREATE DATABASE ${process.env.DB_NAME} CHARACTER SET utf8 COLLATE utf8_bin;`
  )
  console.log(`'${process.env.DB_NAME}' has been created.`)
  process.exit()
}

resetDatabase()
