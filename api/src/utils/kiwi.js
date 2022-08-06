const fetch = require('node-fetch')
const queryString = require('query-string')

const KIWI_API_BASE_URL = 'https://tequila-api.kiwi.com'

const mapKiwiCities = ({
  id: kiwiId,
  code,
  name,
  country: { name: country },
  location: { lat, lon },
  airports,
  alternative_departure_points: alternativeDeparturePoints,
}) => ({
  code: code || kiwiId,
  kiwiId,
  name,
  country,
  lat,
  lon,
  nearestCities: !airports
    ? alternativeDeparturePoints
        .filter(({ id }) => id.length === 3)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 20)
        .map(({ id }) => id)
    : [],
})

const mapKiwiCountries = ({ id, code, name }) => ({
  id,
  code,
  name,
})

const fetchLocations = async (
  { search, ids, locationType, sortBy = 'name', limit },
  transform
) => {
  try {
    const params = queryString.stringify({
      term: search,
      type: ids && 'id',
      id: ids,
      location_types: locationType,
      sort: sortBy,
      limit,
      active_only: true,
    })
    const results = await fetch(
      `${KIWI_API_BASE_URL}/locations/query?${params}`,
      {
        headers: {
          apikey: process.env.TEQUILA_API_KEY,
        },
      }
    )
    const { locations } = await results.json()
    return locations.map(transform)
  } catch (error) {
    // do nothing
  }
}

const getCitiesBySearchString = async (search) => {
  try {
    const locations = await fetchLocations(
      {
        search,
        locationType: 'city',
        limit: 5,
      },
      mapKiwiCities
    )
    return locations
  } catch (error) {
    // do nothing
  }
}

const getCountriesBySearchString = async (search) => {
  try {
    const locations = await fetchLocations(
      {
        search,
        locationType: 'country',
        limit: 5,
      },
      mapKiwiCountries
    )
    return locations
  } catch (error) {
    // do nothing
  }
}

module.exports = { getCitiesBySearchString, getCountriesBySearchString }
