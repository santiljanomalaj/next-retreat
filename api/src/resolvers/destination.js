const fetch = require('node-fetch')
const orderBy = require('lodash.orderby')
const logger = require('../utils/logger')
const { convertCelsiusToFahrenheit } = require('../utils/helpers')
const { getPaginationInfo } = require('../utils/pagination')
const { NotFoundError } = require('../utils/graphqlErrors')
const { sendEmail } = require('../utils/email')
const Destination = require('../models/Destination')
const OriginLocation = require('../models/OriginLocation')
const DestinationCityCode = require('../models/DestinationCityCode')
const { SENDGRID_EMAIL_TEMPLATE_IDS } = require('../constants')

const TRAVEL_TYPES = {
  UNAVAILABLE: 'UNAVAILABLE',
  DRIVING: 'DRIVING',
  FLIGHT: 'FLIGHT',
  NONE: 'NONE',
}

const average = (...nums) =>
  nums.reduce((acc, val) => acc + val, 0) / nums.length
const transformCoordinates = (coordinates) =>
  coordinates.map(({ lat, lon }) => `${lat},${lon}`).join('|')

const fetchDrivingDurations = async ({ origins, destinations }) => {
  try {
    // Sending in reversed order so the matrix comes back with correct structure
    const drivingDistancesRequest = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${transformCoordinates(
        destinations
      )}&destinations=${transformCoordinates(origins)}&key=${
        process.env.GOOGLE_API_KEY
      }`
    )
    const drivingDistancesResult = await drivingDistancesRequest.json()

    const drivingDurations = drivingDistancesResult.rows.map(
      ({ elements }, i) => ({
        destinationId: destinations[i].id,
        drivingDurations: elements.map(({ duration: { value } = {} }, j) => ({
          originLocation: origins[j].code,
          duration: Math.floor(value / 60),
          coordinates: { lat: origins[j].lat, lon: origins[j].lon },
          type: TRAVEL_TYPES.DRIVING,
        })),
      })
    )

    return drivingDurations
  } catch (error) {
    logger.error('fetchDrivingDurations', error)
    throw error
  }
}

const fetchFlightStats = async ({
  originLocations,
  destinations,
  dateFrom,
  dateTo,
  sorter,
  destinationsCityCodes,
}) => {
  try {
    const flightStatsRequest = await fetch(process.env.FLIGTHS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query flightStats2($input: FlightStatsInput!) {
            flightStats2(input: $input) {
              destination
              unavailableFlights
              duration
              price
              flightDurations {
                originLocation
                duration                 
                price
                stepovers
                airportTo
              }
              rank
            }
          }`,
        variables: {
          input: {
            filter: {
              originLocations,
              destinations,
              dateFrom,
              dateTo,
              destinationsCityCodes,
            },
            sorter,
          },
        },
      }),
    })
    const flightStatsResult = await flightStatsRequest.json()
    return flightStatsResult.data.flightStats2
  } catch (error) {
    logger.error('fetchFlightStats', error)
    throw error
  }
}

const applyFiltersOnDestinationsQuery = ({ destinationsQuery, filter }) => {
  const { type } = filter
  if (type && type.length !== 0) {
    destinationsQuery.joinRelated('types').whereIn('types.name', type)
  }
}

const transformDestination = (destination) => {
  const { lat, lon, types, climate, airports } = destination
  return {
    ...destination,
    types: types.map(({ name }) => name),
    avgTemperaturesByMonth: climate.map(({ month, valueCelsius: celsius }) => ({
      month,
      celsius,
      fahrenheit: convertCelsiusToFahrenheit(celsius),
    })),
    coordinates: { lat, lon },
    airports: airports.map(({ name, code, ...airport }) => ({
      name,
      code,
      coordinates: { lat: airport.lat, lon: airport.lon },
    })),
  }
}

module.exports = {
  Query: {
    destinations: async (_, { input }) => {
      const {
        filter,
        sorter,
        pagination: { page, limit },
      } = input
      const {
        domesticTravelCountryCode,
        originLocations,
        monthFromUtc,
        monthToUtc,
      } = filter

      const filteredOriginLocations = await OriginLocation.query().whereIn(
        'code',
        originLocations
      )

      const destinationsListQuery = Destination.query().select(
        'destinations.id',
        'destinations.kiwiCityId',
        'destinations.countryCode',
        'destinations.lat',
        'destinations.lon'
      )

      applyFiltersOnDestinationsQuery({
        destinationsQuery: destinationsListQuery,
        filter,
      })
      const destinationsList = await destinationsListQuery
      const domesticDestinationList =
        domesticTravelCountryCode &&
        destinationsList.filter(
          ({ countryCode }) => countryCode === domesticTravelCountryCode
        )

      const destinationsCityCodes = await DestinationCityCode.query()
      const flightStats = await fetchFlightStats({
        originLocations,
        destinations: destinationsList.map(({ id }) => id),
        dateFrom: monthFromUtc,
        dateTo: monthToUtc,
        sorter,
        destinationsCityCodes,
      })

      const filteredFlightStats = flightStats.filter(
        ({ destination, unavailableFlights }) => {
          const areSomeFlightsAvailable =
            unavailableFlights.length !== originLocations.length

          if (domesticTravelCountryCode) {
            return (
              areSomeFlightsAvailable ||
              domesticDestinationList.some(({ id }) => id === destination)
            )
          }

          return areSomeFlightsAvailable
        }
      )
      const orderedFlightStats = domesticTravelCountryCode
        ? orderBy(
            filteredFlightStats,
            ({ destination }) =>
              domesticDestinationList.some(({ id }) => id === destination),
            'desc'
          )
        : filteredFlightStats

      const destinationsQuery = Destination.query()
        .withGraphFetched({
          types: true,
          climate: true,
          airports: true,
        })
        .whereIn(
          'destinations.id',
          orderedFlightStats.map(({ destination }) => destination)
        )
        .orderByRaw(
          orderedFlightStats
            .map(({ destination }) => `destinations.id='${destination}' DESC`)
            .join(',')
        )
      applyFiltersOnDestinationsQuery({
        destinationsQuery,
        filter,
      })
      const [total, destinations] = await Promise.all([
        destinationsQuery.resultSize(),
        destinationsQuery.limit(limit).offset((page - 1) * limit),
      ])

      const drivingDurationsMatrix = domesticTravelCountryCode
        ? await fetchDrivingDurations({
            origins: filteredOriginLocations,
            destinations: domesticDestinationList,
          })
        : []

      const data = orderedFlightStats.reduce(
        (
          acc,
          {
            destination: destinationId,
            unavailableFlights,
            price,
            flightDurations,
            rank,
          }
        ) => {
          const destination = destinations.find(
            ({ id }) => id === destinationId
          )
          if (destination) {
            const isDomestic =
              destination.countryCode === domesticTravelCountryCode
            const { drivingDurations = [] } =
              drivingDurationsMatrix.find(
                (row) => row.destinationId === destinationId
              ) || {}

            const travelDurations = filteredOriginLocations
              .map(({ code, lat, lon }) => {
                const flightConnection = flightDurations.find(
                  ({ originLocation }) => originLocation === code
                )
                const isUnavailable =
                  unavailableFlights.includes(code) && !isDomestic

                return flightConnection
                  ? {
                      ...flightConnection,
                      coordinates: { lat, lon },
                      type: TRAVEL_TYPES.FLIGHT,
                    }
                  : {
                      originLocation: code,
                      duration: isUnavailable ? null : 0,
                      coordinates: { lat, lon },
                      type: isUnavailable
                        ? TRAVEL_TYPES.UNAVAILABLE
                        : TRAVEL_TYPES.NONE,
                    }
              })
              .map((connection) => {
                const drivingConnection = drivingDurations.find(
                  ({ originLocation }) =>
                    originLocation === connection.originLocation
                )
                const drivingConnectionCondition =
                  drivingConnection &&
                  (drivingConnection.duration < connection.duration ||
                    connection.type !== TRAVEL_TYPES.FLIGHT)

                return drivingConnectionCondition
                  ? drivingConnection
                  : connection
              })

            const avgTravelTimeInMinutes =
              average(
                ...travelDurations
                  .filter(
                    ({ duration: travelDuration }) => travelDuration !== null
                  )
                  .map(({ duration: travelDuration }) => travelDuration)
              ) || 0

            return [
              ...acc,
              {
                ...transformDestination(destination),
                avgTravelTimeInMinutes,
                avgPrice: { amount: price },
                unavailableOriginLocationIds: unavailableFlights,
                availableOriginLocationIds: originLocations.filter(
                  (originLocationId) =>
                    !unavailableFlights.includes(originLocationId)
                ),
                flightDurations,
                travelDurations,
                isDomestic,
                rank,
              },
            ]
          }
          return acc
        },
        []
      )

      const orderedData = domesticTravelCountryCode
        ? [
            ...orderBy(
              data.filter(({ isDomestic }) => isDomestic),
              sorter === 'PRICE' ? 'avgPrice.amount' : 'avgTravelTimeInMinutes'
            ),
            ...data.filter(({ isDomestic }) => !isDomestic),
          ]
        : data

      return {
        data: orderedData,
        originLocations: filteredOriginLocations,
        paginationInfo: getPaginationInfo({ total, limit, page }),
      }
    },
    destination: async (_, { input: { id, originLocations } }) => {
      const destination = await Destination.query()
        .withGraphFetched({ types: true, climate: true, airports: true })
        .findById(id)
      if (!destination) {
        throw new NotFoundError({
          message: 'Invalid destination id',
        })
      }
      const destinationsCityCodes = await DestinationCityCode.query()
      const flightStats = await fetchFlightStats({
        originLocations,
        destinations: [destination.id],
        destinationsCityCodes,
      })
      return {
        ...transformDestination(destination),
        avgTravelTimeInMinutes: flightStats[0].duration,
        avgPrice: { amount: flightStats[0].price },
        unavailableOriginLocationIds: flightStats[0].unavailableFlights,
        availableOriginLocationIds: originLocations.filter(
          (originLocationId) =>
            !flightStats[0].unavailableFlights.includes(originLocationId)
        ),
        flightDurations: flightStats[0].flightDurations,
      }
    },
    availableDestinations: async () =>
      Destination.query()
        .withGraphFetched('airports')
        .orderBy('id'),
    availableDestinationsDates: async () => {
      try {
        const result = await fetch(process.env.FLIGTHS_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
            query availableFlightDates {
              availableFlightDates {
                dateFrom
                dateTo
              }
            }`,
          }),
        })
        const { data } = await result.json()
        return data.availableFlightDates
      } catch (error) {
        logger.error('fetchAvailableFlightDates', error)
        throw error
      }
    },
    destinationsCityCodes: () => DestinationCityCode.query(),
  },
  Mutation: {
    insertDestinationSuggestion: async (_, { input }) => {
      try {
        await sendEmail({
          from: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
          to: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
          templateId: SENDGRID_EMAIL_TEMPLATE_IDS.NEW_DESTINATION_REQUEST,
          dynamicTemplateData: { ...input },
        })
      } catch (error) {
        return false
      }
      return true
    },
  },
}
