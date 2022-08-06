const { mixin, Model } = require('objection')
const BaseModel = require('./BaseModel')
const OriginLocation = require('./OriginLocation')
const BookingRoom = require('./BookingRoom')
const BookingService = require('./BookingService')
const Venue = require('./Venue')

class Booking extends mixin(BaseModel) {
  static get tableName() {
    return 'bookings'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'userId',
        'hotelidPpn',
        'hotelName',
        'currencyIsoCode',
        'checkInDate',
        'checkOutDate',
        'email',
        'phoneNumber',
        'name',
        'companyName',
        'maxTeamSize',
        'url',
      ],
      properties: {
        userId: { type: 'integer' },
        hotelidPpn: { type: 'number' },
        hotelName: { type: 'string' },
        venueId: { type: 'string' },
        currencyIsoCode: { type: 'string' },
        checkInDate: { type: 'string', minLength: 1, maxLength: 225 },
        checkOutDate: { type: 'string', minLength: 1, maxLength: 225 },
        email: { type: 'string', minLength: 1, maxLength: 225 },
        phoneNumber: { type: 'string', minLength: 1, maxLength: 225 },
        name: { type: 'string', minLength: 1, maxLength: 225 },
        companyName: { type: 'string', minLength: 1, maxLength: 225 },
        maxTeamSize: { type: 'number' },
        url: { type: 'string' },
        notes: { type: 'string' },
        country: { type: 'string', minLength: 1 },
        vatNumber: { type: 'string' },
        companyAddress: { type: 'string' },
        createdAt: { type: 'datetime' },
        updatedAt: { type: 'datetime' },
      },
    }
  }

  static get relationMappings() {
    return {
      venue: {
        relation: Model.BelongsToOneRelation,
        modelClass: Venue,
        join: {
          from: 'bookings.venueId',
          to: 'venues.id',
        },
      },
      originLocations: {
        relation: Model.ManyToManyRelation,
        modelClass: OriginLocation,
        join: {
          from: 'bookings.id',
          through: {
            from: 'bookingOriginLocations.bookingId',
            to: 'bookingOriginLocations.originLocationsId',
          },
          to: 'originLocations.id',
        },
      },
      rooms: {
        relation: Model.HasManyRelation,
        modelClass: BookingRoom,
        join: {
          from: 'bookings.id',
          to: 'bookingRooms.bookingId',
        },
      },
      services: {
        relation: Model.HasManyRelation,
        modelClass: BookingService,
        join: {
          from: 'bookings.id',
          to: 'bookingServices.bookingId',
        },
      },
    }
  }
}

module.exports = Booking
