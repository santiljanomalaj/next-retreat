/* eslint-disable camelcase */

const queryString = require('query-string')
const fetch = require('node-fetch')
const logger = require('./logger')
const { COMMON_PRICELINE_API_PARAMS } = require('../constants')

class CustomError extends Error {
  constructor({ message, name }) {
    super()
    this.message = message
    this.name = name
    this.time_thrown = new Date().toISOString()
  }
}

class PricelineError extends CustomError {
  constructor(message) {
    super({ message, name: 'PricelineError' })
  }
}

const PRICELINE_NO_RESULTS_ERROR_CODES = [
  '1.4802.437', // No hotel properties found for given search criteria
  '1.4802.44', // Hotels unavailable (PLG)
  '1.4802.53', // Hotels unavailable (PLG)
  '1.4802.464', // All enabled inventories returned without rates
  '1.5282.72', // Hotel unavailable (PLG)
  '1.5282.78', // Hotel.Results: Did not find any hotel rates
  // TODO: we are handling 1.5686.38 the same way as 1.4802.437 for now - Priceline bug
  '1.5686.38', // Hotel.Results: Occupancy per room cannot exceed 4 guests per room
]

const getExpressResults = async ({
  dateFromUtc,
  dateToUtc,
  teamSize,
  numberOfRooms,
  sortBy = 'gs',
  cityId,
  hotelIds,
  limit = 100,
  currency = 'EUR',
}) => {
  try {
    const params = {
      check_in: dateFromUtc,
      check_out: dateToUtc,
      // adults: teamSize,
      // rooms: numberOfRooms,
      sort_by: sortBy,
      city_id: cityId || undefined,
      hotel_ids: hotelIds || undefined,
      limit,
      currency,
      ...COMMON_PRICELINE_API_PARAMS,
    }

    if (teamSize) params.adults = teamSize
    if (numberOfRooms) params.rooms = numberOfRooms

    const paramsStr = queryString.stringify(params)
    const request = await fetch(
      `${process.env.PRICELINE_API_BASE_URL}/hotel/getExpress.Results?${paramsStr}`
    )
    const response = await request.json()
    // if priceline encounters an internal server error
    // `status = 500` is returned in the response
    const { status } = response
    if (status && status === '500') {
      throw new Error(response.message)
    }
    const {
      'getHotelExpress.Results': { error },
    } = response
    if (error) {
      if (PRICELINE_NO_RESULTS_ERROR_CODES.includes(error.status_code)) {
        if(error.status_code != '1.4802.464') {
          logger.warn('priceline.getExpress.Results', { data: { error } })
        }
      } else {
        logger.error(
          'priceline.getExpress.Results',
          new PricelineError(`${error.status_code} - ${error.status}`)
        )
      }
      return []
    }
    const {
      'getHotelExpress.Results': {
        results: { hotel_data },
      },
    } = response
    return hotel_data
  } catch (error) {
    logger.warn('priceline.getExpress.Results', error)
    throw error
  }
}

const getMultiContractByPpnBundle = async ({ ppnBundle, currency = 'EUR' }) => {
  const params = queryString.stringify({
    ppn_bundle: ppnBundle,
    currency,
    ...COMMON_PRICELINE_API_PARAMS,
  })
  try {
    const request = await fetch(
      `${process.env.PRICELINE_API_BASE_URL}/hotel/getExpress.MultiContract?${params}`
    )
    const response = await request.json()
    const {
      'getHotelExpress.MultiContract': { error },
    } = response
    if (error) {
      throw error
    }
    const {
      'getHotelExpress.MultiContract': {
        results: { hotel_data, taxes_and_fees },
      },
    } = response
    const roomData = hotel_data[0].room_data
    const taxesData = taxes_and_fees
    return {
      roomData,
      taxesData,
    }
  } catch (error) {
    logger.error('priceline.getHotelExpress.MultiContract', error.status)
  }
}

const getPhotosByHotelIds = async ({
  hotelIds,
  imageSize = 'large'
}) => {
  const params = queryString.stringify({
    hotel_ids: hotelIds || undefined,
    image_size: imageSize,
    ...COMMON_PRICELINE_API_PARAMS,
  })

  try {
    const response = await fetch(
      `${process.env.PRICELINE_API_BASE_URL}/hotel/getPhotos?${params}`
    )
    const {
      getHotelPhotos: {
        results: { hotel_photo_data },
      },
    } = await response.json()
    return (hotel_photo_data[0].photo_data || [])
  } catch (error) {
    return []
  }
}

module.exports = {
  getExpressResults,
  getMultiContractByPpnBundle,
  getPhotosByHotelIds,
}
