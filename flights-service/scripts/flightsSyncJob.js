require('dotenv').config({ path: '../.env' })
const { syncFlightData } = require('./syncFlightDataFromKiwiAPI')
const { checkAvailableAirports} = require('./checkAvailableAirports')

const RUN_ON_DAY = 1

const delay = ms => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
  }

const sameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}

const sync = async () => {
    let dayOfRun = new Date()
    while (true) {
        const day = new Date()
        const dayOfWeek = day.getDay()

        if(dayOfWeek !== RUN_ON_DAY || sameDay(dayOfRun, day)){
            await delay(1000 * 60 * 60 * 23) //23 hours
            continue
        }

        dayOfRun = day

        try {
            await checkAvailableAirports()
            await syncFlightData()
        } catch (error) {
            console.error(`Got error in synchronization`, error)
        }
    }
}

; (async () => await sync())()