/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop, no-restricted-syntax */
const difference = require('lodash/difference')
const orderBy = require('lodash/orderBy')
const meanBy = require('lodash/meanBy')
const db = require('../utils/db')
const { getDestinations } = require('../utils/nextRetreatApi')

const getOriginLocationsWithRemovedSameDestinations = ({
  destinationsCityCodes,
  destination,
  originLocations,
}) => {
  const destinationIdByCityCodeMap = destinationsCityCodes
    .filter(({ destinationId }) => destinationId === destination)
    .reduce(
      (acc, { destinationId, cityCode }) => ({
        ...acc,
        [cityCode]: destinationId,
      }),
      {}
    )
  return originLocations.filter(
    (originLocation) =>
      destinationIdByCityCodeMap[originLocation] !== destination
  )
}

const getFlights = ({
  isReturnFlight,
  originLocations,
  destinationAirportCodes,
  dateFrom,
  dateTo,
}) => {
  const cityColumn = isReturnFlight ? 'city_to' : 'city_from'
  const whereFrom = isReturnFlight ? 'airport_from' : 'city_from'
  const whereTo = isReturnFlight ? 'city_to' : 'airport_to'

  return db.knex.raw(
    `
      SELECT
        to_char(date, 'YYYY-MM-DD') AS iso_date,
        SUM(duration) / count(DISTINCT ${cityColumn}) AS duration,
        AVG(price) AS price,
        string_agg(${cityColumn}, ',' ORDER BY ${cityColumn}) as origin_locations
      FROM (
        SELECT
          DISTINCT ON (date, ${cityColumn})
          date,
          duration,
          price,
          ${cityColumn}
        FROM
          transformed_flights
        WHERE
          ${whereFrom} = ${db.knex.raw(
      'ANY(?)',
      `{${originLocations.join(',')}}`
    )}
          AND ${whereTo} = ${db.knex.raw(
      'ANY(?)',
      `{${destinationAirportCodes.join(',')}}`
    )}
        ORDER BY
          date, ${cityColumn}, duration, price) as f
      WHERE
        date >= ${dateFrom ? ':dateFrom' : 'NOW()'}
        ${dateTo ? ' AND date <= :dateTo' : ''}
      GROUP BY
        date
      ORDER BY
        date
  `,
    {
      dateFrom,
      dateTo,
    }
  )
}

const getFlightRank = ({ duration, price }) => duration + price * 0.5

const createView = ({ viewName, originLocations, dateFrom, dateTo }) =>
  db.knex.raw(
    `CREATE MATERIALIZED VIEW ${db.knex.raw(viewName)}
    AS
      SELECT
        city_from,
        city_to,
        airport_from,
        airport_to,
        date,
        duration,
        price
      FROM
        transformed_flights
      WHERE
        (
          city_from = ${db.knex.raw('ANY(?)', `{${originLocations.join(',')}}`)}
          OR city_to = ${db.knex.raw(
            'ANY(?)',
            `{${originLocations.join(',')}}`
          )}
        )
        AND (date >= ${dateFrom ? `'${db.knex.raw(dateFrom)}'` : 'NOW()'}
        ${dateTo ? ` AND date <= '${db.knex.raw(dateTo)}'` : ''})
    WITH DATA;
    CREATE INDEX ${db.knex.raw(viewName)}_city_from_index ON ${db.knex.raw(
      viewName
    )} (city_from);
    CREATE INDEX ${db.knex.raw(viewName)}_city_to_index ON ${db.knex.raw(
      viewName
    )} (city_to);
    CREATE INDEX ${db.knex.raw(viewName)}_airport_from_index ON ${db.knex.raw(
      viewName
    )} (airport_from);
    CREATE INDEX ${db.knex.raw(viewName)}_airport_to_index ON ${db.knex.raw(
      viewName
    )} (airport_to);
  `
  )

const dropView = (viewName) =>
  db.knex.raw(`DROP MATERIALIZED VIEW ${db.knex.raw(viewName)}`)

const getFlightStats = ({
  viewName,
  originLocations,
  destinationAirportCodes,
  isReturnFlight,
}) => {
  const cityColumn = isReturnFlight ? 'city_to' : 'city_from'
  const whereFrom = isReturnFlight ? 'airport_from' : 'city_from'
  const whereTo = isReturnFlight ? 'city_to' : 'airport_to'

  return db.knex.raw(`
    SELECT
      date,
      to_char(date, 'YYYY-MM-DD') AS iso_date,
      SUM(duration) / count(DISTINCT ${cityColumn}) AS duration,
      AVG(price) AS price,
      string_agg(${cityColumn}, ',' ORDER BY ${cityColumn}) AS origin_locations,
      string_agg(${cityColumn} || '|' || CAST(duration AS VARCHAR), ',') AS durations
    FROM (
      SELECT
        DISTINCT ON (date, ${cityColumn})
        date,
        duration,
        price,
        ${whereFrom},
        ${whereTo}
      FROM
        ${db.knex.raw(viewName)}
      WHERE
      ${whereFrom} = ${db.knex.raw('ANY(?)', `{${originLocations.join(',')}}`)}
      AND ${whereTo} = ${db.knex.raw(
    'ANY(?)',
    `{${destinationAirportCodes.join(',')}}`
  )}
      ORDER BY
        date, ${cityColumn}, duration, price) as f
    GROUP BY
      date
    ORDER BY
      date
  `)
}

const getUnavailableFlights = ({ originLocations, flights }) => {
  const availableFlights = flights.split(',')
  return originLocations.filter((loc) => !availableFlights.includes(loc))
}

const getReturnFlight = ({
  sameDestinationOriginLocations,
  originLocations,
  departure,
  arrival,
}) => {
  if (!arrival) {
    return []
  }
  const availableFlightsFrom = departure.origin_locations.split(',') //ams,bud
  const unavailableFlightsFrom = originLocations.filter(
    (loc) => !availableFlightsFrom.includes(loc)
  )
  const availableFlightsTo = arrival.origin_locations.split(',')
  const unavailableFlightsTo = originLocations.filter(
    (loc) => !availableFlightsTo.includes(loc)
  )
  const unavailableFlights = [
    ...new Set([...unavailableFlightsFrom, ...unavailableFlightsTo]),
  ]
  const departureFlightDurations = departure.durations
    .split(',')
    .reduce((acc, flight) => {
      const [originLocation, duration] = flight.split('|')
      return [...acc, { originLocation, duration: parseInt(duration, 10) }]
    }, [])
  const arrivalFlightDurations = arrival.durations
    .split(',')
    .reduce((acc, flight) => {
      const [originLocation, duration] = flight.split('|')
      return [...acc, { originLocation, duration: parseInt(duration, 10) }]
    }, [])
  const flightDurations = departureFlightDurations.reduce(
    (acc, departureFlightDuration) => {
      const arrivalFlightDuration = arrivalFlightDurations.find(
        ({ originLocation }) =>
          originLocation === departureFlightDuration.originLocation
      )
      if (arrivalFlightDuration) {
        return [
          ...acc,
          {
            originLocation: arrivalFlightDuration.originLocation,
            duration:
              arrivalFlightDuration.duration + departureFlightDuration.duration,
          },
        ]
      }
      return acc
    },
    []
  )

  return [
    {
      dateFrom: departure.date,
      dateTo: arrival.date,
      isoDateFrom: departure.iso_date,
      isoDateTo: arrival.iso_date,
      duration:
        Math.floor(
          meanBy([
            ...flightDurations.map(({ duration }) => duration),
            ...sameDestinationOriginLocations.map(() => 0),
          ])
        ) || 0,
      price: parseFloat(departure.price) + parseFloat(arrival.price),
      flightDurations,
      unavailableFlights,
      unavailableFlightsCount: unavailableFlights.length,
    },
  ]
}

const getData = async ({
  destination,
  destinationsData,
  destinationsCityCodes,
  viewName,
  filter,
  sorter,
  flightsByDestinations,
  i,
}) => {
  const destinationAirportCodes = destinationsData
    .find(({ id }) => id === destination)
    .airports.map(({ code }) => code)
  const originLocations = getOriginLocationsWithRemovedSameDestinations({
    destinationsCityCodes,
    destination,
    originLocations: filter.originLocations,
  })
  const sameDestinationOriginLocations = difference(
    filter.originLocations,
    originLocations
  )
  console.time(`getFlightStats${i}`)
  const [departureResults, arrivalResults] = await Promise.all([
    getFlightStats({
      viewName,
      originLocations,
      destinationAirportCodes,
    }),
    getFlightStats({
      viewName,
      originLocations: destinationAirportCodes,
      destinationAirportCodes: originLocations,
      isReturnFlight: true,
    }),
  ])
  console.timeEnd(`getFlightStats${i}`)
  const departures = departureResults.rows
  const arrivals = arrivalResults.rows

  const returnFlights = departures.reduce((acc, departure, index) => {
    return [
      ...acc,
      ...getReturnFlight({
        sameDestinationOriginLocations,
        originLocations,
        departure,
        arrival: arrivals[index + 2],
        index,
      }),
      ...getReturnFlight({
        sameDestinationOriginLocations,
        originLocations,
        departure,
        arrival: arrivals[index + 3],
      }),
      ...getReturnFlight({
        sameDestinationOriginLocations,
        originLocations,
        departure,
        arrival: arrivals[index + 4],
      }),
      ...getReturnFlight({
        sameDestinationOriginLocations,
        originLocations,
        departure,
        arrival: arrivals[index + 5],
      }),
      ...getReturnFlight({
        sameDestinationOriginLocations,
        originLocations,
        departure,
        arrival: arrivals[index + 6],
      }),
    ]
  }, [])
  let orderedReturnFlights
  if (sorter === 'OPTIMAL') {
    orderedReturnFlights = orderBy(
      returnFlights.map((returnFlight) => ({
        ...returnFlight,
        rank: getFlightRank({
          duration: returnFlight.duration,
          price: returnFlight.price,
        }),
      })),
      ['unavailableFlightsCount', 'rank'],
      ['asc', 'asc']
    )
  } else if (sorter === 'TRAVEL_TIME') {
    orderedReturnFlights = orderBy(
      returnFlights,
      ['unavailableFlightsCount', 'duration'],
      ['asc', 'asc']
    )
  } else if (sorter === 'PRICE') {
    orderedReturnFlights = orderBy(
      returnFlights,
      ['unavailableFlightsCount', 'price'],
      ['asc', 'asc']
    )
  }
  const {
    duration = 0,
    flightDurations = [],
    unavailableFlights = originLocations,
    isoDateFrom,
    isoDateTo,
  } = orderedReturnFlights[0] || {}

  const price = meanBy(orderedReturnFlights, 'price') || 0
  flightsByDestinations.push({
    destination,
    duration,
    price,
    flightDurations,
    unavailableFlights,
    dateFrom: isoDateFrom,
    dateTo: isoDateTo,
    rank: getFlightRank({ duration, price }),
  })
}

const getObjectWithMinimalValue = (array, attrib) => {
  let result = array[0]
  for (let i = 0; i < array.length; i++) {
    const current = array[i]
    if (current[attrib] < result[attrib]) {
      result = current
    }
  }
  return result
}

const getObjectWithMaxlValue = (array, attrib) => {
  let result = array[0]
  for (let i = 0; i < array.length; i++) {
    const current = array[i]
    if (current[attrib] > result[attrib]) {
      result = current
    }
  }
  return result
}

const getFlightConnectionStatistics = (flights) => {
  // minimal cost
  // average cost
  // minimal duration
  // maximum duration
  // average duration
  // max stepovers
  let minCost = Infinity
  let maxCost = -Infinity
  let minDuration = Infinity
  let maxDuration = -Infinity
  let maxStepover = 0
  let priceSum = 0
  let durationSum = 0

  for (let i = 0; i < flights.length; i++) {
    const flight = flights[i]

    if (flight.price < minCost) minCost = flight.price
    if (flight.price > maxCost) maxCost = flight.price
    if (flight.duration < minDuration) minDuration = flight.duration
    if (flight.duration > maxDuration) maxDuration = flight.duration
    if (maxStepover === 0 && flight.stepovers > 0) maxStepover = 1

    priceSum += flight.price
    durationSum += flight.durationSum
  }

  return {
    minCost,
    maxCost,
    minDuration,
    maxDuration,
    stepovers: maxStepover,
    avgPrice: priceSum / flights.length,
    avgDuraiton: durationSum / flights.length,
  }
}

const getAverageFromArrayOfObjects = (array, attrib) => {
  let sum = 0
  for (let i = 0; i < array.length; i++) {
    sum += Number(array[i][attrib])
  }
  return Math.ceil(sum / array.length)
}

module.exports = {
  Query: {
    flights: async (_, { input }) => {
      const destinationsData = await getDestinations()
      const {
        destination,
        departureDates,
        arrivalDates,
        destinationsCityCodes,
      } = input
      const originLocations = getOriginLocationsWithRemovedSameDestinations({
        destinationsCityCodes,
        destination,
        originLocations: input.originLocations,
      })
      const destinationAirportCodes = destinationsData
        .find(({ id }) => id === destination)
        .airports.map(({ code }) => code)
      let departures = []
      let arrivals = []

      const getFlightsPromises = [null, null]
      if (departureDates.length > 0) {
        getFlightsPromises[0] = getFlights({
          originLocations,
          destinationAirportCodes,
          dateFrom: departureDates[0],
          dateTo: departureDates[departureDates.length - 1],
        })
      }
      if (arrivalDates.length > 0) {
        getFlightsPromises[1] = getFlights({
          originLocations: destinationAirportCodes,
          destinationAirportCodes: originLocations,
          isReturnFlight: true,
          dateFrom: arrivalDates[0],
          dateTo: arrivalDates[arrivalDates.length - 1],
        })
      }
      const [departureResults, arrivalResults] = await Promise.all(
        getFlightsPromises
      )
      if (departureResults && departureResults.rows)
        departures = departureResults.rows
      if (arrivalResults && arrivalResults.rows) arrivals = arrivalResults.rows

      return {
        departures: departureDates.map((date) => {
          const { duration = 0, price = 0, origin_locations } =
            departures.find(({ iso_date }) => iso_date === date) || {}
          return {
            date,
            duration: parseInt(duration, 10),
            price,
            unavailableFlights: origin_locations
              ? getUnavailableFlights({
                  originLocations,
                  flights: origin_locations,
                })
              : originLocations,
          }
        }),
        arrivals: arrivalDates.map((date) => {
          const { duration = 0, price = 0, origin_locations } =
            arrivals.find(({ iso_date }) => iso_date === date) || {}
          return {
            date,
            duration: parseInt(duration, 10),
            price,
            unavailableFlights: origin_locations
              ? getUnavailableFlights({
                  originLocations,
                  flights: origin_locations,
                })
              : originLocations,
          }
        }),
      }
    },
    flightStats: async (_, { input }) => {
      const destinationsData = await getDestinations()
      console.time('flightStats')
      const { filter, sorter } = input
      const { destinations, dateFrom, dateTo, destinationsCityCodes } = filter
      const flightsByDestinations = []
      console.time('createView')
      const viewName = `${filter.originLocations
        .join('')
        .toLowerCase()}${Date.now()}`
      console.log('viewName', viewName)
      await createView({
        viewName,
        originLocations: filter.originLocations,
        dateFrom,
        dateTo,
      })
      console.timeEnd('createView')

      // the destinations prefiltering should be done => smaller amount of requests

      await Promise.all(
        destinations.map((destination, i) =>
          getData({
            destination,
            destinationsData,
            destinationsCityCodes,
            viewName,
            filter,
            sorter,
            flightsByDestinations,
            i,
          })
        )
      )

      await dropView(viewName)

      let secondSortOption
      if (sorter === 'TRAVEL_TIME') {
        secondSortOption = 'duration'
      } else if (sorter === 'PRICE') {
        secondSortOption = 'price'
      }
      console.timeEnd('flightStats')
      return orderBy(
        flightsByDestinations,
        sorter === 'OPTIMAL'
          ? [({ unavailableFlights }) => unavailableFlights.length, 'rank']
          : secondSortOption,
        sorter === 'OPTIMAL' ? ['asc', 'asc'] : 'asc'
      )
    },
    availableFlightDates: async () => {
      const result = await db.knex.raw(
        "SELECT to_char(GREATEST(MIN(date), NOW()), 'YYYY-MM-DD') AS date_from, to_char(MAX(date), 'YYYY-MM-DD') AS date_to FROM transformed_flights"
      )
      const { date_from, date_to } = result.rows[0]
      return {
        dateFrom: date_from,
        dateTo: date_to,
      }
    },
    flightStats2: async (_, { input }) => {
      const destinationsData = await getDestinations()
      const { filter, sorter } = input
      const { destinations, dateFrom, dateTo, originLocations } = filter

      const allAirports = [
        ...new Set(
          destinationsData
            .filter((destination) => destinations.includes(destination.id))
            .map((destination) => destination.airports.map(({ code }) => code))
        ),
      ]
      let aggregatedData = {}
      // Decide from which table we are going to read
      if (dateFrom || dateTo) {
        aggregatedData = await db.knex.raw(`
        select * from flights_by_month where 
        city_from = ${db.knex.raw(
          'ANY(?)',
          `{${originLocations.join(',')}}`
        )} AND 
        airport_to = ${db.knex.raw('ANY(?)', `{${allAirports.join(',')}}`)} AND
        date <= '${dateTo.substring(0, 7)}' AND date >= '${dateFrom.substring(
          0,
          7
        )}'
      `)
      } else {
        aggregatedData = await db.knex.raw(`
      select * from flights_by_year where 
      city_from = ${db.knex.raw(
        'ANY(?)',
        `{${originLocations.join(',')}}`
      )} AND 
      airport_to = ${db.knex.raw('ANY(?)', `{${allAirports.join(',')}}`)} 
    `)
      }

      aggregatedData = aggregatedData.rows

      let flightsByDestinations = destinations.map((destinationId) => {
        const destinationData = destinationsData.find(
          (dest) => dest.id === destinationId
        )
        const airportCodesForDestination = destinationData.airports.map(
          ({ code }) => code
        )
        const flightsForDestination = aggregatedData.filter((flight) =>
          airportCodesForDestination.includes(flight.airport_to)
        )

        const flightDurations = originLocations
          .filter((location) =>
            flightsForDestination.some(
              (flight) => flight.city_from === location
            )
          )
          .map((location) => {
            const flightsForLocation = flightsForDestination.filter(
              (flight) => flight.city_from === location
            )
            const shortestFlight = getObjectWithMinimalValue(
              flightsForLocation,
              'duration'
            )
            const highestStepover = getObjectWithMaxlValue(
              flightsForLocation,
              'stepovers'
            )
            return {
              originLocation: location,
              duration: shortestFlight.duration,
              price: shortestFlight.price,
              stepovers: highestStepover.step_overs,
              airportTo: shortestFlight.airport_to,
            }
          })
        if (flightDurations.length === 0) return null

        const averagePrice = getAverageFromArrayOfObjects(
          flightDurations,
          'price'
        )
        const averageDuration = getAverageFromArrayOfObjects(
          flightDurations,
          'duration'
        )

        return {
          destination: destinationId,
          unavailableFlights: originLocations.filter(
            (location) =>
              !flightsForDestination.some(
                (flight) => flight.city_from === location
              )
          ),
          flightDurations,
          price: averagePrice,
          duration: averageDuration,
          rank: getFlightRank({
            duration: averageDuration,
            price: averagePrice,
          }),
        }
      })

      flightsByDestinations = flightsByDestinations.filter(Boolean)

      let secondSortOption
      if (sorter === 'TRAVEL_TIME') {
        secondSortOption = 'duration'
      } else if (sorter === 'PRICE') {
        secondSortOption = 'price'
      } else if (sorter === 'OPTIMAL') {
        secondSortOption = 'rank'
      }

      return orderBy(
        flightsByDestinations,
        sorter === 'PRICE'
          ? secondSortOption
          : [
              ({ unavailableFlights }) => unavailableFlights.length,
              secondSortOption,
            ],
        sorter === 'PRICE' ? 'asc' : ['asc', 'asc']
      )
    },
  },
}
