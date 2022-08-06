
require('dotenv').config()
const fetch = require('node-fetch')
const Amenity = require('../../src/models/Amenity')
const queryString = require('query-string')
const Knex = require('knex')
const { Model } = require('objection')
const Venue = require('../../src/models/Venue')
const { NON_RELEVANT_IDS, DUPLICATES } = require('./amenities_constants')
const {
    COMMON_PRICELINE_API_PARAMS,
} = require('./../../src/constants')
const FETCH_AMENITIES_TIMER = 'FETCH_AMENITIES_TIMER'
const INSERT_AMENITIES_TIMER = 'INSERT_AMENITIES_TIMER'
const dbConfig = require('../../config/db')
const logger = require('../../src/utils/logger')
const { generatePostgresUpsertQuery, replaceStringsForSql } = require('../../src/utils/pg')
const knex = Knex(dbConfig)
Model.knex(knex)


const syncAmenities = async () => {
    try {
        console.time(FETCH_AMENITIES_TIMER)
        const params = queryString.stringify(COMMON_PRICELINE_API_PARAMS)
        const response = await fetch(
            `${process.env.PRICELINE_API_BASE_URL}/shared/getBOF2.Downloads.Hotel.Amenities?${params}`
        )

        const {
            'getSharedBOF2.Downloads.Hotel.Amenities': {
                results: { amenities },
            },
        } = await response.json()
        console.timeEnd(FETCH_AMENITIES_TIMER)
        console.time(INSERT_AMENITIES_TIMER)
        for (let i = 0; i < amenities.length; i++) {
            const { amenity_name: name, amenity_code_ppn: ppn_id } = amenities[i];
            
            if (NON_RELEVANT_IDS.includes(ppn_id)) continue

            const isDuplicate = DUPLICATES.some(dupls => dupls.duplicates.some(id => id == ppn_id))

            if (isDuplicate) return

            try {
                const amenity = await Amenity.query().findOne({ppnId: ppn_id})
                if(amenity && amenity.name !== replaceStringsForSql(name)) {
                    await Amenity.query().findOne({ppnId: ppn_id}).patch({name: replaceStringsForSql(name)})
                }
                else if (!amenity){
                    await Amenity.query().insert({ppnId: ppn_id, name: replaceStringsForSql(name)})
                }
            } catch (error) {
                logger.error(
                    'There was an error on inserting amenity into database',
                    error
                )
                throw error
            }
        }
        console.timeEnd(INSERT_AMENITIES_TIMER)
    } catch (error) {
        logger.error('There was an error on fetching the amenities', error)
        throw error
    }
}

const updateAmenitiesForVenue = async ({ venue, amenityIds, amenities }) => {
    try {
        const venueAmenities = venue.amenities
        let amenitiesToDBO = [...new Set(amenityIds.map(amenityId => {
            const mainIds = DUPLICATES.filter(dupls => dupls.duplicates.some(id => id == amenityId)).map(dupls => dupls.main)

            if (mainIds.length == 0) return amenityId

            return mainIds
        }).flat())]

        amenitiesToDBO = amenitiesToDBO.filter(amenity => !NON_RELEVANT_IDS.includes(amenity))

        amenitiesToDBO = amenitiesToDBO.map(amenity => amenities.find(amenityDBO => amenityDBO.ppnId == amenity).id)

        const venueAmenityIds = venueAmenities.map(amenity => amenity.id)
        const amenitiesToDelete = venueAmenityIds.filter(amenityId => !amenitiesToDBO.includes(amenityId))
        const amenitiesToInsert = amenitiesToDBO.filter(amenityId => !venueAmenityIds.includes(amenityId))

        await Venue.transaction(async (trx) => {
            await Promise.all([
                ...amenitiesToDelete.map(amenityId => knex.raw(`
                    DELETE FROM amenities_venue WHERE amenity_id = ${amenityId} AND venue_id = ${venue.id}
                `).transacting(trx)),
                ...amenitiesToInsert.map(amenityId => knex.raw(`
                    INSERT INTO amenities_venue (amenity_id, venue_id) VALUES ('${amenityId}','${venue.id}')
                `).transacting(trx))
            ])
        })
    } catch (error) {
        logger.error('Error on graph upserting amenities', error)
        throw error
    }
}

const getAmenities = async () => {
    return await Amenity.query()
}

module.exports = {
    syncAmenities,
    updateAmenitiesForVenue,
    getAmenities
}

// ; (async () => await getAmenities())();