const currencyRate = ({ table, name }) => table.decimal(name, 15, 8)

module.exports = currencyRate
