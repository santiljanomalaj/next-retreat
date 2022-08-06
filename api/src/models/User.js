const { mixin, Model } = require('objection')
const BaseModel = require('./BaseModel')
const UserTrip = require('./UserTrip')

class User extends mixin(BaseModel) {
  static get tableName() {
    return 'users'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email'],
      properties: {
        id: { type: 'integer' },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        accessToken: { type: 'string' },
        createdAt: { type: 'datetime' },
        updatedAt: { type: 'datetime' },
        isApproved: { type: 'boolean' },
        queryParam: { type: 'string' },
        mlSent: { type: 'boolean' },
        firstLogin: { type: 'datetime' },
      },
    }
  }

  static get relationMappings() {
    return {
      trips: {
        relation: Model.HasManyRelation,
        modelClass: UserTrip,
        join: {
          from: 'users.id',
          to: 'userTrips.userId',
        },
      },
      sharedTrips: {
        relation: Model.ManyToManyRelation,
        modelClass: UserTrip,
        join: {
          from: 'users.id',
          through: {
            from: 'userSharedTrips.userId',
            to: 'userSharedTrips.tripId',
          },
          to: 'userTrips.id',
        },
      },
    }
  }

  $formatDatabaseJson(json) {
    const superJson = super.$formatDatabaseJson(json)
    return {
      ...superJson,
      ...(typeof superJson.email === 'string'
        ? { email: superJson.email.trim().toLowerCase() }
        : {}),
    }
  }
}

module.exports = User
