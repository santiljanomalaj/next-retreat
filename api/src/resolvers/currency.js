const Currency = require('../models/Currency')

module.exports = {
  Query: {
    currencies: () => Currency.query().select('isoCode', 'title', 'symbol'),
  },
}
