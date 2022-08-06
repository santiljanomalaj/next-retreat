import { rem } from 'polished'
import { addDays, formatISO } from 'date-fns'
import { mq } from 'Theme'

export const flightGridMQ = mq.to.tablet
export const CELL_WIDTH = rem('86px')
export const CELL_HEIGHT = rem('49px')

export const YESTERDAY_ISO = formatISO(addDays(new Date(), -1), {
  representation: 'date',
})
export const TODAY_ISO = formatISO(new Date(), {
  representation: 'date',
})
