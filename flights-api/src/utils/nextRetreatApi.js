const fetch = require('node-fetch')
const logger = require('./logger') 
const NodeCache = require( "node-cache")
const FlighsCache = new NodeCache()

const COMMON_HEADERS = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
}

const CACHE_KEY = 'NR_getDestinations'

const getDestinations = async () => {
  try {     
    if(FlighsCache.has(CACHE_KEY)) return FlighsCache.get(CACHE_KEY)
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
    
    FlighsCache.set(CACHE_KEY, destinationsResult.data.availableDestinations, 10000)

    return destinationsResult.data.availableDestinations
  } catch (error) {
    logger.error('destinationsFetchError', error)
    process.exit(1)
  }
}

module.exports = { getDestinations }
