const currencyIsoCodes = require('./currencyIsoCodes')

module.exports = [
  { iso_code: currencyIsoCodes.EUR, title: 'Euro', symbol: '€' },
  { iso_code: currencyIsoCodes.USD, title: 'Dollar', symbol: '$' },
  { iso_code: currencyIsoCodes.GBP, title: 'Pound sterling', symbol: '£' },
]
