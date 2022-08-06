/* eslint-disable prefer-destructuring */
const lastDayOfMonth = require('date-fns/lastDayOfMonth')
const startOfMonth = require('date-fns/startOfMonth')
const addMonths = require('date-fns/addMonths')
const addDays = require('date-fns/addDays')
const isEqual = require('date-fns/isEqual')
const logger = require('./utils/logger')

const CACHE_START_DATE = startOfMonth(new Date(2020, 10, 1))

const getNextRequestInstructions = async ({
  prevInstructions,
  originLocations,
  destinations,
}) => {
  let date
  let origin
  let destination

  if (prevInstructions) {
    // if there is an instruction before, set the starting point for calculation to that record
    date = prevInstructions.date
    origin = prevInstructions.origin
    destination = prevInstructions.destination
  } else {
    // the beginning of the data fetching, when there is no record in DB
    // start date of the cache is set here
    date = CACHE_START_DATE
    origin = originLocations[0]
    destination = destinations[0]
    return { date, origin, destination }
  }
  // get the last date of month from instruction
  const lastDate = lastDayOfMonth(date)
  // calculate next destination and origin:
  // check for last day in month, destinations and origins and reset dates / jump to next destination / origin
  if (isEqual(date, lastDate)) {
    const currentOriginLocationIndex = originLocations.indexOf(origin)
    const nextOriginLocationIndex = currentOriginLocationIndex + 1

    // if this is the last origin location
    // reset origin locations to beginning
    if (!originLocations[nextOriginLocationIndex]) {
      origin = originLocations[0]

      const currentDestinationIndex = destinations
        .map(({ id }) => id)
        .indexOf(destination.id)
      const nextDestinationIndex = currentDestinationIndex + 1

      // if this is the last destination
      // go to the next month
      if (!destinations[nextDestinationIndex]) {
        date = startOfMonth(addMonths(date, 1))
        origin = originLocations[0]
        destination = destinations[0]
        // TODO: here we can specify when to stop the fetching (how old should the cache be)
      } else {
        // go to the next destination
        destination = destinations[nextDestinationIndex]
      }
    } else {
      // go to the next origin location
      origin = originLocations[nextOriginLocationIndex]
    }
    // reset the date back to the first in month
    date = startOfMonth(date)
  } else {
    // increase the day by one if this is not the last day in month
    date = addDays(date, 1)
  }

  // skip the origin if it's the same as the destination
  if (destination.airports.split(',').includes(origin)) {
    logger.info(
      `skipping origin: ${origin} - destination ${destination.airports}`
    )
    const currentOriginLocationIndex = originLocations.indexOf(origin)
    const nextOriginLocationIndex = currentOriginLocationIndex + 1
    origin = originLocations[nextOriginLocationIndex]
  }
  return { date, origin, destination }
}

module.exports = getNextRequestInstructions
