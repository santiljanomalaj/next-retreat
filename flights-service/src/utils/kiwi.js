/* eslint-disable camelcase */
const fetch = require('node-fetch')
const queryString = require('query-string')
const { sleep } = require('../helpers')
const { formatDateToKiwi } = require('./date')
const logger = require('./logger')

const TEQUILA_API_BASE_URL = 'https://kiwicom-prod.apigee.net/v2'
const WAIT_TIME_AFTER_LIMIT_EXCEEDED_IN_MS = 10000

const mapKiwiFlights = ({
  id: kiwiId,
  price,
  quality,
  distance,
  booking_token: bookingToken,

  duration: { total: duration },

  flyFrom: airportFrom,
  cityFrom,
  countryFrom: { code: countryCodeFrom, name: countryFrom },
  flyTo: airportTo,
  cityTo,
  countryTo: { code: countryCodeTo, name: countryTo },

  pnr_count: pnrCount,
  virtual_interlining: virtualInterlining,
  has_airport_change: hasAirportChange,
  technical_stops: technicalStops,

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
}) => ({
  kiwiId,
  price,
  quality,
  distance,
  bookingToken,

  duration,

  airportFrom,
  cityFrom,
  countryFrom,
  countryCodeFrom,
  airportTo,
  cityTo,
  countryTo,
  countryCodeTo,

  virtualInterlining,
  hasAirportChange,

  pnrCount,
  technicalStops,

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
})

const fetchFirstFlight = async ({
  flyFrom,
  flyTo,
  date,
  flightType = 'oneway',
  adults = 1,
  curr = 'EUR',
  locale = 'en',
  maxStopovers = 2,
  vehicleType = 'aircraft',
  sort = 'duration',
}) => {
  try {
    const params = queryString.stringify({
      fly_from: flyFrom,
      fly_to: flyTo,
      date_from: formatDateToKiwi(date),
      date_to: formatDateToKiwi(date),
      flight_type: flightType,
      adults,
      curr,
      locale,
      max_stopovers: maxStopovers,
      conn_on_diff_airport: 0,
      ret_from_diff_airport: 1,
      ret_to_diff_airport: 1,
      vehicle_type: vehicleType,
      sort,
    })
    logger.info(`fetching: ${flyFrom} - ${flyTo}, ${date}`)
    const response = await fetch(`${TEQUILA_API_BASE_URL}/search?${params}`, {
      headers: {
        apikey: process.env.TEQUILA_API_KEY,
      },
    })
    if (response.status !== 200) {
      if (response.status === 429) {
        logger.warn('API limit exceeded')
        await sleep(WAIT_TIME_AFTER_LIMIT_EXCEEDED_IN_MS)
        return null
      }
      const { fault } = await response.json()
      logger.error('kiwiRequestFault', fault.faultstring)
      return null
    }
    logger.info(`fetchingFinished: ${flyFrom} - ${flyTo}, ${date}`)
    const { data } = await response.json()
    if (!data) {
      return null
    }
    const formattedResult = data.map(mapKiwiFlights)
    return formattedResult[0]
  } catch (error) {
    logger.error(`kiwiRequestError ${flyFrom} - ${flyTo}, ${date}`, error)
  }
}

module.exports = { fetchFirstFlight }
