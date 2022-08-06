import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { rem } from 'polished'
import { COLORS } from 'Theme'
import { Box } from 'components/atoms/Layout'
import Climate from './Climate'
import avgTemperaturesByMonth from './climate.json'

export const DestinationsDesktop = () => (
  <Box maxWidth="548px">
    <Climate
      temperaturesToMonths={avgTemperaturesByMonth}
      isCelsius
      bg={COLORS.LYNX_WHITE}
    />
  </Box>
)

export const DestinationsMobile = () => (
  <Box maxWidth="320px">
    <Climate
      temperaturesToMonths={avgTemperaturesByMonth}
      isCelsius
      bg={COLORS.LYNX_WHITE}
    />
  </Box>
)

export const DestinationsDesktopFahrenheit = () => (
  <Box maxWidth="548px">
    <Climate
      temperaturesToMonths={avgTemperaturesByMonth}
      bg={COLORS.LYNX_WHITE}
    />
  </Box>
)

export const VenueDetailDesktop = () => (
  <Box maxWidth="740px">
    <Climate
      temperaturesToMonths={avgTemperaturesByMonth}
      bubbleSize={rem(40)}
      isCelsius
    />
  </Box>
)
export const VenueDetailMobile = () => (
  <Box maxWidth="320px">
    <Climate
      temperaturesToMonths={avgTemperaturesByMonth}
      bubbleSize={rem(40)}
      isCelsius
    />
  </Box>
)

export default {
  component: Climate,
  title: createStoryName({ base, filename }),
}
