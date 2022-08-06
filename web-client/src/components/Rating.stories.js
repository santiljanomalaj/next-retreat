import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { COLORS } from 'Theme'
import { Flex } from 'components/atoms/Layout'
import Rating from './Rating'

export const DefaultRating = () => <Rating>4.9</Rating>
export const Large = () => (
  <Flex
    justifyContent="center"
    alignItems="center"
    height="140px"
    width="140px"
    bg={COLORS.IRRADIANT_IRIS}
  >
    <Rating.Large>9.4</Rating.Large>
  </Flex>
)

export default {
  component: Rating,
  title: createStoryName({ base, filename }),
}
