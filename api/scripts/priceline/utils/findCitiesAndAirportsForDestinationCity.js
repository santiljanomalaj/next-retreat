/* eslint-disable no-return-assign */
const fs = require('fs')
const { exit } = require('process')
const { getDistance } = require('geolib')

const calcDistance = async ({ obj, lat, lon }) => {
  const distance = await getDistance(
    {
      latitude: lat,
      longitude: lon,
    },
    {
      latitude: obj.latitude,
      longitude: obj.longitude,
    }
  )

  return { ...obj, distance: distance / 1000 }
}

// eslint-disable-next-line no-unused-vars
const writeToCsv = (title, jsonObject) => {
  let fileString = ''
  const separator = ','
  const fileType = 'csv'
  const file = `${title}.${fileType}`

  Object.keys(jsonObject[0]).forEach(
    (value) => (fileString += `${value}${separator}`)
  )
  fileString = fileString.slice(0, -1)
  fileString += '\n'

  jsonObject.forEach((transaction) => {
    Object.values(transaction).forEach(
      (value) => (fileString += `${value}${separator}`)
    )
    fileString = fileString.slice(0, -1)
    fileString += '\n'
  })

  fs.writeFileSync(file, fileString, 'utf8')
}

const CITY_TO_FIND = 'Punta Cana'
const CITY_RADIUS = 100
const AIRPORT_RADIUS = 200

const find = async () => {
  const rawAirportsData = fs.readFileSync('source/get-airports-20210813.json')
  const rawCitiesData = fs.readFileSync('source/get-cities-20210831.json')

  const {
    'getSharedBOF2.Downloads.Hotel.Airports': {
      results: { airports },
    },
  } = JSON.parse(rawAirportsData)

  const {
    'getSharedBOF2.Downloads.Hotel.Cities': {
      results: { cities },
    },
  } = JSON.parse(rawCitiesData)

  // find the city based on name
  const city = cities.find((c) => c.city === CITY_TO_FIND)

  if (!city) {
    console.log(`City was not found for expression: ${CITY_TO_FIND}`)
    exit(0)
  }

  console.log(`City found for ${CITY_TO_FIND} with PPN_ID: ${city.cityid_ppn}`)

  // find all cities that are in radius
  const citiesWithDistance = await Promise.all(
    cities.map((c) =>
      calcDistance({ obj: c, lat: city.latitude, lon: city.longitude })
    )
  )

  const suitableCities = citiesWithDistance.filter(
    (c) => c.distance < CITY_RADIUS && c.country_code === city.country_code
  )

  // find all airports that are in radius
  const airportsWithDistance = await Promise.all(
    airports.map((airport) =>
      calcDistance({ obj: airport, lat: city.latitude, lon: city.longitude })
    )
  )

  const sutiableAirports = airportsWithDistance.filter(
    (airport) => airport.distance < AIRPORT_RADIUS && airport.rank_score_ppn > 0
  )

  console.log(`Found ${suitableCities.length} suitable cities`)
  console.log(`Found ${sutiableAirports.length} suitable airports`)

  console.log('City', city)

  //   writeToCsv(`${city.city}-airports`, sutiableAirports)
  //   writeToCsv(`${city.city}-cities`, suitableCities)
}

;(async () => {
  await find()
})()
