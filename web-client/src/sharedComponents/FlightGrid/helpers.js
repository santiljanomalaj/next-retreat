import { addDays, format, formatISO, parseISO } from 'date-fns'

export const formatDate = (date) => format(parseISO(date), 'EEE d.M.')

export const addISODays = (ISOdate, days) =>
  formatISO(addDays(parseISO(ISOdate), days), {
    representation: 'date',
  })
