export const convertMinutesToHours = (minutes) =>
  Math.round((minutes / 60) * 10) / 10

export const clamp = (min, max) => (number) =>
  Math.min(Math.max(min, number), max)

export const initializeArrayWithRange = (end, start = 0) =>
  Array.from({ length: end + 1 - start }).map((v, i) => i + start)

export const sum = (list) => list.reduce((a, b) => a + b, 0)

export const roundUp = (number, precision) =>
  Math.ceil(number * 10 ** precision) / 10 ** precision

export const updateArrayByIndex = ({ value, index, array }) =>
  Object.assign([], array, { [index]: value })

export const modulo = (left, right) => ((left % right) + right) % right
