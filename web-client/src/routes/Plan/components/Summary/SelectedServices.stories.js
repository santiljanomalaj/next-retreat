import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { rem } from 'polished'
import { Box } from 'components/atoms/Layout'
import SelectedServices from './SelectedServices'

const testData = {
  note: 'Here’s the note I’ve left you in the booking process.',
  services: ['INSURANCE', 'FOOD'],
}

export const Services = () => (
  <Box mx="m" my="m" maxWidth={{ desktop: rem(645) }}>
    <SelectedServices {...testData} />
  </Box>
)

export default {
  component: SelectedServices,
  title: createStoryName({ base, filename }),
}
