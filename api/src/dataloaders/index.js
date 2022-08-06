const DataLoader = require('dataloader')
const currencyRate = require('./currencyRate')
const { tripVenues } = require('./venue')

const dataloaders = [
  { name: 'currencyRate', batchLoadFn: currencyRate },
  { name: 'tripVenues', batchLoadFn: tripVenues },
]

const getDataloaders = () =>
  dataloaders.reduce(
    (acc, { name, batchLoadFn }) => ({
      ...acc,
      [name]: new DataLoader(batchLoadFn),
    }),
    {}
  )

module.exports = getDataloaders
