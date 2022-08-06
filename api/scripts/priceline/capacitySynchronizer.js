/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-globals */

require('dotenv').config()
const fetch = require('node-fetch')
const queryString = require('query-string')
const Knex = require('knex')
const { Model } = require('objection')
const logger = require('../../src/utils/logger')
const dbConfig = require('../../config/db')
const Venue = require('../../src/models/Venue')

// dbConfig.acquireConnectionTimeout = 600000
const knex = Knex(dbConfig)
Model.knex(knex)

const HOTEL_TYPES_TO_SYNC = [
  'Bed and Breakfast',
  'Bed and breakfasts',
  'Boats',
  'Campsites',
  'Chalets',
  'Country houses',
  'Farm stays',
  'Guest accommodation',
  'Guest houses',
  'Holiday homes',
  'Holiday parks',
  'Homestays',
  'Inns',
  'Lodges',
  'Luxury tents',
  'Residence',
  'Villas',
  'Other',
]
const MAX_ROOM_COUNT = 1

const CHUNK_SIZE = 50
const { COMMON_PRICELINE_API_PARAMS } = require('../../src/constants')

const BED_TYPES = {
  DOUBLE: 2,
  QUEEN: 2,
  KING: 2,
  SINGLE: 1,
  SOFABED: 2,
}

const chunkArray = (arrayToChunk, chunkSize) => {
  if (!chunkSize) return arrayToChunk
  const R = []
  for (let i = 0; i < arrayToChunk.length; i += chunkSize)
    R.push(arrayToChunk.slice(i, i + chunkSize))
  return R
}

const getRoomsData = async (venueIds) => {
  const params = queryString.stringify({
    hotel_ids: venueIds,
    bedding: true,
    ...COMMON_PRICELINE_API_PARAMS,
  })

  const response = await fetch(
    `${process.env.PRICELINE_API_BASE_URL}/shared/getBOF2.Downloads.Hotel.Rooms?${params}`
  )

  const {
    'getSharedBOF2.Downloads.Hotel.Rooms': {
      results: { rooms },
    },
  } = await response.json()

  return rooms
}

const getVenuesToSynchronize = async () => {
  try {
    return await Venue.query()
      .where('isActive', '=', '1')
      .whereIn('hotelType', HOTEL_TYPES_TO_SYNC)
      .where('roomCount', '<=', MAX_ROOM_COUNT)
      // .where('destinationId', '=', 'PODGORICA_CS')
      // .limit(50)
      .select(['id', 'hotelid_ppn', 'roomCount'])
  } catch (error) {
    logger.error('Error on getting venues from the database', error)
    process.exit(0)
  }
}

const arraySum = (array) =>
  array.reduce(function(total, num) {
    return total + num
  })

const calculateAreaCapacity = ({ bed_groups }) => {
  const bedGroupsCapacities = bed_groups.map((bed_group) => {
    const bedsCapacities = bed_group.beds.map((bed) => {
      const bedCapacity = BED_TYPES[bed.type] || 1
      return bedCapacity * bed.count
    })
    return arraySum(bedsCapacities)
  })
  return arraySum(bedGroupsCapacities)
}

const calculateRoomCapacity = ({ bedding: { areas } }) => {
  if (areas == null || areas.length === 0) return 0

  const areasCapacities = areas.map((area) => calculateAreaCapacity(area))

  return arraySum(areasCapacities)
}

const calculateCapacity = ({ roomCount, rooms }) => {
  const roomsCapacities = rooms.map((room) => calculateRoomCapacity(room))
  let capacity = 0
  // arraySum(roomsCapacities) +
  // (roomCount - rooms.length) * Math.floor(roomsCapacities / rooms.length)

  if (roomCount === rooms.length) {
    capacity = arraySum(roomsCapacities)
  }
  // this means that the venue has multiple rooms, but is uploaded as one room with multiple areas
  // this is similar to that when the venue has one room
  else if (rooms.length === 1 && rooms[0].bedding.areas.length === roomCount) {
    capacity = arraySum(roomsCapacities)
  } else {
    capacity =
      arraySum(roomsCapacities) +
      (roomCount - rooms.length) * Math.floor(roomsCapacities / rooms.length)
  }
  return capacity
}

const calcualteAndUpdateVenueRoomsCapacity = async (venue, rooms) => {
  if (rooms.length === 0) return

  const capacity = calculateCapacity({ roomCount: venue.roomCount, rooms })

  if (capacity === 0 || isNaN(capacity)) return

  await Venue.query()
    .patch({ capacity })
    .where('id', '=', venue.id)
}

const processChunk = async (chunk) => {
  try {
    const venueIds = chunk.map((venue) => venue.hotelidPpn).join(',')

    const rooms = await getRoomsData(venueIds)

    // for each venue => calculate the capacity
    const promises = chunk.map((venue) =>
      calcualteAndUpdateVenueRoomsCapacity(
        venue,
        rooms.filter((room) => room.hotelid_ppn == venue.hotelidPpn) // eslint-disable-line eqeqeq
      )
    )

    await Promise.all(promises)
  } catch (error) {
    logger.error('Failed chunk processing', error)
  }
}

const synchronizeCapacities = async () => {
  logger.info('Starting capacity data fetching')

  const venuesToSynchronize = await getVenuesToSynchronize()

  logger.info(
    `There are ${venuesToSynchronize.length} venues to be synchronized`
  )

  if (venuesToSynchronize.length === 0) process.exit(1)

  // combine the priceline venue-ids
  const chunksToProcess = chunkArray(venuesToSynchronize, CHUNK_SIZE)

  const groupChunks = chunkArray(chunksToProcess, 5)

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < groupChunks.length; i++) {
    const groupChunk = groupChunks[i]

    const chunkProcessPromises = groupChunk.map((chunk) => processChunk(chunk))

    await Promise.all(chunkProcessPromises)

    logger.info(`${i + 1}/${groupChunks.length} groups done.`)
  }

  process.exit(1)
}

const run = async () => {
  await synchronizeCapacities()
}
run()
