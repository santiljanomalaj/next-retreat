const Venue = require('../models/Venue')

const tripVenues = async (venueIds) => {
  const venues = await Venue.query()
    .withGraphFetched('[airports, amenities, destination.[climate, cities]]')
    .whereIn('id', venueIds)
  return venueIds.map((venueId) => venues.find((venue) => venue.id === venueId))
}

module.exports = { tripVenues }
