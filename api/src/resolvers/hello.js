const logger = require('../utils/logger')

module.exports = {
  Query: {
    hello: (_, { name }) => {
      try {
        return `Hello ${name || 'World'}`
      } catch (error) {
        logger.error('hello resolver', error)
        throw error
      }
    },
    priceTest: () => ({
      amount: 100,
      currencyIsoCode: 'GBP',
    }),
  },
}
