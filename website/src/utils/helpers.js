export const initializeArrayWithRange = (end, start = 0) =>
  Array.from({ length: end + 1 - start }).map((v, i) => i + start)
