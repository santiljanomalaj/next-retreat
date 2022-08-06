require('dotenv').config({ path: '../.env' })
const Knex = require('knex')
const { Model } = require('objection')
const dbConfig = require('../config/db')
const { getDestinations, getOriginLocations } = require('../src/utils/nextRetreatApi')
const fetch = require('node-fetch')
const AvailableAirport = require('../models/AvailableAirport')
const logger = require('../src/utils/logger')
const { formatDateToKiwi } = require('../src/utils/date')

const knex = Knex(dbConfig)
Model.knex(knex)

const checkAvailableAirports = async () => {

  logger.info(`Starting checkAvailableAirports process`)

  const originLocations = [
    ...new Set(
      await getOriginLocations()
    )
  ]

  logger.info(
    `The NextRetreat API returned ${originLocations.length} unique origin locations`
  )

  const destinations = [
    ...new Set(
      (await getDestinations()).flatMap(({ airports }) =>
        airports.map(({ code }) => `${code}`)
      )
    ),
  ]

  logger.info(
    `The NextRetreat API returned ${destinations.length} unique destination airports`
  )

  //truncate the table
  try {
    logger.info('Starting truncating the available_airports table')
    await knex.raw(`TRUNCATE available_airports RESTART IDENTITY;`)
    logger.info('Truncating finished')
  } catch (error) {
    logger.error('Error on truncating table', error)
  }

  const dateTo = new Date().setFullYear(new Date().getFullYear() + 1)
  const jointDestinations = destinations.join(',')

  for (let i = 0; i < originLocations.length; i++) {
    const originLocation = originLocations[i]

    try {
      const response = await fetch(
        `${process.env.TEQUILA_API_URL}?fly_from=${
          originLocation
        }&fly_to=${jointDestinations}&partner=${
          process.env.TEQUILA_API_PARTNER
        }&max_stopovers=1&limit=1000&sort=date&one_for_city=1&flight_type=oneway&date_to=${formatDateToKiwi(
          dateTo
        )}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            apikey: process.env.TEQUILA_API_KEY,
          },
        }
      )

      const flights = await response.json()

      if (flights.error) {
        logger.warn(
          `The source does not contain airport with code: ${originLocation}`
        )
        continue
      }

      const availableAirports = flights.data.map((flight) => {
        return { from: originLocation, to: flight.flyTo }
      })

      //insert with knex
      await AvailableAirport.query().insert(availableAirports)

      if ((i % 50 == 0 || i == originLocations.length - 1) && i > 0) {
        logger.info(`Finished ${i + 1} origin locations`)
      }
    } catch (error) {
      logger.warn('Error on getting possible flights', error)
    }
  }

  logger.info('Checking available airport pairs finished.')
}

module.exports = {
  checkAvailableAirports
}
