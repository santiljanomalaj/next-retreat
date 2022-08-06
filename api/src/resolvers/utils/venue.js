const { convertCelsiusToFahrenheit } = require('../../utils/helpers')

const transformVenue = ({
  propertyDescription: description,
  thumbnail,
  hotelType: type,
  reviewRating: rating,
  starRating,
  hotelName: title,
  hotelAddress: address,
  destination,
  airports: nearestAirports,
  roomCount: numberOfRooms,
  isMeetingRoomIncluded,
  price,
  totalPrice,
  lat,
  lon,
  amenities,
  checkIn,
  checkOut,
  ...venue
}) => ({
  description: description || '',
  thumbnailUrl: thumbnail,
  thumbnailUrls: [],
  type: type || '',
  rating: rating || 0,
  starRating: starRating || 0,
  title,
  destination: destination.title,
  nearestAirport: nearestAirports.reduce(
    (prev, curr) =>
      prev.distanceInKilometers < curr.distanceInKilometers ? prev : curr,
    {}
  ),
  nearestAirports,
  airportData: destination.airportData,
  airportsCoordinates: nearestAirports,
  address: address || '',
  numberOfRooms,
  isMeetingRoomIncluded,
  roomData: [],
  price,
  priceTotal: totalPrice,
  coordinates: { lat, lon },
  amenities: amenities.map(({ name }) => name),
  avgTemperaturesByMonth: destination.climate.map(
    ({ month, valueCelsius: celsius }) => ({
      month,
      celsius,
      fahrenheit: convertCelsiusToFahrenheit(celsius),
    })
  ),
  houseRules: {
    checkIn: checkIn || '',
    checkOut: checkOut || '',
    cancellationDescription:
      'cancellation policy depends on the selected room and date. Please see the room selection for more details', // STATIC
    roomTypeAssignmentDescription: 'guest is required to choose a room type', // STATIC
  },
  capacity: venue.capacity || 0,
  ...venue,
})

module.exports = {
  transformVenue,
}
