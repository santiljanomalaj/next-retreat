const currency = require('currency.js')

const convert = ({ value, currencyRate = 1 }) =>
  currency(value).multiply(currencyRate).value

const convertToEuro = ({ value, currencyRate = 1 }) =>
  convert({ currencyRate: 1 / currencyRate, value })

const round = (value) => currency(value).value

module.exports = { convert, convertToEuro, round }
