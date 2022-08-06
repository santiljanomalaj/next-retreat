export const requireDynamicFlag = (countryCode) => {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(`assets/images/flags/${countryCode.toLowerCase()}.png`)
  } catch {
    return countryCode
  }
}
