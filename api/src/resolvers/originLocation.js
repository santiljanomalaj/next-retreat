const uniq = require('lodash/uniq') // eslint-disable-line import/no-extraneous-dependencies
const { ValidationError } = require('../utils/graphqlErrors')
const {
  getCitiesBySearchString,
  getCountriesBySearchString,
} = require('../utils/kiwi')
const OriginLocation = require('../models/OriginLocation')

const SEARCH_RESULT_TYPES = {
  CITY: 'CITY',
  COUNTRY: 'COUNTRY',
  UNSUPPORTED_CITY: 'UNSUPPORTED_CITY',
  ALREADY_ADDED: 'ALREADY_ADDED',
}

const groupCitiesByCountryIntoSuggestions = (cities) =>
  cities
    .map(({ country }) => country)
    .reduce((groupedCities, countryName, i) => {
      const index = groupedCities.findIndex(
        ({ title }) => title === countryName
      )
      const country = groupedCities[index]
      const suggestion = cities[i]

      return index !== -1
        ? Object.assign(groupedCities, {
            [index]: {
              ...country,
              suggestions: country.suggestions.concat(suggestion),
            },
          })
        : groupedCities.concat({
            title: countryName,
            type: SEARCH_RESULT_TYPES.COUNTRY,
            suggestions: [suggestion],
          })
    }, [])

const getDbLocationsByCode = (codes) =>
  OriginLocation.query()
    .whereIn('code', codes)
    .orderByRaw(
      `array_position(array[${codes.map(
        (_) => '?'
      )}]::varchar[], code::varchar)`,
      codes
    )
    .limit(5)

module.exports = {
  Query: {
    searchLocations: async (
      _,
      { filter: { search, selectedOriginLocations } }
    ) => {
      const checkAlreadySelected = (loc) => {
        return {
          ...loc,
          type:
            !selectedOriginLocations.includes(loc.code) && !!loc.code
              ? loc.type
              : SEARCH_RESULT_TYPES.ALREADY_ADDED,
        }
      }

      let suggestedCitiesByCountry = []

      if (search.length >= 3) {
        const countriesFromKiwi = await getCountriesBySearchString(search)
        const names = countriesFromKiwi.map(({ name }) => name)

        const dbCitiesByCountry = await OriginLocation.query()
          .whereIn('country', names)
          .orderBy('name')
          .orderByRaw(
            `array_position(array[${names.map(
              (_) => '?'
            )}]::varchar[], country::varchar)`,
            names
          )
          .limit(55)

        suggestedCitiesByCountry = groupCitiesByCountryIntoSuggestions(
          dbCitiesByCountry.map(checkAlreadySelected)
        )
      }

      const citiesFromKiwi = await getCitiesBySearchString(search)
      const suggestedCities = await Promise.all(
        citiesFromKiwi.map(async ({ nearestCities, ...suggestion }) =>
          nearestCities.length > 0
            ? {
                title: `${suggestion.name}, ${suggestion.country}`,
                type: SEARCH_RESULT_TYPES.UNSUPPORTED_CITY,
                suggestions: (await getDbLocationsByCode(nearestCities)).map(
                  checkAlreadySelected
                ),
              }
            : {
                title: null,
                type: SEARCH_RESULT_TYPES.CITY,
                suggestions: (
                  await getDbLocationsByCode([suggestion.code])
                ).map(checkAlreadySelected),
              }
        )
      )

      return [...suggestedCities, ...suggestedCitiesByCountry]
    },
    originLocations: async (_, { filter: { ids } }) => {
      if (ids) {
        return OriginLocation.query().whereIn('code', ids)
      }
      return []
    },
    validateOriginLocations: (_, { locations }) => {
      const duplicates = locations.filter(
        (item, index) => locations.indexOf(item) !== index
      )
      if (duplicates.length) {
        throw new ValidationError({
          message: 'Invalid origin locations',
          data: {
            validationErrors: uniq(duplicates),
          },
        })
      }
      return true
    },
    availableOriginLocationCodes: async () => {
      const originLocationsData = await OriginLocation.query().orderBy('id')
      return originLocationsData.map(({ code }) => code)
    },
  },
  OriginLocation: {
    // TODO: remove id on FE and BE and use code instead
    id: ({ code }) => code,
    coordinates: ({ lat, lon }) => ({ lat, lon }),
  },
}
