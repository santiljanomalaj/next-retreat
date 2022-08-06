const fetch = require('node-fetch')
const logger = require('./logger')

const COMMON_HEADERS = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
}

const getOriginLocations = async () => {
  try {
    const originLocationsRequest = await fetch(
      process.env.NEXT_RETREAT_API_URL,
      {
        ...COMMON_HEADERS,
        body: JSON.stringify({
          query: `
          query AvailableOriginLocationCodes {
            availableOriginLocationCodes
          }`,
        }),
      }
    )
    const originLocationsResult = await originLocationsRequest.json()
    return originLocationsResult.data.availableOriginLocationCodes
  } catch (error) {
    logger.error('originLocationsFetchError', error)
    process.exit(1)
  }
}

const getDestinations = async () => {
  try {
    const destinationsRequest = await fetch(process.env.NEXT_RETREAT_API_URL, {
      ...COMMON_HEADERS,
      body: JSON.stringify({
        query: `
        query AvailableDestinations {
          availableDestinations {
            id
            airports {
              code
            }
          }
        }
        `,
      }),
    })
    const destinationsResult = await destinationsRequest.json()
    return destinationsResult.data.availableDestinations
  } catch (error) {
    logger.error('destinationsFetchError', error)
    process.exit(1)
  }
}

module.exports = { getOriginLocations, getDestinations }
