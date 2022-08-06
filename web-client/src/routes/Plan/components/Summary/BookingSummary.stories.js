import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Box } from 'components/atoms/Layout'
import BookingSummary from './BookingSummary'

export const Summary = () => (
  <Box mx="m" my="m">
    <BookingSummary bookingNumber="0383876687" />
  </Box>
)

export default {
  component: BookingSummary,
  title: createStoryName({ base, filename }),
}
