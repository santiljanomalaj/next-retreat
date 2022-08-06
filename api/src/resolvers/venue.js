/* eslint-disable no-return-await */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */

const requestIp = require('request-ip')
const orderBy = require('lodash/orderBy') // eslint-disable-line import/no-extraneous-dependencies
const currency = require('currency.js')
const currencyUtils = require('../utils/currency')
const { NotFoundError } = require('../utils/graphqlErrors')
const { getPaginationInfo } = require('../utils/pagination')
const {
  getExpressResults,
  getMultiContractByPpnBundle,
  getPhotosByHotelIds,
} = require('../utils/priceline')
const Venue = require('../models/Venue')
const ActiveVenue = require('../models/ActiveVenue')
const CurrencyRate = require('../models/CurrencyRate')
const Destination = require('../models/Destination')
const RoomSearchData = require('../models/RoomSearchData')
const VenuePhoto = require('../models/VenuePhoto')
const { transformVenue } = require('./utils/venue')
const { VENUE_TYPE_GROUPS, VENUE_TYPE_ID_MAPPING } = require('../../scripts/priceline/venues_constants')
const ApiCommonCache = require('../utils/cacheLayer')

const PRICELINE_ROOM_API_BOOL_FALSE_RESPONSE = 'false'

const PRICELINE_SUPPORTED_INVENTORY_TYPES = {
  AGD: 'AGD', // Agoda
  BKG: 'BKG', // Booking
}

const VENUE_SORTER_TYPES = {
  OPTIMAL: 'OPTIMAL',
  TRAVEL_TIME: 'TRAVEL_TIME',
  PRICE: 'PRICE',
}

const HOTEL_TYPES = {
  HOTEL: 'HOTEL',
  APARTMENT: 'APARTMENT',
  HOUSE: 'HOUSE',
  OTHER: 'OTHER',
}

const AVERAGE_OCCUPANCIES = {
  [HOTEL_TYPES.HOTEL]: 2,
  [HOTEL_TYPES.OTHER]: 2,
  [HOTEL_TYPES.APARTMENT]: 5,
  [HOTEL_TYPES.HOUSE]: 10,
}

const VENUE_SOURCES = {
  PRICELINE : 'PPN',
  NEXT_RETREAT : 'NEX'
}

const AVAILBALE_ROOM_QUANTITY_FALLBACK = 99

const getNumberOfRoomsByHotelType = ({ teamSize, hotelType }) => {
  const occupancy = AVERAGE_OCCUPANCIES[hotelType]
  return Math.ceil(teamSize / occupancy)
}

const getSameRoomTypeIdFromRatePlanCode = (ratePlanCode) => {
  if (ratePlanCode.includes('BKG')) {
    return /BKG__([^_]+)_([^_]+)/.exec(ratePlanCode)[0]
  }
  return /^[^__]+/.exec(ratePlanCode)[0]
}

const getNumberOfUniqueRooms = (rooms) =>
  new Set(
    rooms.map(({ id: ratePlanCode }) =>
      getSameRoomTypeIdFromRatePlanCode(ratePlanCode)
    )
  ).size

const getCurrencyRateByIsoCode = ({ currencyRates, currencyIsoCode }) => {
  const currencyRate = currencyRates.find(
    (rate) => rate.currencyIsoCode === currencyIsoCode
  )
  if (currencyRate) {
    return currencyRate.value
  }
  return 1
}

const filterVenuesQueryByDynamicData = ({
  venuesQuery,
  sorter,
  dynamicVenueData,
}) => {
  venuesQuery.whereIn(
    'hotelidPpn',
    dynamicVenueData.map(({ id }) => id)
  )
  if (sorter !== VENUE_SORTER_TYPES.TRAVEL_TIME && dynamicVenueData.length) {
    venuesQuery.orderByRaw(
      `${dynamicVenueData.map(({ id }) => `hotelid_ppn=${id} DESC`)}`
    )
  }
}

const removeNullPricesAndRatingVenuesFromVenuesQuery = ({
  venuesQuery,
  hotelTypes,
}) => {
  venuesQuery
    // .whereNotNull('lowRate')
    // .whereNotNull('reviewRating')

  if (hotelTypes.includes(HOTEL_TYPES.HOUSE)) {
    venuesQuery.where((builder) => {
      builder.whereNotNull('lowRate')
      builder.orWhere('venue_type_n', '=', VENUE_TYPE_ID_MAPPING.Villas)
    })
  } else {
    venuesQuery.whereNotNull('lowRate')
  }
}

const applyMeetingRoomFilterOnVenuesQuery = ({ venuesQuery, filter }) => {
  const { isMeetingRoomIncluded } = filter
  if (isMeetingRoomIncluded) {
    venuesQuery.where('isMeetingRoomIncluded', true)
  }
}

// const VENUE_TYPES = {
//   APARTMENT: ['Apartment', 'Apartments'],
//   HOTEL: [
//     'Aparthotels',
//     'Hostel',
//     'Hostels',
//     'Hotel',
//     'Hotels',
//     'Motel',
//     'Resort',
//     'Resorts',
//   ],
//   HOUSE: [
//     'Bed and Breakfast',
//     'Bed and breakfasts',
//     'Boats',
//     'Campsites',
//     'Chalets',
//     'Country houses',
//     'Farm stays',
//     'Guest accommodation',
//     'Guest houses',
//     'Holiday homes',
//     'Holiday parks',
//     'Homestays',
//     'Inns',
//     'Lodges',
//     'Luxury tents',
//     'Residence',
//     'Villas',
//     'Other',
//   ],
//   OTHER: [
//     'Bed and Breakfast',
//     'Bed and breakfasts',
//     'Boats',
//     'Campsites',
//     'Chalets',
//     'Country houses',
//     'Farm stays',
//     'Guest accommodation',
//     'Guest houses',
//     'Holiday homes',
//     'Holiday parks',
//     'Homestays',
//     'Inns',
//     'Lodges',
//     'Luxury tents',
//     'Residence',
//     'Villas',
//     'Other',
//   ],
// }

const applyHotelTypeFilterOnVenuesQuery = ({ venuesQuery, filter }) => {
  const { type } = filter
  if (type && type.length !== Object.values(HOTEL_TYPES).length) {
    const { HOTEL, APARTMENT, HOUSE, OTHER } = HOTEL_TYPES
    if (type.length < 4) { //in case of 4 no need to filter
      venuesQuery.where(builder => {
        if(type.includes(HOTEL)){
          builder.orWhere(subBuilder => {
            subBuilder.where('venue_type_n', '>=', VENUE_TYPE_GROUPS.HOTEL)
            subBuilder.where('venue_type_n', '<', VENUE_TYPE_GROUPS.HOTEL + 100)
          })
        }
        if(type.includes(APARTMENT)){
          builder.orWhere(subBuilder => {
            subBuilder.where('venue_type_n', '>=', VENUE_TYPE_GROUPS.APARTMENT)
            subBuilder.where('venue_type_n', '<', VENUE_TYPE_GROUPS.APARTMENT + 100)
          })
        }
        if(type.includes(OTHER) || type.includes(HOUSE)){
          builder.orWhere(subBuilder => {
            subBuilder.where('venue_type_n', '>=', VENUE_TYPE_GROUPS.OTHER)
            subBuilder.where('venue_type_n', '<', VENUE_TYPE_GROUPS.OTHER + 100)
          })
        }
      })
      // venuesQuery.whereIn('hotelType', [
      //   ...(type.includes(HOTEL) ? VENUE_TYPES.HOTEL : []),
      //   ...(type.includes(APARTMENT) ? VENUE_TYPES.APARTMENT : []),
      //   ...(type.includes(HOUSE) ? VENUE_TYPES.HOUSE : []),
      //   ...(type.includes(OTHER) ? VENUE_TYPES.OTHER : []),
      // ])
    }
    if (type.length === 1 && type.includes(HOUSE)) {
      venuesQuery.where('is_entire_house', '=', true)
    }
  }
}

const applyPriceFilterOnVenuesQuery = ({
  venuesQuery,
  filter,
  currencyRate,
}) => {
  const {
    priceFrom: { amount: priceFrom },
    priceTo: { amount: priceTo },
  } = filter
  const priceFromEUR = currencyUtils.convertToEuro({
    value: priceFrom,
    currencyRate,
  })
  const priceToEUR = currencyUtils.convertToEuro({
    value: priceTo,
    currencyRate,
  })
  if (priceFrom != null && priceTo != null) {
    venuesQuery
      .where('lowRate', '>', priceFromEUR)
      .where('lowRate', '<', priceToEUR)
  }
}

const getMinimumNumberOfRooms = ({ teamSize, hotelTypes }) => {
  let minNumberOfRooms = 1
  hotelTypes.forEach((hotelType) => {
    const buffer = [HOTEL_TYPES.HOTEL, HOTEL_TYPES.OTHER].includes(hotelType)
      ? 2.5
      : 1
    const numberOfRooms = Math.ceil(
      getNumberOfRoomsByHotelType({ teamSize, hotelType }) * buffer
    )
    minNumberOfRooms = Math.max(minNumberOfRooms, numberOfRooms)
  })

  return minNumberOfRooms
}

const applyRoomCountFilterOnVenuesQuery = ({
  venuesQuery,
  teamSize,
  hotelTypes,
}) => {
  venuesQuery.where((builder) => {
    builder.where((nonCapacityBuilder) => {
      nonCapacityBuilder.whereNull('capacity')
      nonCapacityBuilder.andWhere((roomCountsBuilder) => {
        hotelTypes.forEach((hotelType) => {
          if (hotelType !== HOTEL_TYPES.HOUSE) {
            const minNumberOfRooms = getMinimumNumberOfRooms({
              teamSize,
              hotelTypes: [hotelType],
            })
            roomCountsBuilder.orWhere((roomCountBuilder) => {
              roomCountBuilder.where(subRoomCountBuilder => {
                subRoomCountBuilder.where("venue_type_n", ">=", VENUE_TYPE_GROUPS[hotelType])
                subRoomCountBuilder.andWhere("venue_type_n", "<", VENUE_TYPE_GROUPS[hotelType] + 100)
              })
              roomCountBuilder.andWhere('roomCount', '>=', minNumberOfRooms)
            })
          }
        })
      })
    })
    builder.orWhere((capacityBuilder) => {
      capacityBuilder.whereNotNull('capacity')
      capacityBuilder.andWhere('capacity', '>=', teamSize)
    })
  })
}

const applyOptimalSortingOnVenuesQuery = ({ venuesQuery, sorter }) => {
  if (sorter === VENUE_SORTER_TYPES.OPTIMAL) {
    venuesQuery.orderBy('id')
  }
}

const applySortingByPriceOnVenuesQuery = ({ venuesQuery, sorter }) => {
  if (sorter === VENUE_SORTER_TYPES.PRICE) {
    venuesQuery.orderBy('lowRate')
  }
}

const applySortingByDistanceToAirportVenuesQuery = ({
  venuesQuery,
  sorter,
}) => {
  if (sorter === VENUE_SORTER_TYPES.TRAVEL_TIME) {
    venuesQuery.orderBy(
      ActiveVenue.relatedQuery('airports').min('distanceInKilometers')
    )
  }
}

const addRoomPricesToDynamicVenues = ({ id, room_data }) => {
  const roomPrices = room_data.map((rate) => {
    const { rate_data } = rate
    const { display_price, display_total } = rate_data[0].price_details
    return { display_price, display_total }
  })
  // priceline returns prices of rooms ordered by price
  return {
    id,
    price: roomPrices[0].display_price,
    totalPrice: roomPrices[0].display_total,
  }
}

const applyPriceFilterOnDynamicData = ({ dynamicData, filter }) => {
  const {
    priceFrom: { amount: priceFrom },
    priceTo: { amount: priceTo },
  } = filter
  if (priceFrom && priceTo) {
    return dynamicData.filter(
      ({ totalPrice }) => totalPrice > priceFrom && totalPrice < priceTo
    )
  }
  return dynamicData
}

const applySortingOnDynamicData = ({ dynamicData, sorter }) => {
  if (sorter === VENUE_SORTER_TYPES.PRICE) {
    return orderBy(dynamicData, 'totalPrice', 'asc')
  }
  return dynamicData
}

const applyPromotedOnlyFilterOnVenuesQuery = ({ venuesQuery, filter }) => {
  const { isPromotedOnly } = filter
  if (isPromotedOnly) {
    venuesQuery.where('isPromoted', true)
  }
}

const filterDynamicData = async ({
  hotelTypes,
  filter,
  sorter,
  currencyIsoCode,
}) => {
  const {
    dateFromUtc,
    dateToUtc,
    teamSize,
    destination: destinationId,
  } = filter
  const cities = await Destination.relatedQuery('cities')
    .for(destinationId)
    .select('ppnCityId')
  const results = await Promise.allSettled(
    hotelTypes.flatMap((hotelType) =>
      cities.map(({ ppnCityId }) =>
        getExpressResults({
          dateFromUtc,
          dateToUtc,
          teamSize,
          numberOfRooms: getNumberOfRoomsByHotelType({
            teamSize,
            hotelType,
          }),
          cityId: ppnCityId,
          currency: currencyIsoCode,
        })
      )
    )
  )
  if (!results || results.length === 0) {
    return []
  }
  const data = results
    .filter(({ status }) => status === 'fulfilled')
    .map(({ value }) => value)
    .flat()
  let dynamicData = []
  dynamicData = data.map(addRoomPricesToDynamicVenues)
  dynamicData = applyPriceFilterOnDynamicData({ dynamicData, filter })
  dynamicData = applySortingOnDynamicData({ dynamicData, sorter })
  return dynamicData
}

const getBoardType = ({ boardType, allInclusive }) => {
  const BOARD_TYPE_MESSAGES = {
    NONE: 'Room with no additional board/meal options',
    BREAKFAST: 'Room with free breakfast',
    ALL_INCLUSIVE: 'All-inclusive room with all meals provided',
  }
  if (allInclusive || boardType === BOARD_TYPE_MESSAGES.ALL_INCLUSIVE) {
    return BOARD_TYPE_MESSAGES.ALL_INCLUSIVE
  }
  return BOARD_TYPE_MESSAGES[boardType] || BOARD_TYPE_MESSAGES.NONE
}

const transformRoomData = ({
  title,
  description,
  cancellation_details,
  is_cancellable: isCancelable,
  rate_plan_code: ratePlanCode,
  price_details: {
    display_price: pricePerNight,
    display_taxes: taxesAndFees,
    display_property_fee: resortFee,
    display_sub_total: subtotal,
    display_total: total,
  },
  inventory_type: inventory,
  occupancy_limit: occupancyLimit,
  available_rooms: quantity,
  currencyIsoCode,
  board_type: boardType,
  all_inclusive: allInclusive,
  bedding_data,
  count,
}) => ({
  id: ratePlanCode,
  title,
  description,
  cancelationPolicy: {
    isCancelable: isCancelable !== PRICELINE_ROOM_API_BOOL_FALSE_RESPONSE,
    description:
      Array.isArray(cancellation_details) && cancellation_details[0] != null
        ? cancellation_details[0].description
        : '',
  },
  occupancyLimit,
  pricePerNight: {
    amount: pricePerNight,
    currencyIsoCode,
  },
  taxesAndFees: {
    amount: taxesAndFees,
    currencyIsoCode,
  },
  resortFee: {
    amount: resortFee,
    currencyIsoCode,
  },
  subtotal: {
    amount: subtotal,
    currencyIsoCode,
  },
  total: {
    amount: total,
    currencyIsoCode,
  },
  boardType: getBoardType({ boardType, allInclusive }),
  thumbnailUrls: [], // MOCK
  quantity,
  inventory,
  beddingData:
    bedding_data && bedding_data.length !== 0
      ? bedding_data.map(({ bed_count: bedCount, bed_type: bedType }) => ({
          bedType,
          bedCount,
        }))
      : null,
  ...(count && {
    subtotalSum: {
      amount: subtotal * count,
      currencyIsoCode,
    },
    taxesAndFeesSum: {
      amount: taxesAndFees * count,
      currencyIsoCode,
    },
    totalSum: {
      amount: total * count,
      currencyIsoCode,
    },
  }),
})

const getRoomsForVenueDetail = async ({
  dateFromUtc,
  dateToUtc,
  hotelidPpn,
  teamSize,
  currencyIsoCode,
  roomIdsWithCounts,
  numberOfRooms = 1,
  source
}) => {
  if(source === VENUE_SOURCES.NEXT_RETREAT) return []
  try {
    // If there are no rooms for given teamSize and dates,
    // priceline returns an error in Express.Results.
    // We return empty array, because there are no rooms for that combination
    const result = await getExpressResults({
      dateFromUtc,
      dateToUtc,
      teamSize,
      hotelIds: hotelidPpn,
      numberOfRooms,
      currency: currencyIsoCode,
    })

    const { ppn_bundle: ppnBundle } = result[0].room_data[0].rate_data[0]
    const { roomData } = await getMultiContractByPpnBundle({
      ppnBundle,
      currency: currencyIsoCode,
    })
    return roomData
      .map(({ rate_data }) =>
        rate_data.map((arg) => {
          const { count } =
            roomIdsWithCounts.find(({ id }) => id === arg.rate_plan_code) || {}

          return transformRoomData({
            ...arg,
            currencyIsoCode,
            count,
          })
        })
      )
      .reduce((acc, curr) => [curr[0], ...acc], [])
  } catch (error) {
    return []
  }
}

const filterUnsupportedInventories = ({ inventory }) =>
  Object.values(PRICELINE_SUPPORTED_INVENTORY_TYPES).includes(inventory)

const getRoomsFromRawRoomData = async ({
  hotelidPpn,
  rawRoomData,
  dateFromUtc,
  dateToUtc,
  currencyIsoCode,
  roomIdsWithCounts,
  source,
}) => {
  const { AGD, BKG } = PRICELINE_SUPPORTED_INVENTORY_TYPES
  const inventories = rawRoomData.reduce(
    (acc, { inventory }) => [
      ...acc,
      ...(!acc.includes(inventory) ? [inventory] : []),
    ],
    []
  )
  if (inventories.includes(BKG)) {
    return rawRoomData
      .filter(({ inventory }) => inventory === BKG)
      .filter(({ id: roomId, occupancyLimit }, _, allRooms) => {
        const biggestOccupancyLimitRoom = allRooms.reduce(
          (acc, curr) =>
            curr.id === roomId && curr.occupancyLimit > acc
              ? curr.occupancyLimit
              : acc,
          0
        )
        return biggestOccupancyLimitRoom === occupancyLimit
      })
      .map(({ quantity, ...rest }) => ({
        ...rest,
        quantity:
          quantity !== null ? quantity : AVAILBALE_ROOM_QUANTITY_FALLBACK,
      }))
  }
  if (inventories.includes(AGD) && inventories.length === 1) {
    const rooms = await Promise.all([
      getRoomsForVenueDetail({
        dateFromUtc,
        dateToUtc,
        hotelidPpn,
        currencyIsoCode,
        teamSize: null,
        roomIdsWithCounts,
        numberOfRooms: null,
        source,
      }),
    ])
    const roomData = [rawRoomData, ...rooms]
      .reduce((acc, curr) => [...acc, ...curr], [])
      .filter(({ inventory }) => inventory === AGD)
      .filter(({ id: roomId, occupancyLimit }, _, allRooms) => {
        const biggestOccupancyLimitRoom = allRooms.reduce(
          (acc, curr) =>
            curr.id === roomId && curr.occupancyLimit > acc
              ? curr.occupancyLimit
              : acc,
          0
        )
        return biggestOccupancyLimitRoom === occupancyLimit
      })
    return roomData
  }
  const rooms = await Promise.all([
    getRoomsForVenueDetail({
      dateFromUtc,
      dateToUtc,
      hotelidPpn,
      teamSize: null,
      currencyIsoCode,
      roomIdsWithCounts,
      numberOfRooms: null,
      source,
    }),
  ])
  return [rawRoomData, ...rooms]
    .reduce((acc, curr) => [...acc, ...curr], [])
    .filter(filterUnsupportedInventories)
    .filter(({ id: roomId, occupancyLimit }, _, allRooms) => {
      const biggestOccupancyLimitRoom = allRooms.reduce(
        (acc, curr) =>
          curr.id === roomId && curr.occupancyLimit > acc
            ? curr.occupancyLimit
            : acc,
        0
      )
      return biggestOccupancyLimitRoom === occupancyLimit
    })
}

module.exports = {
  Query: {
    venues: async (_, { input }, { request }) => {
      const {
        sorter,
        filter,
        pagination: { limit, page },
      } = input
      const {
        destination: destinationId,
        teamSize,
        type,
        dateFromUtc,
        dateToUtc,
      } = filter

      const currencyIsoCode = request.headers['currency-iso-code']

      const hotelTypes = type.length === 0 ? Object.values(HOTEL_TYPES) : type
      const isStaticRequest = !dateFromUtc || !dateToUtc
      const isTeamSizeAbove18 = teamSize > 18
      const isTeamSizeAbove36 = teamSize > 36

      let dynamicVenueData = []

      const venuesQuery = ActiveVenue.query()
        .where({ destinationId })
        // .andWhere({ isActive: true })
        // .andWhere((builder) => {
        //   builder.where('isQuality', '=', '1')
        //   builder.orWhere('isManualQuality', '=', '1')
        // })
        .withGraphFetched(
          '[airports, amenities, destination.[climate, cities]]'
        )

      const currencyRates = await ApiCommonCache.getCurrencies()

      const currencyRate = getCurrencyRateByIsoCode({
        currencyRates,
        currencyIsoCode,
      })

      if (isStaticRequest) {
        applyRoomCountFilterOnVenuesQuery({
          venuesQuery,
          teamSize,
          hotelTypes,
        })
        removeNullPricesAndRatingVenuesFromVenuesQuery({
          venuesQuery,
          hotelTypes,
        })
        applyPriceFilterOnVenuesQuery({ venuesQuery, filter, currencyRate })
        applySortingByPriceOnVenuesQuery({ venuesQuery, sorter })
        applyOptimalSortingOnVenuesQuery({ venuesQuery, sorter })
      } else if (
        isTeamSizeAbove36 ||
        (isTeamSizeAbove18 &&
          (hotelTypes.includes(HOTEL_TYPES.HOTEL) ||
            hotelTypes.includes(HOTEL_TYPES.OTHER)))
      ) {
        applyRoomCountFilterOnVenuesQuery({
          venuesQuery,
          teamSize,
          hotelTypes: [HOTEL_TYPES.HOTEL],
        })
        removeNullPricesAndRatingVenuesFromVenuesQuery({
          venuesQuery,
          hotelTypes,
        })
        applyPriceFilterOnVenuesQuery({ venuesQuery, filter, currencyRate })
        applySortingByPriceOnVenuesQuery({ venuesQuery, sorter })
        applyOptimalSortingOnVenuesQuery({ venuesQuery, sorter })
      } else {
        dynamicVenueData = await filterDynamicData({
          hotelTypes,
          filter,
          sorter,
          currencyIsoCode,
        })
        filterVenuesQueryByDynamicData({
          venuesQuery,
          sorter,
          dynamicVenueData,
        })
      }

      applyMeetingRoomFilterOnVenuesQuery({ venuesQuery, filter })
      applyHotelTypeFilterOnVenuesQuery({ venuesQuery, filter })
      applyPromotedOnlyFilterOnVenuesQuery({ venuesQuery, filter })
      applySortingByDistanceToAirportVenuesQuery({ venuesQuery, sorter })

      const [filteredTotalResultsCount, results] = await Promise.all([
        venuesQuery.resultSize(),
        venuesQuery.limit(limit).offset((page - 1) * limit),
      ])

      const transformVenuePrices = (venue) => {
        if(dynamicVenueData && dynamicVenueData.length > 0){
          const dynamicVenue = dynamicVenueData.find(
            ({ id }) => parseInt(id, 10) === venue.hotelidPpn
          )
  
          if (dynamicVenue) {
            const { price, totalPrice } = dynamicVenue
            return {
              ...venue,
              price: { amount: price, currencyIsoCode },
              totalPrice: { amount: totalPrice, currencyIsoCode },
            }
          }
        }

        const price = venue.lowRate || 0
        return {
          ...venue,
          price: { amount: price },
        }
      }
      
      const data = results.map(transformVenuePrices).map(transformVenue)

      return {
        data,
        input,
        filteredTotalResultsCount,
      }
    },
    venue: async (_, { input }, { request }) => {
      const currencyIsoCode = request.headers['currency-iso-code']
      const { id, dateFromUtc, dateToUtc } = input
      const venue = await Venue.query()
        .withGraphFetched(
          '[airports, amenities, destination.[climate, cities]]'
        )
        .findById(id)

      if (!venue) {
        throw new NotFoundError({
          message: 'Invalid venue id',
        })
      }

      let roomData = []
      let taxesData = []
      if (dateFromUtc && dateToUtc && venue.source === VENUE_SOURCES.PRICELINE) {
        try {
          const result = await getExpressResults({
            dateFromUtc,
            dateToUtc,
            teamSize: 1,
            numberOfRooms: 1,
            hotelIds: venue.hotelidPpn,
            currency: currencyIsoCode,
          })
          const { ppn_bundle } = result[0].room_data[0].rate_data[0]
          const {
            roomData: multiContractRoomData,
            taxesData: multiContractTaxesData,
          } = await getMultiContractByPpnBundle({
            ppnBundle: ppn_bundle,
            currency: currencyIsoCode,
          })
          roomData = multiContractRoomData
          taxesData = multiContractTaxesData
        } catch (error) {
          roomData = []
          taxesData = []
        }
      }

      return {
        ...transformVenue(venue),
        input,
        roomData,
        taxesData,
        hotelidPpn: venue.hotelidPpn,
      }
    },
  },
  Venues: {
    airportData: async ({
      input: {
        filter: { destination: destinationId },
      },
    }) => {
      const airportQuery = await Destination.relatedQuery('airports').for(
        destinationId
      )
      return airportQuery.map(({ lat, lon, ...airport }) => ({
        coordinates: { lat, lon },
        ...airport,
      }))
    },
    filterData: () => {
      const MOCK_PRICE_MIN = 0
      const MOCK_PRICE_MAX = 1000
      return {
        priceMin: {
          amount: MOCK_PRICE_MIN,
        },
        priceMax: {
          amount: MOCK_PRICE_MAX,
        },
      }
    },
    paginationInfo: ({
      filteredTotalResultsCount,
      input: {
        pagination: { page, limit },
      },
    }) =>
      getPaginationInfo({
        total: filteredTotalResultsCount,
        page,
        limit,
      }),
  },
  Venue: {
    roomData: async (
      {
        hotelidPpn,
        roomData,
        source,
        input: { dateFromUtc, dateToUtc, roomIdsWithCounts = [] },
      },
      _,
      { request }
    ) => {
      try {
        if(source === VENUE_SOURCES.NEXT_RETREAT) return [] //maybe one day we will add rooms data
        const currencyIsoCode = request.headers['currency-iso-code']
        const rawRoomData = roomData
          .map(({ rate_data }) =>
            rate_data.map((arg) => {
              const { count } =
                roomIdsWithCounts.find(({ id }) => id === arg.rate_plan_code) ||
                {}

              return transformRoomData({
                ...arg,
                currencyIsoCode,
                count,
              })
            })
          )
          .reduce((acc, curr) => [curr[0], ...acc], [])
        const rooms = await getRoomsFromRawRoomData({
          hotelidPpn,
          rawRoomData,
          dateFromUtc,
          dateToUtc,
          currencyIsoCode,
          roomIdsWithCounts,
          source,
        })

        const roomParameters = request.headers['room-parameters']

        if (roomParameters) {
          const roomCount = getNumberOfUniqueRooms(rooms)
          const roomRequestData = {
            ...JSON.parse(roomParameters),
            ip: requestIp.getClientIp(request),
            roomCount,
          }

          await RoomSearchData.query().insert(roomRequestData)
        }

        const DEFAULT_PRICES = {
          taxesAndFees: 0,
          resortFee: 0,
          total: 0,
        }
        const selectedRoomsPrices = roomIdsWithCounts
          .map(({ id: urlId, count }) => {
            const { taxesAndFees, resortFee, total } =
              rooms.find(({ id }) => id === urlId) || DEFAULT_PRICES
            return {
              taxesAndFees: taxesAndFees.amount * count,
              resortFee: resortFee.amount * count,
              total: total.amount * count,
            }
          })
          .reduce(
            (accumulator, current) => ({
              taxesAndFees: currency(accumulator.taxesAndFees).add(
                current.taxesAndFees
              ),
              resortFee: currency(accumulator.resortFee).add(current.resortFee),
              total: currency(accumulator.total).add(current.total),
            }),
            DEFAULT_PRICES
          )

        return {
          rooms: orderBy(rooms, 'pricePerNight.amount', 'asc'),
          totalPrice: {
            amount: selectedRoomsPrices.total.value,
            currencyIsoCode,
          },
          totalTaxesAndFees: {
            amount: selectedRoomsPrices.taxesAndFees.value,
            currencyIsoCode,
          },
          totalResortFees: {
            amount: selectedRoomsPrices.resortFee.value,
            currencyIsoCode,
          },
        }
      } catch (error) {
        return { rooms: [] }
      }
    },
    thumbnailUrls: async ({ id, hotelidPpn, thumbnailUrls, source }, { limit }) => {
      // first check if we have the photos in our database => 
      // if yes, return from there, if not get from priceline and save them to the database
      // if there are photos, but the last get is older than X days, refetch them. Try to check if there is a hero in our database, 
      // if yes, try to not modify the selection from new photos
      const photosFromDatabase = await VenuePhoto.query().where('venueId', '=', id).orderBy('is_hero')

      if(photosFromDatabase.length > 0) return photosFromDatabase.map(photo => photo.url).slice(0, limit)

      let photos = []
      if(source === VENUE_SOURCES.PRICELINE){
        photos = await getPhotosByHotelIds({
          hotelIds: hotelidPpn,
        })
      }
      
      if (!photos.length) {
        return thumbnailUrls
      }

      const insertPhotos = photos.map(photo => ({venueId : id, url : photo}))
      await VenuePhoto.query().insert(insertPhotos)

      return photos.slice(0, limit)
    },
  },
  Room: {
    icon: ({ title }) => {
      const lowercaseTitle = title.toLowerCase()
      const matchesTitleInList = (list) =>
        Boolean(list.find((item) => lowercaseTitle.includes(item)))

      switch (true) {
        case matchesTitleInList([
          '2 double',
          '2 queen',
          'two queen',
          'two king',
          'two doubles',
          '2 king',
          '2 queen-size',
          '2 king-size',
        ]):
          return 'TWO_DOUBLE'
        case matchesTitleInList([
          'twin',
          '2 single beds',
          'two single beds',
          '2 separate beds',
          'two separate beds',
        ]):
          return 'TWIN'
        case matchesTitleInList([
          'double',
          'queen',
          'king',
          'queen-size',
          'king-size',
        ]):
          return 'DOUBLE'
        case matchesTitleInList([
          'quadruple room',
          '4 people',
          '4-bed',
          'four bed',
          '4 bed',
        ]):
          return 'QUADRUPLE'
        case matchesTitleInList(['apartment', 'studio', 'duplex', 'bedroom']):
          return 'APARTMENT'
        case matchesTitleInList(['single', '1 person', 'one person']):
          return 'SINGLE'
        case matchesTitleInList(['double or twin', 'twin or double']):
          return 'DOUBLE_OR_TWIN'
        case matchesTitleInList(['triple', '3 people']):
          return 'TRIPLE'
        case matchesTitleInList(['bunk-bed']):
          return 'BUNK_BED'
        case matchesTitleInList(['family']):
          return 'FAMILY'
        default:
          return 'DEFAULT'
      }
    },
  },
}
