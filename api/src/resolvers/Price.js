const { BASE_CURRENCY_ISO_CODE } = require('../constants')
const currency = require('../utils/currency')

module.exports = {
  Price: {
    currencyIsoCode: async ({ currencyIsoCode }, _, { request }) =>
      currencyIsoCode ||
      request.headers['currency-iso-code'] ||
      BASE_CURRENCY_ISO_CODE,
    amount: async (
      { amount, currencyIsoCode },
      _,
      { dataloaders, request }
    ) => {
      if (currencyIsoCode) {
        return amount
      }
      const currencyRate = await dataloaders.currencyRate.load(
        request.headers['currency-iso-code'] || BASE_CURRENCY_ISO_CODE
      )
      return currency.convert({ value: amount, currencyRate })
    },
  },
}
