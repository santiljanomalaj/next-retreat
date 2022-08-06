/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-globals */

require('dotenv').config()
const fetch = require('node-fetch')
const queryString = require('query-string')
const { getDistance } = require('geolib')
const Knex = require('knex')
const { Model } = require('objection')
const differenceInWeeks = require('date-fns/differenceInWeeks')
const CurrencyRate = require('../src/models/CurrencyRate')
const Currency = require('../src/models/Currency')
const Destination = require('../src/models/Destination')
const DestinationVenueSync = require('../src/models/DestinationVenueSync')
const Venue = require('../src/models/Venue')
const { metersToKilometers } = require('../src/utils/helpers')
const currency = require('../src/utils/currency')
const logger = require('../src/utils/logger')
const dbConfig = require('../config/db')
const hotelTypeMap = require('../scripts/data/hotelTypeMap')
const {
  COMMON_PRICELINE_API_PARAMS,
  BASE_CURRENCY_ISO_CODE,
} = require('./../src/constants')
const {
  syncAmenities,
  updateAmenitiesForVenue,
  getAmenities,
} = require('./priceline/syncAmenities')
const {
  generatePostgresUpsertQuery,
  replaceStringsForSql,
} = require('../src/utils/pg')
const { VENUE_TYPE_ID_MAPPING } = require('./priceline/venues_constants')

const knex = Knex(dbConfig)
Model.knex(knex)

const PRICELINE_API_BOOL_TRUE_RESPONSE = '1'
const PRICELINE_AMENITY_SPLIT_CHARACTER = '^'
const MYSQL_NULL_VALUE = 'NULL'
const HOTEL_TYPE_DEFAULT_VALUE = 'Other'
const STATIC_DATA_FETCHING_TIMER = 'STATIC_DATA_FETCHING_TIMER'
const VENUE_SOURCE_PRICELINE = 'PPN'
const VENUES_CHUNK_SIZE = Number(process.env.VENUES_CHUNK_SIZE || '1')

const MEETING_ROOM_PRICELINE_AMENITY_IDS = [
  '21',
  '273',
  '663',
  '664',
  '665',
  '666',
  '1290',
  '1470',
  '1630',
  '1631',
  '1752',
  '1809',
  '',
]

const VENUES_TABLE_COLUMNS = {
  DESTINATION_ID: 'destination_id',
  CITYID_PPN: 'cityid_ppn',
  CITY: 'city',
  HOTELID_PPN: 'hotelid_ppn',
  HOTELID_A: 'hotelid_a',
  HOTELID_T: 'hotelid_t',
  HOTELID_B: 'hotelid_b',
  HOTEL_TYPE: 'hotel_type',
  HOTEL_NAME: 'hotel_name',
  HOTEL_ADDRESS: 'hotel_address',
  STATE: 'state',
  COUNTRY: 'country',
  COUNTRY_CODE: 'country_code',
  STATE_CODE: 'state_code',
  LAT: 'lat',
  LON: 'lon',
  AREA_ID: 'area_id',
  POSTAL_CODE: 'postal_code',
  STAR_RATING: 'star_rating',
  LOW_RATE: 'low_rate',
  CURRENCY_CODE: 'currency_code',
  REVIEW_RATING: 'review_rating',
  REVIEW_COUNT: 'review_count',
  RANK_SCORE_PPN: 'rank_score_ppn',
  CHAIN_ID_PPN: 'chain_id_ppn',
  THUMBNAIL: 'thumbnail',
  HAS_PHOTOS: 'has_photos',
  ROOM_COUNT: 'room_count',
  CHECK_IN: 'check_in',
  CHECK_OUT: 'check_out',
  PROPERTY_DESCRIPTION: 'property_description',
  CREATION_DATE_TIME: 'creation_date_time',
  MOD_DATE_TIME: 'mod_date_time',
  AGD_FLAG: 'agd_flag',
  MER_FLAG: 'mer_flag',
  SMOP_FLAG: 'smop_flag',
  UPDATED_AT: 'updated_at',
  BKG_FLAG: 'bkg_flag',
  IS_ACTIVE: 'is_active',
  SOURCE: 'source',
  IS_QUALITY: 'is_quality',
  VENUE_TYPE_N: 'venue_type_n',
  IS_ENTIRE_HOUSE: 'is_entire_house',
}

const isHotel = (venueType) =>
  // eslint-disable-next-line arrow-body-style
  {
    return [
      'Aparthotels',
      'Hostel',
      'Hostels',
      'Hotel',
      'Hotels',
      'Motel',
      'Resort',
      'Resorts',
    ].includes(venueType)
  }

const isQualityVenue = (
  venueType,
  {
    active,
    room_count,
    // low_rate,
    hotel_address,
    has_photos,
    property_description,
    check_in,
    check_out,
    rank_score_ppn,
    review_rating,
    star_rating,
    amenity_codes,
  }
) =>
  // eslint-disable-next-line arrow-body-style
  {
    return (
      active === PRICELINE_API_BOOL_TRUE_RESPONSE &&
      Number(room_count) > 0 &&
      // low_rate !== null &&
      hotel_address !== null &&
      has_photos === PRICELINE_API_BOOL_TRUE_RESPONSE &&
      property_description !== null &&
      check_in !== null &&
      check_out !== null &&
      Number(rank_score_ppn) >= 9 &&
      Number(review_rating) >= 7.5 &&
      (isHotel(venueType)
        ? Number(star_rating) >= 3
        : Number(star_rating) !== 1) &&
      amenity_codes !== null &&
      amenity_codes.split(PRICELINE_AMENITY_SPLIT_CHARACTER).length >=
        (isHotel(venueType) ? 30 : 6)
    )
  }

const createThumbnailUrl = (id) => {
  if (!id) return null
  const idStr = id.toString()
  return `https://mobileimg.pclncdn.com/htlimg/master/${idStr.slice(
    0,
    idStr.length - 5
  )}/${idStr[idStr.length - 5]}/${idStr[idStr.length - 4]}/${id}/master_${id}`
}

const doInsertVenue = (
  venueType,
  {
    active,
    room_count,
    hotel_address,
    has_photos,
    property_description,
    check_in,
    check_out,
    star_rating,
    amenity_codes,
  }
) =>
  // eslint-disable-next-line arrow-body-style
  {
    return (
      active === PRICELINE_API_BOOL_TRUE_RESPONSE &&
      Number(room_count) > 0 &&
      hotel_address !== null &&
      has_photos === PRICELINE_API_BOOL_TRUE_RESPONSE &&
      property_description !== null &&
      check_in !== null &&
      check_out !== null &&
      (isHotel(venueType)
        ? Number(star_rating) >= 3
        : Number(star_rating) !== 1) &&
      amenity_codes !== null
    )
  }

const parsePricelineHotelValues = ({
  destinationId,
  cityid_ppn,
  city,
  hotelid_ppn,
  hotelid_a,
  hotelid_t,
  hotelid_b,
  hotel_type,
  hotel_name,
  hotel_address,
  state,
  country,
  country_code,
  state_code,
  latitude,
  longitude,
  area_id,
  postal_code,
  star_rating,
  lowRate,
  currencyCode,
  review_rating,
  review_count,
  rank_score_ppn,
  chain_id_ppn,
  thumbnail,
  has_photos,
  room_count,
  check_in,
  check_out,
  property_description,
  creation_date_time,
  mod_date_time,
  agd_flag,
  mer_flag,
  smop_flag,
  updatedAt,
  bkg_flag,
  active,
  is_quality,
}) => [
  `'${destinationId}'`,
  parseInt(cityid_ppn, 10),
  `'${replaceStringsForSql(city)}'`,
  parseInt(hotelid_ppn, 10),
  hotelid_a || MYSQL_NULL_VALUE,
  hotelid_t || MYSQL_NULL_VALUE,
  hotelid_b || MYSQL_NULL_VALUE,
  `'${replaceStringsForSql(hotel_type)}'`,
  hotel_name ? `'${replaceStringsForSql(hotel_name)}'` : MYSQL_NULL_VALUE,
  hotel_address ? `'${replaceStringsForSql(hotel_address)}'` : MYSQL_NULL_VALUE,
  state ? `'${state}'` : MYSQL_NULL_VALUE,
  country ? `'${country}'` : MYSQL_NULL_VALUE,
  country_code ? `'${country_code}'` : MYSQL_NULL_VALUE,
  state_code ? `'${state_code}'` : MYSQL_NULL_VALUE,
  parseFloat(latitude),
  parseFloat(longitude),
  area_id ? `'${area_id}'` : MYSQL_NULL_VALUE,
  postal_code ? `'${postal_code}'` : MYSQL_NULL_VALUE,
  parseInt(star_rating, 10),
  lowRate ? parseInt(lowRate, 10) : MYSQL_NULL_VALUE,
  currencyCode ? `'${currencyCode}'` : MYSQL_NULL_VALUE,
  review_rating ? parseFloat(review_rating) : MYSQL_NULL_VALUE,
  review_count ? parseInt(review_count, 10) : MYSQL_NULL_VALUE,
  parseInt(rank_score_ppn, 10),
  chain_id_ppn,
  thumbnail ? `'${createThumbnailUrl(hotelid_t)}'` : MYSQL_NULL_VALUE,
  has_photos === PRICELINE_API_BOOL_TRUE_RESPONSE,
  parseInt(room_count, 10),
  check_in ? `'${check_in}'` : MYSQL_NULL_VALUE,
  check_out ? `'${check_out}'` : MYSQL_NULL_VALUE,
  property_description
    ? `'${replaceStringsForSql(property_description)}'`
    : MYSQL_NULL_VALUE,
  creation_date_time ? `'${creation_date_time}'` : MYSQL_NULL_VALUE,
  mod_date_time ? `'${mod_date_time}'` : MYSQL_NULL_VALUE,
  agd_flag === PRICELINE_API_BOOL_TRUE_RESPONSE,
  mer_flag === PRICELINE_API_BOOL_TRUE_RESPONSE,
  smop_flag === PRICELINE_API_BOOL_TRUE_RESPONSE,
  updatedAt,
  bkg_flag === PRICELINE_API_BOOL_TRUE_RESPONSE,
  active === PRICELINE_API_BOOL_TRUE_RESPONSE,
  `'${replaceStringsForSql(VENUE_SOURCE_PRICELINE)}'`,
  is_quality,
  VENUE_TYPE_ID_MAPPING[hotel_type],
  parseInt(room_count, 10) === 1,
]

// this function must be fixed, to not update distances every time the venue is updated
const updateAirportDistances = async ({ venue }) => {
  for (const { lat, lon, id: airportsId } of venue.destination.airports) {
    try {
      const relatedAirportRecord = await Venue.relatedQuery('airports')
        .for(venue.id)
        .where({ airportsId })
      if (!relatedAirportRecord.length) {
        const distance = await getDistance(
          {
            latitude: lat,
            longitude: lon,
          },
          {
            latitude: venue.lat,
            longitude: venue.lon,
          }
        )
        await venue.$relatedQuery('airports').relate({
          id: airportsId,
          distanceInKilometers: metersToKilometers(distance),
        })
      }
    } catch (error) {
      logger.error('Error on relating an airport to venue', error)
      throw error
    }
  }
}

const updateHasMeetingRoom = async ({ venue, amenityIds }) => {
  if (
    amenityIds.some((amenityId) =>
      MEETING_ROOM_PRICELINE_AMENITY_IDS.includes(amenityId)
    )
  ) {
    await Venue.query()
      .patch({ isMeetingRoomIncluded: true })
      .findById(venue.id)
  }
}

const tryGetHotelType = ({ hotel }) => {
  let hotelType = hotel[VENUES_TABLE_COLUMNS.HOTEL_TYPE]
  if (!hotelType) {
    const matchedHotelType = hotelTypeMap.find(([word]) =>
      new RegExp(`\\b${word}\\b`, 'gi').test(
        hotel[VENUES_TABLE_COLUMNS.HOTEL_NAME]
      )
    )
    hotelType = matchedHotelType
      ? matchedHotelType[1]
      : HOTEL_TYPE_DEFAULT_VALUE
  }
  return hotelType
}

const getLowRate = ({ currencyRates, hotel }) => {
  const currencyRate = currencyRates.find(
    ({ currencyIsoCode }) =>
      currencyIsoCode === hotel[VENUES_TABLE_COLUMNS.CURRENCY_CODE]
  )
  return currency.convertToEuro({
    value: hotel[VENUES_TABLE_COLUMNS.LOW_RATE],
    currencyRate: currencyRate ? currencyRate.value : 1,
  })
}

const getSupportedCurrencies = async () => {
  const supportedCurrencyIsoCodesQuery = await Currency.query().select(
    'isoCode'
  )
  return supportedCurrencyIsoCodesQuery.map((curr) => curr.isoCode)
}

const syncHotel = async ({
  hotel,
  currencyRates,
  supportedCurrencyIsoCodes,
  amenities,
  destinationId,
}) => {
  try {
    if (
      hotel.active === PRICELINE_API_BOOL_TRUE_RESPONSE &&
      supportedCurrencyIsoCodes.includes(
        hotel[VENUES_TABLE_COLUMNS.CURRENCY_CODE]
      )
    ) {
      try {
        const lowRate = getLowRate({ currencyRates, hotel })

        const hotelType = tryGetHotelType({ hotel })
        let hotelIsQuality = false

        try {
          // check if venue is worth inserting
          if (!doInsertVenue(hotelType, hotel)) {
            return null
          }

          hotelIsQuality = isQualityVenue(hotelType, hotel)
        } catch (error) {
          logger.error('Error on filtering venue', error)
        }

        const venueHasBeenUpdatedRecently =
          hotel.last_changed_date &&
          differenceInWeeks(new Date(), new Date(hotel.last_changed_date)) === 0

        if (venueHasBeenUpdatedRecently) {
          await Venue.knex().raw(
            generatePostgresUpsertQuery({
              table: 'venues',
              columns: Object.values(VENUES_TABLE_COLUMNS),
              values: parsePricelineHotelValues({
                ...hotel,
                destinationId,
                lowRate,
                currencyCode: BASE_CURRENCY_ISO_CODE,
                updatedAt: knex.fn.now(),
                hotel_type: hotelType,
                is_quality: hotelIsQuality,
              }),
              conflictUniqueKey: VENUES_TABLE_COLUMNS.HOTELID_PPN,
              valueNamesToUpdate: Object.values(VENUES_TABLE_COLUMNS).filter(
                (column) => column !== VENUES_TABLE_COLUMNS.HOTELID_PPN
              ),
            })
          )
        } else {
          await Venue.query()
            .where({ hotelidPpn: hotel.hotelid_ppn })
            .patch({ updatedAt: knex.fn.now() })
        }
        if (venueHasBeenUpdatedRecently) {
          const venue = await Venue.query()
            .findOne({
              hotelidPpn: hotel.hotelid_ppn,
            })
            .withGraphJoined('[destination.airports, amenities]')
            .select('venues.id', 'venues.lat', 'venues.lon')

          if (venue) {
            await updateAirportDistances({ venue })

            const { amenity_codes } = hotel
            const amenityIds = amenity_codes
              ? amenity_codes.split(PRICELINE_AMENITY_SPLIT_CHARACTER)
              : []

            await updateAmenitiesForVenue({ venue, amenityIds, amenities })

            await updateHasMeetingRoom({ venue, amenityIds })
          }
        }

        return venueHasBeenUpdatedRecently
      } catch (error) {
        logger.error('Error on upserting venue', error)
        throw error
      }
    }
  } catch (error) {
    logger.error(
      `There was an error on syncing venue with ppn_id: ${hotel.hotelid_ppn} into database`,
      error
    )
  }
}

const chunkArray = (arrayToChunk, chunkSize) => {
  if (!chunkSize) return arrayToChunk
  const R = []
  for (let i = 0; i < arrayToChunk.length; i += chunkSize)
    R.push(arrayToChunk.slice(i, i + chunkSize))
  return R
}

const fetchStaticData = async () => {
  logger.info('Starting static data fetching')
  logger.info('Delay in progress')
  await new Promise((r) =>
    setTimeout(
      r,
      1000 * 60 * 10 * (process.env.NODE_ENV === 'development' ? 0 : 1)
    )
  ) // Sleep 10 minutes
  logger.info('Delay ended')

  const lastSyncedDestination = await DestinationVenueSync.query()
    .orderBy('syncStartAt', 'desc')
    .limit(1)
    .first()

  const hasLastSyncEnded =
    lastSyncedDestination && lastSyncedDestination.syncEndAt

  const destinations = await Destination.query()
    .withGraphFetched({
      cities: true,
    })
    .orderBy('createdAt')

  const lastDestinationIndex = lastSyncedDestination
    ? destinations.findIndex(
        ({ id }) => id === lastSyncedDestination.destinationId
      )
    : destinations.length - 1

  const { cities, id: destinationId } = destinations[
    (lastDestinationIndex + (hasLastSyncEnded ? 1 : 0)) % destinations.length
  ]

  const lastSyncOfDestination = await DestinationVenueSync.query()
    .where({ destinationId })
    .orderBy('id', 'desc')
    .limit(1)
    .first()

  if (
    process.env.NODE_ENV !== 'development' &&
    lastSyncOfDestination &&
    differenceInWeeks(new Date(), lastSyncOfDestination.syncEndAt) === 0
  ) {
    // Do not spawn new sync if the last sync isn’t a week old
    logger.info(`Previous sync of ${destinationId} is still fresh`)
    return fetchStaticData()
  }

  const { id: currentSyncId } = await DestinationVenueSync.query()
    .returning('id')
    .insert({ destinationId })

  try {
    let doMatViewRefresh = false

    console.time(STATIC_DATA_FETCHING_TIMER)
    const currencyRatesRaw = await CurrencyRate.knex().raw(`
      SELECT cr.value, cr.currency_iso_code FROM (
        select currency_iso_code, max(id) as id from currency_rates
        group by currency_iso_code
        ) as c
        inner join currency_rates as cr on cr.id = c.id
      `)
    const currencyRates = currencyRatesRaw.rows.map((row) => ({
      value: row.value,
      currencyIsoCode: row.currency_iso_code,
    }))

    const supportedCurrencyIsoCodes = await getSupportedCurrencies()

    await syncAmenities()

    const amenities = await getAmenities()

    for (const { ppnCityId } of cities) {
      const params = queryString.stringify({
        cityid_ppn: ppnCityId,
        ...COMMON_PRICELINE_API_PARAMS,
      })
      const response = await fetch(
        `${process.env.PRICELINE_API_BASE_URL}/shared/getBOF2.Downloads.Hotel.Hotels?${params}`
      )
      const {
        'getSharedBOF2.Downloads.Hotel.Hotels': {
          results: { hotels },
        },
      } = await response.json()

      const chunks = chunkArray(hotels, VENUES_CHUNK_SIZE)
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < chunks.length; i++) {
        const results = await Promise.all(
          chunks[i].map((hotel) =>
            syncHotel({
              hotel,
              currencyRates,
              supportedCurrencyIsoCodes,
              amenities,
              destinationId,
            })
          )
        )

        if (results.some((r) => r)) doMatViewRefresh = true

        logger.info(
          `Done ${i + 1}/${
            chunks.length
          } hotel chunks of length ${VENUES_CHUNK_SIZE}`
        )
      }
    }

    await Venue.query()
      .patch({ isActive: false })
      .where({ destinationId })
      .andWhere('source', '=', VENUE_SOURCE_PRICELINE)
      .andWhere('updatedAt', '<', knex.raw(`NOW() - INTERVAL '1 week'`))

    if (doMatViewRefresh) {
      logger.time('matViewRefresh')
      await knex.raw('REFRESH MATERIALIZED VIEW CONCURRENTLY active_venues')
      logger.timeEnd('matViewRefresh')
    }

    await DestinationVenueSync.query()
      .patch({ syncEndAt: knex.fn.now() })
      .where('id', currentSyncId)
  } catch (error) {
    logger.error(
      'There was an error on syncing destination into database',
      error
    )
    logger.info(`Deleting current ${destinationId} sync`)

    await DestinationVenueSync.query()
      .where('id', currentSyncId)
      .del()
  }

  logger.info('Static data fetching finished')
  console.timeEnd(STATIC_DATA_FETCHING_TIMER)
  return fetchStaticData()
}

const run = async () => {
  await fetchStaticData()
}
run()
