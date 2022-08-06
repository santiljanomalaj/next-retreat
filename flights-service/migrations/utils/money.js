const money = ({ table, name }) => table.decimal(name, 15, 2)

module.exports = money
