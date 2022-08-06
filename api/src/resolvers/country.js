const Country = require('../models/Country')

module.exports = {
  Query: {
    countries: () => Country.query().orderBy('name', 'asc'),
    country: (_, { code }) => Country.query().findOne({ code }),
  },
}
