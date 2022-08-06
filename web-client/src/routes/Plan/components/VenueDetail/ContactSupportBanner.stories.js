import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { action } from '@storybook/addon-actions'
import { Box } from 'components/atoms/Layout'
import ContactSupportBanner from './ContactSupportBanner'

export const Banner = () => (
  <Box px={{ mobile: 'm', tablet: 'xxl', desktop: 'xxl' }} mt="l">
    <ContactSupportBanner onClick={action('button-click')} />
  </Box>
)

export default {
  component: ContactSupportBanner,
  title: createStoryName({ base, filename }),
}
