/* eslint-disable camelcase */

const { formatDateToSQL } = require('./utils/date')
const logger = require('./utils/logger')
const Flight = require('../models/Flight')

const APOSTROPHE_REGEX = /'/g
const replaceApostropheInJsonItem = (item) =>
  typeof item === 'string' ? item.replace(APOSTROPHE_REGEX, "''") : item

const getValuesForDbFromResult = ({
  result,
  origin,
  destination,
  date,
  isReturnFlight,
}) => {
  const uniqueKeyAttributes = `'${formatDateToSQL(date)}',
  '${destination.id}',
  '${origin}', ${isReturnFlight}`
  if (result) {
    if (result.kiwiId) {
      const {
        bags_price,
        baglimit,
        availability,
        facilitated_booking_available,
        conversion,
        fare,
        transfers,
        price_dropdown,
        airlines,
        route,
        routes,
        ...rest
      } = result
      return `${Object.values(rest)
        .map((item) =>
          typeof item === 'string'
            ? `'${item.replace(APOSTROPHE_REGEX, "''")}'`
            : item
        )
        .join(', ')}, ${route ? route.length - 1 : 0}, '${JSON.stringify({
        bags_price,
        baglimit,
        availability,
        facilitated_booking_available,
        conversion,
        fare,
        transfers,
        price_dropdown,
        airlines,
        route: route.map((item) =>
          Object.keys(item).reduce(
            (acc, curr) => ({
              ...acc,
              [curr]: replaceApostropheInJsonItem(item[curr]),
            }),
            {}
          )
        ),
        routes,
      })}', ${uniqueKeyAttributes}`
    }
  }
  return `NULL, NULL, NULL, NULL, NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
  NULL, NULL, NULL, '{}', ${uniqueKeyAttributes}`
}

const upsertFlightToDb = async ({
  result,
  origin,
  destination,
  date,
  isReturnFlight,
  isFetchedAtSaved = false,
}) => {
  try {
    await Flight.knex().raw(`
      INSERT into flights
        (
          kiwi_id, price, quality, distance, booking_token,
          duration, airport_from, city_from, country_from,
          country_code_from, airport_to, city_to,
          country_to, country_code_to, virtual_interlining, has_airport_change,
          pnr_count, technical_stops, stopover_count, miscellaneous,
          date, destination_id, origin_location, is_return_flight
          ${isFetchedAtSaved ? ', fetched_at' : ''}
        ) VALUES (${getValuesForDbFromResult({
          result,
          origin,
          destination,
          isReturnFlight,
          date,
        })}
        ${isFetchedAtSaved ? ',NOW()' : ''})
        ON CONFLICT (date, destination_id, origin_location, is_return_flight)
        DO UPDATE SET
          (
            kiwi_id, price, quality, distance, booking_token,
            duration, airport_from, city_from, country_from,
            country_code_from, airport_to, city_to,
            country_to, country_code_to, virtual_interlining, has_airport_change,
            pnr_count, technical_stops, stopover_count, miscellaneous
          ) = (
            EXCLUDED.kiwi_id, EXCLUDED.price, EXCLUDED.quality, EXCLUDED.distance,
            EXCLUDED.booking_token, EXCLUDED.duration, EXCLUDED.airport_from, EXCLUDED.city_from,
            EXCLUDED.country_from, EXCLUDED.country_code_from, EXCLUDED.airport_to, EXCLUDED.city_to,
            EXCLUDED.country_to, EXCLUDED.country_code_to, EXCLUDED.virtual_interlining,
            EXCLUDED.has_airport_change, EXCLUDED.pnr_count, EXCLUDED.technical_stops,
            EXCLUDED.stopover_count, EXCLUDED.miscellaneous
          )
        ;
    `)
    logger.info(
      `dbResultSaved:  ${origin} - ${destination.id}, ${formatDateToSQL(date)}`
    )
  } catch (error) {
    logger.error('dbInsertError', error)
  }
}

module.exports = upsertFlightToDb
