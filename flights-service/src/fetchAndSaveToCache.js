/* eslint-disable no-console */
/* eslint-disable array-callback-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */

const Flight = require('../models/Flight')
const upsertFlightToDb = require('./upsertFlightToDb')
const getNextRequestInstructions = require('./getNextRequestInstructions')
const { getMemoryUsage, sleep } = require('./helpers')
const { fetchFirstFlight } = require('./utils/kiwi')
const {
  getOriginLocations,
  getDestinations,
} = require('./utils/nextRetreatApi')
const logger = require('./utils/logger')

const WAIT_TIME_IN_MS = 1000
const NUMBER_OF_WAYS = 2
const API_REQUEST_LIMIT = 200 // in one minute

const fetchAndSaveToCache = async () => {
  let originLocations = []
  let destinations = []

  // if one minute is used, API limit is often exceeded
  const { rows } = await Flight.knex().raw(`
    SELECT COUNT(*) FROM
      (
        SELECT id, fetched_at FROM flights ORDER BY id DESC LIMIT 1000
      ) last_flights
    WHERE last_flights.fetched_at > NOW() - INTERVAL '59 seconds';
  `)
  const flightsInLastMinute = rows[0].count
  // if one minute is used, API limit is often exceeded
  const numberOfRequestInstructions = API_REQUEST_LIMIT - flightsInLastMinute
  logger.info(`Requests in last minute: ${flightsInLastMinute}`)
  logger.info(
    `Prepare ${numberOfRequestInstructions} more request instruction(s)`
  )

  if (numberOfRequestInstructions > 0) {
    originLocations = await getOriginLocations()
    const destinationsData = await getDestinations()
    destinations = destinationsData.map(({ id, airports }) => ({
      id,
      airports: airports.map(({ code }) => code).join(','),
    }))
  }

  logger.info(`heapUsage: ${getMemoryUsage()}MB`)
  let requestInstructions = []
  // numberOfRequestInstructions is halved in order to accomodate for the way back request
  for (let i = 0; i < numberOfRequestInstructions / NUMBER_OF_WAYS; i++) {
    let lastKnownInstruction =
      requestInstructions[requestInstructions.length - 2]
    if (!lastKnownInstruction) {
      // fetch the second last request to accommodate for half done requests (way back is missing)
      const { rows } = await Flight.knex().raw(
        `
            SELECT * FROM (
              SELECT
                id,
                fetched_at,
                date,
                destination_id,
                origin_location
              FROM
                flights
              ORDER BY
                id DESC
              LIMIT 1000
            ) last_flights
          ORDER BY last_flights.fetched_at DESC LIMIT 10 OFFSET 1
      `
      )
      const secondLastRecord = rows[0]
      if (secondLastRecord) {
        const {
          date,
          origin_location: origin,
          destination_id: destinationId,
        } = secondLastRecord
        lastKnownInstruction = {
          date,
          origin,
          destination: {
            id: destinationId,
            airports: destinations.find(({ id }) => id === destinationId)
              .airports,
          },
        }
      }
    }
    const nextInstruction = await getNextRequestInstructions({
      prevInstructions: lastKnownInstruction,
      originLocations,
      destinations,
    })
    // add requests for both ways to the array of requests
    requestInstructions.push(
      { ...nextInstruction, isReturnFlight: false },
      {
        origin: nextInstruction.destination,
        destination: nextInstruction.origin,
        date: nextInstruction.date,
        isReturnFlight: true,
      }
    )
    const { origin, destination, date } = nextInstruction

    // insert the results in DB one by one
    await upsertFlightToDb({
      date,
      origin,
      destination,
      isReturnFlight: false,
      isFetchedAtSaved: true,
    })
    await upsertFlightToDb({
      date,
      origin,
      destination,
      isReturnFlight: true,
      isFetchedAtSaved: true,
    })
  }

  await sleep(WAIT_TIME_IN_MS)
  await Promise.all(
    requestInstructions.map(
      async ({ date, origin, destination, isReturnFlight }) => {
        try {
          const result = await fetchFirstFlight({
            flyFrom: isReturnFlight ? origin.airports : origin,
            flyTo: isReturnFlight ? destination : destination.airports,
            date,
          })
          if (!result) {
            logger.warn(`noKiwiResults: ${origin} - ${destination}, ${date}`)
          }
          await upsertFlightToDb({
            result,
            date,
            origin: isReturnFlight ? destination : origin,
            destination: isReturnFlight ? origin : destination,
            isReturnFlight,
          })
        } catch (error) {
          logger.error(
            `kiwiRequestError: ${origin} - ${destination}, ${date}`,
            error
          )
        }
      }
    )
  )
}

module.exports = fetchAndSaveToCache
