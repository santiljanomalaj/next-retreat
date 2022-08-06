require('dotenv').config({ path: '../.env' })
const Knex = require('knex')
const { Model } = require('objection')
const dbConfig = require('../config/db')
const fetch = require('node-fetch')
const AvailableAirport = require('../models/AvailableAirport')
const Flight = require('../models/Flight')
const logger = require('../src/utils/logger')
const { formatDateToKiwi, formatDateToSQL } = require('../src/utils/date')

const TEQUILA_CHUNK_SIZE = Number(process.env.TEQUILA_CHUNK_SIZE || '5')
const RETRY_FETCH_COUNT = 3
const TEQUILA_API_RETRY_DELAY = 1000
const START_BATCH_INDEX = 0

const knex = Knex(dbConfig)
Model.knex(knex)

const upsertFlightsQuery = () => `
INSERT INTO transformed_flights (
    price,
    duration,
    date,
    city_from,
    city_to,
    airport_from,
    airport_to,
    stopover_count,
    deep_link 
  )
  SELECT
    a.price,
    a.duration,
    a.date,
    a.city_from,
    a.city_to,
    a.airport_from,
    a.airport_to,
    a.stopover_count,
    a.deep_link 
  FROM temporary_flights a
  ON CONFLICT (
    date,
    airport_from,
    airport_to
  )
  DO UPDATE SET (
    updated_at,
    price,
    duration,
    stopover_count,
    deep_link
  ) = (
    NOW(),
    EXCLUDED.price,
    EXCLUDED.duration,
    EXCLUDED.stopover_count,
    EXCLUDED.deep_link
  );
`

const delay = ms => {
  return new Promise(resolve => {
      setTimeout(() => {
          resolve()
      }, ms)
  })
}
const retryFetch = (url, options = {}, retries) =>
  fetch(url, options)
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      if (retries > 0) {
        return delay(TEQUILA_API_RETRY_DELAY).then(() => retryFetch(url, options, retries - 1))
      }
      console.log("Exceeded retry", res)
      throw new Error(res.status)
    })
    .catch(error => console.error(error.message))


const chunkArray = (arrayToChunk, chunkSize) => {
  if (!chunkSize) return arrayToChunk
  var R = []
  for (var i = 0; i < arrayToChunk.length; i += chunkSize)
    R.push(arrayToChunk.slice(i, i + chunkSize))
  return R
}

const aggregateFlightData = (aggregatedData, flightData) => {
  const month = flightData.date.substring(0, 7)
  if (!aggregatedData.months[month]) aggregatedData.months[month] = { price: 0, duration: 0, count: 0, stepovers: 0 }

  aggregatedData.months[month].duration += flightData.duration
  aggregatedData.months[month].price += flightData.price
  aggregatedData.months[month].count += 1
  aggregatedData.months[month].stepovers = Math.max(aggregatedData.months[month].stepovers, flightData.stopoverCount)

  aggregatedData.year.duration += flightData.duration
  aggregatedData.year.price += flightData.price
  aggregatedData.year.count += 1
  aggregatedData.year.stepovers = Math.max(aggregatedData.year.stepovers, flightData.stopoverCount)
}

const generatePostgresUpsertQuery = ({
  table,
  columns,
  values,
  conflictUniqueKeys,
  valueNamesToUpdate,
}) => `
    INSERT INTO ${table}
    (${columns.map((column) => column).join(', ')})
    VALUES
    (${values.map((value) => value).join(', ')})
    ON CONFLICT (${conflictUniqueKeys.join(', ')})
    DO UPDATE SET ${valueNamesToUpdate
    .map((name) => `${name} = EXCLUDED.${name}`)
    .join(', ')}
  `

const saveMonthlyAggregatedFlightData = async (aggregatedData, { cityTo, cityFrom, airportFrom, airportTo }) => {
  const months = Object.keys(aggregatedData.months)
  for (let i = 0; i < months.length; i++) {
    const month = months[i];
    await knex.raw(generatePostgresUpsertQuery({
      table: 'flights_by_month',
      columns: ['date', 'airport_from', 'airport_to', 'city_to', 'city_from', 'duration', 'price', 'step_overs'],
      values: [
        `'${month}'`,
        `'${airportFrom}'`,
        `'${airportTo}'`,
        `'${cityTo}'`,
        `'${cityFrom}'`,
        Math.trunc(aggregatedData.months[month].duration / aggregatedData.months[month].count),
        Math.trunc(aggregatedData.months[month].price / aggregatedData.months[month].count),
        aggregatedData.months[month].stepovers],
      conflictUniqueKeys: ['date', 'airport_from', 'airport_to', 'city_to', 'city_from'],
      valueNamesToUpdate: ['duration', 'price', 'step_overs']
    }))
  }
}

const saveYearlyAggregatedFlightData = async (aggregatedData, { cityTo, cityFrom, airportFrom, airportTo }) => {
  await knex.raw(generatePostgresUpsertQuery({
    table: 'flights_by_year',
    columns: ['airport_from', 'airport_to', 'city_to', 'city_from', 'duration', 'price', 'step_overs'],
    values: [
      `'${airportFrom}'`,
      `'${airportTo}'`,
      `'${cityTo}'`,
      `'${cityFrom}'`,
      Math.trunc(aggregatedData.year.duration / aggregatedData.year.count),
      Math.trunc(aggregatedData.year.price / aggregatedData.year.count),
      aggregatedData.year.stepovers],
    conflictUniqueKeys: ['airport_from', 'airport_to', 'city_to', 'city_from'],
    valueNamesToUpdate: ['duration', 'price', 'step_overs']
  }))
}

const createReturnFlightsAndAggregateToDbo = async (departures, arrivals) => {
  const aggregatedData = { months: {}, year: { price: 0, duration: 0, count: 0, stepovers: 0 } }

  let arrivalIndex = 0;

  for (let i = 0; i < departures.length; i++) {
    const departure = departures[i];

    for (let j = arrivalIndex; j < arrivals.length; j++) {
      const arrival = arrivals[j];

      if (arrival.dateTime < departure.dateTime) {
        arrivalIndex++
        continue
      }

      if (
        Math.ceil(Math.abs(arrival.dateTime - departure.dateTime) / (1000 * 60 * 60 * 24)) < 5) {
        aggregateFlightData(aggregatedData, {
          price: departure.price + arrival.price,
          duration: departure.duration + arrival.duration,
          stopoverCount: Math.max(departure.stopoverCount, arrival.stopoverCount),
          date: departure.date
        })
      }
      else {
        break
      }
    }
  }

  //do the updates
  await Promise.all([
    saveMonthlyAggregatedFlightData(aggregatedData, departures[0]),
    saveYearlyAggregatedFlightData(aggregatedData, departures[0])
  ])
}

const syncOneFlight = async (pair, dateTo) => {
  try {
    //get the data from the KIWI api
    const [departureFlightsResponse, arrivalFlightsResponse] = await Promise.all([retryFetch(
      `${process.env.TEQUILA_API_URL}?fly_from=${pair.from}&fly_to=${pair.to
      }&partner=${process.env.TEQUILA_API_PARTNER
      }&max_stopovers=1&limit=1000&sort=date&one_per_date=1&flight_type=oneway&date_to=${formatDateToKiwi(
        dateTo
      )}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.TEQUILA_API_KEY,
        },
      },
      RETRY_FETCH_COUNT
    ), retryFetch(
      `${process.env.TEQUILA_API_URL}?fly_from=${pair.to}&fly_to=${pair.from
      }&partner=${process.env.TEQUILA_API_PARTNER
      }&max_stopovers=1&limit=1000&sort=date&one_per_date=1&flight_type=oneway&date_to=${formatDateToKiwi(
        dateTo
      )}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.TEQUILA_API_KEY,
        },
      }, 
      RETRY_FETCH_COUNT
    )])

    // const flightsResponse = await departureFlightsRequest.json()
    // const [departureFlightsResponse, arrivalFlightsResponse] = await Promise.all([
    //   departureFlightsRequest.json(), arrivalFlightsRequest.json()])

    if (
      departureFlightsResponse.data === undefined ||
      departureFlightsResponse.data.length == 0
    ) {
      logger.warn(`No flights avaialble for pair: ${pair.from} - ${pair.to}`)
      Promise.resolve(true)
    }

    let departuresToInsert = []
    let arrivalsToInsert = []

    for (let j = 0; j < departureFlightsResponse.data.length; j++) {
      const flight = departureFlightsResponse.data[j]

      const flightToInsert = {
        price: flight.price,
        duration: Math.round(flight.duration.departure / 60),
        date: formatDateToSQL(new Date(flight.utc_departure)),
        dateTime: new Date(flight.utc_departure),
        cityFrom: flight.cityCodeFrom,
        cityTo: flight.cityCodeTo,
        airportFrom: flight.flyFrom,
        airportTo: flight.flyTo,
        stopoverCount: flight.route.length - 1,
        deepLink: flight.deep_link,
      }
      //the manual check must be done because kiwi can retrun multiple flights to same day => they have a bug, because it should not happen
      if (
        departuresToInsert.some(
          (exFlight) =>
            exFlight.date.slice(0, 10) == flightToInsert.date.slice(0, 10) &&
            exFlight.airportFrom == flightToInsert.airportFrom &&
            exFlight.airportTo == flightToInsert.airportTo
        )
      ) {
        continue
      }

      departuresToInsert.push(flightToInsert)
    }

    for (let j = 0; j < arrivalFlightsResponse.data.length; j++) {
      const flight = arrivalFlightsResponse.data[j]

      const flightToInsert = {
        price: flight.price,
        duration: Math.round(flight.duration.departure / 60),
        date: formatDateToSQL(new Date(flight.utc_departure)),
        dateTime: new Date(flight.utc_departure),
        cityFrom: flight.cityCodeFrom,
        cityTo: flight.cityCodeTo,
        airportFrom: flight.flyFrom,
        airportTo: flight.flyTo,
        stopoverCount: flight.route.length - 1,
        deepLink: flight.deep_link,
      }
      //the manual check must be done because kiwi can retrun multiple flights to same day => they have a bug, because it should not happen
      if (
        arrivalsToInsert.some(
          (exFlight) =>
            exFlight.date.slice(0, 10) == flightToInsert.date.slice(0, 10) &&
            exFlight.airportFrom == flightToInsert.airportFrom &&
            exFlight.airportTo == flightToInsert.airportTo
        )
      ) {
        continue
      }

      arrivalsToInsert.push(flightToInsert)
    }

    await Promise.all([
      createReturnFlightsAndAggregateToDbo(departuresToInsert, arrivalsToInsert),
      Flight.query().insert(departuresToInsert.map(flight => ({
        price: flight.price,
        duration: flight.duration,
        date: flight.date,
        cityFrom: flight.cityFrom,
        cityTo: flight.cityTo,
        airportFrom: flight.airportFrom,
        airportTo: flight.airportTo,
        stopoverCount: flight.stopoverCount,
        deepLink: flight.deep_link
      })))
      , Flight.query().insert(arrivalsToInsert.map(flight => ({
        price: flight.price,
        duration: flight.duration,
        date: flight.date,
        cityFrom: flight.cityFrom,
        cityTo: flight.cityTo,
        airportFrom: flight.airportFrom,
        airportTo: flight.airportTo,
        stopoverCount: flight.stopoverCount,
        deepLink: flight.deep_link
      })))
    ])
  } catch (error) {
    logger.error(`Error during syncing from ${pair.from} => ${pair.to}`)
    logger.error('Error occurred', error, JSON.stringify(error))
  }
}

const syncFlightData = async () => {
  logger.info(`Starting synchronization process`)

  try {
    await knex.raw(`TRUNCATE temporary_flights RESTART IDENTITY;`)
  } catch (error) {
    logger.error('Error on truncating temporary_flights', error)
  }

  let availableAirportPairs = await AvailableAirport.query().orderBy('id')

  logger.info(
    `Number of possible airport pairs from the database ${availableAirportPairs.length}`
  )

  const dateTo = new Date().setFullYear(new Date().getFullYear() + 1)

  const chunksToProcess = chunkArray(availableAirportPairs, TEQUILA_CHUNK_SIZE)

  for (let j = START_BATCH_INDEX; j < chunksToProcess.length; j++) {
    console.time(`Chunk ${j + 1} process time`)
    const chunk = chunksToProcess[j]

    let processPromises = []

    for (let i = 0; i < chunk.length; i++) {
      const pair = chunk[i]
      processPromises.push(syncOneFlight(pair, dateTo))
    }

    await Promise.all(processPromises)
    console.timeEnd(`Chunk ${j + 1} process time`)
    console.time('Upsert')
    try {
      logger.info(
        `Finished chunk ${j +
        1} / ${chunksToProcess.length}. Going to upsert the data and truncate the temporary table.`
      )
      await knex.raw(upsertFlightsQuery())
      await knex.raw(`TRUNCATE temporary_flights RESTART IDENTITY;`)
    } catch (error) {
      logger.error('Error on upserting flights', error)
    }
    console.timeEnd('Upsert')
  }

  try {
    await knex.raw(`VACUUM FULL transformed_flights;`)
  } catch (error) {
    logger.error('Error during full vacuum', error)
  }

  logger.info(`Flights synchronization task finished.`)
}

module.exports = {
  syncFlightData
}