const initializeArrayWithRange = (end, start = 0) =>
  Array.from({ length: end + 1 - start }).map((v, i) => i + start)

const sleep = (waitTimeInMs) =>
  new Promise((resolve) => setTimeout(resolve, waitTimeInMs))

const getMemoryUsage = () => process.memoryUsage().heapUsed / 1024 / 1024

module.exports = { initializeArrayWithRange, sleep, getMemoryUsage }
