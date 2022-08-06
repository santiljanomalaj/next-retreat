import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { initializeArrayWithRange } from 'utils/helpers'
import { Box } from 'components/atoms/Layout'
import picturePlaceholder from 'assets/images/placeholder.png'
import avatarPlaceholder from 'assets/images/avatar-placeholder.png'
import logoPlaceholder from 'assets/images/logo-placeholder.png'
import ReviewSlider from './ReviewSlider'

const slideData = {
  review: `
  “The Wolfhouse team took great care of us and made sure our company
  meetup involving 60+ people was memorable and hassle-free. During the
  event, they were always on site and providing loads of behind the scenes
  support. They did a fantastic job! I highly recommend them.”
  `,
  authorName: `Ken Weary`,
  authorJobTitle: `VP of Operations, Hotjar`,
  pictureUrl: picturePlaceholder,
  avatarUrl: avatarPlaceholder,
  logoUrl: logoPlaceholder,
}

const slides = initializeArrayWithRange(5).map(() => slideData)

export const SliderWithLeftOffset = () => (
  <Box
    overflow="hidden" // container must always have overflow: hidden
    mx={{ mobile: 'm', tablet: '0' }}
    pl={{ mobile: 0, tablet: '160px' }}
    mt="m"
  >
    <ReviewSlider slides={slides} />
  </Box>
)

export default {
  component: ReviewSlider,
  title: createStoryName({ base, filename }),
}
