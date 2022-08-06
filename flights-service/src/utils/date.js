const format = require('date-fns/format')

const KIWI_DATE_FORMAT = 'dd/MM/yyyy'

const formatDateToKiwi = (date) => format(date, KIWI_DATE_FORMAT)
const formatDateToSQL = (date) =>
  date
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ')

module.exports = { formatDateToKiwi, formatDateToSQL }
