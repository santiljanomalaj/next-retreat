const fetch = require('node-fetch')
const logger = require('../utils/logger')
const DestinationCityCode = require('../models/DestinationCityCode')

const fetchFlights = async ({
  originLocations,
  destination,
  arrivalDates,
  departureDates,
}) => {
  try {
    const destinationsCityCodes = await DestinationCityCode.query()
    const flightsRequest = await fetch(process.env.FLIGTHS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query flights($input: FlightsInput!) {
            flights(input: $input) {
              departures {
                date
                unavailableFlights
                duration
                price
              }
              arrivals {
                date
                unavailableFlights
                duration
                price
              }
            }
          }`,
        variables: {
          input: {
            originLocations,
            destination,
            arrivalDates,
            departureDates,
            destinationsCityCodes,
          },
        },
      }),
    })
    const flightsResult = await flightsRequest.json()
    return flightsResult.data ? flightsResult.data.flights : null
  } catch (error) {
    logger.error('fetchFlights', error)
    throw error
  }
}

module.exports = {
  Query: {
    flightOptionsGrid: async (
      _,
      { input: { arrivalDates, departureDates, destination, originLocations } }
    ) =>
      fetchFlights({
        arrivalDates,
        destination,
        departureDates,
        originLocations,
      }),
  },
}
