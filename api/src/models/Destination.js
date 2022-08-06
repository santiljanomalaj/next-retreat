const { mixin, Model } = require('objection')
const BaseModel = require('./BaseModel')
const Airport = require('./Airport')
const Country = require('./Country')
const DestinationType = require('./DestinationType')
const DestinationClimate = require('./DestinationClimate')
const DestinationCity = require('./DestinationCity')
const DestinationVenueSync = require('./DestinationVenueSync')
const Venue = require('./Venue')
const { CONTINENTS } = require('../constants')

class Destination extends mixin(BaseModel) {
  static get tableName() {
    return 'destinations'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'title',
        'pictureUrl',
        'description',
        'lat',
        'lon',
        'continent',
        'countryCode',
      ],
      properties: {
        id: { type: 'string' },
        kiwiCityId: { type: 'string', minLength: 1 },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        pictureUrl: { type: 'string', minLength: 1 },
        description: { type: 'string', minLength: 1 },
        lat: { type: 'number' },
        lon: { type: 'number' },
        country: { type: 'string', minLength: 1, maxLength: 255 },
        continent: { type: 'string', enum: CONTINENTS },
        createdAt: { type: 'datetime' },
        countryCode: { type: 'string', minLength: 2, maxLength: 2 },
      },
    }
  }

  static get relationMappings() {
    return {
      airports: {
        relation: Model.ManyToManyRelation,
        modelClass: Airport,
        join: {
          from: 'destinations.id',
          through: {
            from: 'airportsDestinations.destinationsId',
            to: 'airportsDestinations.airportsId',
          },
          to: 'airports.id',
        },
      },
      types: {
        relation: Model.ManyToManyRelation,
        modelClass: DestinationType,
        join: {
          from: 'destinations.id',
          through: {
            from: 'destinationsDestinationTypes.destinationsId',
            to: 'destinationsDestinationTypes.destinationTypesId',
          },
          to: 'destinationTypes.id',
        },
      },
      climate: {
        relation: Model.HasManyRelation,
        modelClass: DestinationClimate,
        join: {
          from: 'destinations.id',
          to: 'destinationClimate.destinationId',
        },
      },
      cities: {
        relation: Model.HasManyRelation,
        modelClass: DestinationCity,
        join: {
          from: 'destinations.id',
          to: 'destinationCities.destinationId',
        },
      },
      venues: {
        relation: Model.ManyToManyRelation,
        modelClass: Venue,
        join: {
          from: 'destinations.id',
          through: {
            from: 'destinationCities.destinationId',
            to: 'destinationCities.ppnCityId',
          },
          to: 'venues.cityidPpn',
        },
      },
      venueSyncs: {
        relation: Model.HasManyRelation,
        modelClass: DestinationVenueSync,
        join: {
          from: 'destinations.id',
          to: 'destinationVenueSyncs.destinationId',
        },
      },
      countries: {
        relation: Model.BelongsToOneRelation,
        modelClass: Country,
        join: {
          from: 'destinations.countryCode',
          to: 'countries.code',
        },
      },
    }
  }
}

module.exports = Destination
