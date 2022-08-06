import { differenceInCalendarDays, parseISO } from 'date-fns'

export const getNumberOfNightsByDates = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) {
    return 0
  }
  return differenceInCalendarDays(
    new Date(parseISO(checkOutDate)),
    new Date(parseISO(checkInDate))
  )
}
