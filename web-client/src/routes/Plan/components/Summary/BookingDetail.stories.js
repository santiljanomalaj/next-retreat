import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Box } from 'components/atoms/Layout'
import placeholderImage from 'assets/images/placeholder.png'
import BookingDetail from './BookingDetail'

const testData = {
  title: `Standard Twin Room`,
  occupancyLimit: 2,
  numberOfNights: 10,
  price: {
    amount: 95,
    currencyIsoCode: 'EUR',
  },
  quantity: 3,
  cancelationPolicy: {
    isCancelable: false,
  },
  thumbnailUrls: [placeholderImage, placeholderImage, placeholderImage],
}

const testDataRefundable = {
  ...testData,
  cancelationPolicy: {
    isCancelable: true,
  },
}

export const IsNotRefundable = () => (
  <Box width={{ desktop: '650px' }} mx="m" mt="xl">
    <BookingDetail {...testData} />
  </Box>
)
export const IsRefundable = () => (
  <Box width={{ desktop: '650px' }} mx="m" mt="xl">
    <BookingDetail {...testDataRefundable} />
  </Box>
)

export default {
  component: BookingDetail,
  title: createStoryName({ base, filename }),
}
