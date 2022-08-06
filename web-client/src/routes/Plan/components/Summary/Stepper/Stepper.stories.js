import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Box } from 'components/atoms/Layout'
import Stepper from './Stepper'

const testData = {
  originLocations: ['Berlin', 'Budapest', 'Lisbon', 'Kosice', 'Rome'],
  destinationCountry: 'Czechia',
  destinationCity: 'Prague',
  venueTitle: 'Stylish hostel at the heart of the city',
}

export const DefaultStepper = () => (
  <Box mx="m" my="m">
    <Stepper {...testData} />
  </Box>
)

export default {
  component: Stepper,
  title: createStoryName({ base, filename }),
}
