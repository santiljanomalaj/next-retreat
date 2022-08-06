/* eslint-disable no-restricted-syntax */
require('dotenv').config()
const Knex = require('knex')
const { Model } = require('objection')
const { Storage } = require('@google-cloud/storage')
const zlib = require('zlib')
const readline = require('readline')
const logger = require('./utils/logger')
const { getDestinations } = require('./utils/nextRetreatApi')
const dbConfig = require('../config/db')
const Flight = require('../models/Flight')
const FlightsSync = require('../models/FlightsSync')

const SYNC_FLIGHTS_TIMER = 'Sync flights'
const INSERT_FLIGHTS_TIMER_BUCKET = 'Insert flights'
const INSERT_FLIGHTS_TIMER_FILE = 'Insert file'
const INSERT_FLIGHTS_TIMER_CHUNK = 'Insert chunk'
const INSERT_FLIGHTS_TIMER_UPSERT = 'Upsert flights'
const INSERT_FLIGHTS_TIMER_TRUNCATE = 'Truncate temporary flights'

const CHUNK_SIZE = Math.floor(65536 / 8) - 1 // pg parameter limit / number of parameters
const FOLDER_NAME = 'ond_itineraries'
const upsertFlightsQuery = ({ destinations }) => `
  INSERT INTO transformed_flights (
    price,
    duration,
    date,
    city_from,
    city_to,
    airport_from,
    airport_to,
    stopover_count
  )
  SELECT DISTINCT
    a.price,
    a.duration,
    a.date,
    a.city_from,
    a.city_to,
    a.airport_from,
    a.airport_to,
    a.stopover_count
  FROM (temporary_flights a
    JOIN (
      SELECT
        temporary_flights.date,
        temporary_flights.airport_from,
        temporary_flights.airport_to,
        min(temporary_flights.duration) AS min_duration,
        min(temporary_flights.price) AS min_price
      FROM
        temporary_flights
      WHERE (
        temporary_flights.airport_from IN (${destinations})
        OR temporary_flights.airport_to IN (${destinations})
      )
      AND temporary_flights.date BETWEEN SYMMETRIC NOW() AND NOW() + INTERVAL '12 months'
      GROUP BY
        temporary_flights.date,
        temporary_flights.airport_from,
        temporary_flights.airport_to
     ) b ON (
       a.date = b.date
       AND a.airport_from = b.airport_from
       AND a.airport_to = b.airport_to
       AND a.duration = b.min_duration
       AND a.price = b.min_price
    )
  )
  ON CONFLICT (
    date,
    airport_from,
    airport_to
  )
  DO UPDATE SET (
    updated_at,
    price,
    duration,
    stopover_count
  ) = (
    NOW(),
    EXCLUDED.price,
    EXCLUDED.duration,
    EXCLUDED.stopover_count
  );
`

const knex = Knex(dbConfig)
Model.knex(knex)
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
  },
})
const bucket = storage.bucket(process.env.BUCKET_NAME)

const timer = {
  start: (label) => {
    if (process.env.NODE_ENV === 'development') {
      console.time(label)
    }
  },
  end: (label) => {
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(label)
    }
  },
}

const getDateFromFilename = (filename) =>
  filename
    .split('/')
    .slice(1, 4)
    .map((date) => date.split('=')[1])
    .join('-')

const listFiles = async () => {
  const [files] = await bucket.getFiles()
  const latestFolderPath = /^(.*\/)/.exec(
    [...files].sort((a, b) => b.name.localeCompare(a.name))[0].name
  )[0]

  return files.filter(
    ({ name }) => name.includes(latestFolderPath) && name.includes(FOLDER_NAME)
  )
}

const transformFlightData = ({
  avg_price_per_pax: price,
  outbound_travel_time: duration,
  departure_date: date,
  src_city: cityFrom,
  dst_city: cityTo,
  fly_from: airportFrom,
  fly_to: airportTo,
  route,
}) => ({
  price,
  duration: Number(duration),
  date,
  cityFrom,
  cityTo,
  airportFrom,
  airportTo,
  stopoverCount: route.length - 1,
})

const upsertFlightsToDb = async () => {
  try {
    timer.start(SYNC_FLIGHTS_TIMER)
    const remoteFiles = await listFiles()
    const date = getDateFromFilename(remoteFiles[0].name)
    const latestSyncByDate = await FlightsSync.query()
      .where({ date })
      .orderBy('syncStartAt', 'desc')
      .limit(1)
      .first()
    const hasLatestSyncEnded = latestSyncByDate && latestSyncByDate.syncEndAt

    if (hasLatestSyncEnded) {
      logger.info(`Sync of ${date} already done.`)
      process.exit(0)
    }

    const { id: currentSyncId } = await FlightsSync.query()
      .insert({ date })
      .returning('id')

    const destinations = (await getDestinations())
      .flatMap(({ airports }) => airports.map(({ code }) => `'${code}'`))
      .filter((e, i, a) => a.indexOf(e) === i) // unique
      .join(', ')

    try {
      timer.start(INSERT_FLIGHTS_TIMER_TRUNCATE)
      await knex.raw(`
        TRUNCATE temporary_flights RESTART IDENTITY;
      `)
      timer.end(INSERT_FLIGHTS_TIMER_TRUNCATE)
    } catch (error) {
      logger.error('Error on truncating table', error)
    }

    timer.start(INSERT_FLIGHTS_TIMER_BUCKET)
    for (const file of remoteFiles) {
      try {
        timer.start(INSERT_FLIGHTS_TIMER_FILE)
        let chunkCounter = 0
        const chunk = []

        const lines = readline.createInterface({
          input: file
            .createReadStream()
            .on('error', (error) => {
              logger.error('Error on reading stream', error)
            })
            .on('response', ({ statusCode, statusMessage }) => {
              logger.info({ statusCode, statusMessage })
            })
            .on('end', async () => {
              try {
                await Flight.query().insert(chunk)
              } catch (error) {
                logger.error('Error on updating flights', error)
              }
              logger.info('The file is fully downloaded.')
            })
            .pipe(zlib.createGunzip()),
        })

        // eslint-disable-next-line no-await-in-loop
        for await (const line of lines) {
          const parsedLine = JSON.parse(line)
          if (
            !parsedLine.avg_price_per_pax ||
            !parsedLine.outbound_travel_time ||
            !parsedLine.departure_date ||
            !parsedLine.src_city ||
            !parsedLine.dst_city ||
            !parsedLine.fly_from ||
            !parsedLine.fly_to ||
            !parsedLine.route
          ) {
            logger.info('Data missing in line:', parsedLine)
          } else {
            chunk.push(transformFlightData(parsedLine))
          }

          if (chunk.length === CHUNK_SIZE) {
            timer.start(INSERT_FLIGHTS_TIMER_CHUNK)
            try {
              await Flight.query().insert(chunk)

              chunk.length = 0
              chunkCounter += 1
              logger.info(`Chunk ${chunkCounter} of ${file.name} inserted`)
              timer.end(INSERT_FLIGHTS_TIMER_CHUNK)
            } catch (error) {
              logger.error('Error on updating flights', error)
            }
          }
        }

        lines.on('close', () => {
          logger.info('Line reader has closed.')
          timer.end(INSERT_FLIGHTS_TIMER_FILE)
        })
      } catch (error) {
        logger.error('Error on reading file', error)
      }
    }
    timer.end(INSERT_FLIGHTS_TIMER_BUCKET)

    try {
      timer.start(INSERT_FLIGHTS_TIMER_UPSERT)
      await knex.raw(upsertFlightsQuery({ destinations }))
      timer.end(INSERT_FLIGHTS_TIMER_UPSERT)
    } catch (error) {
      logger.error('Error on upserting flights', error)
    }

    await FlightsSync.query()
      .patch({ syncEndAt: knex.fn.now() })
      .where('id', currentSyncId)

    timer.end(SYNC_FLIGHTS_TIMER)
  } catch (error) {
    logger.error('Error on syncing flights', error)
  }

  process.exit(0)
}

upsertFlightsToDb()
