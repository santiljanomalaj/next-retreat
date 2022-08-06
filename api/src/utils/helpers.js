const convertCelsiusToFahrenheit = (celsiusValue) => (celsiusValue * 9) / 5 + 32

const generateRandomNumber = (min, max) =>
  Math.round(Math.random() * (max - min) + min)

const metersToKilometers = (meters) => meters / 1000

module.exports = {
  convertCelsiusToFahrenheit,
  generateRandomNumber,
  metersToKilometers,
}
