import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Box } from 'components/atoms/Layout'
import placeholderImage from 'assets/images/placeholder.png'
import RoomType from './RoomType'

const roomDataDefault = {
  title: `Standard Twin Room`,
  description: `Comfortable & stylish twin room with wardrobes and ensuite
  bathroom.`,
  occupancyLimit: 2,
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

const roomDataRefundable = {
  ...roomDataDefault,
  cancelationPolicy: {
    isCancelable: true,
  },
}

const roomDataBigDescription = {
  title: `Standard Twin Room`,
  description: `Comfortable & stylish twin room with wardrobes and ensuite
  bathroom. Comfortable & stylish twin room with wardrobes and ensuite
  bathroom. Comfortable & stylish twin room with wardrobes and ensuite
  bathroom. Comfortable & stylish twin room with wardrobes and ensuite
  bathroom. Comfortable & stylish twin room with wardrobes and ensuite
  bathroom.`,
  occupancyLimit: 2,
  price: {
    amount: 95,
    currencyIsoCode: 'EUR',
  },
  thumbnailUrls: [placeholderImage, placeholderImage, placeholderImage],
  quantity: 3,
  cancelationPolicy: {
    isCancelable: false,
  },
}

export const RoomTypeIsRefundable = () => (
  <Box width={{ desktop: '50%' }} mx="m">
    <RoomType {...roomDataRefundable} />
  </Box>
)

export const RoomTypeNonRefundable = () => (
  <Box width={{ desktop: '50%' }} mx="m">
    <RoomType {...roomDataDefault} />
  </Box>
)

export const RoomTypeWithBigDescription = () => (
  <Box width={{ desktop: '50%' }} mx="m">
    <RoomType {...roomDataBigDescription} />
  </Box>
)

export default {
  component: RoomType,
  title: createStoryName({ base, filename }),
}
