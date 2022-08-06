import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Box } from 'components/atoms/Layout'
import bedroomIcon from 'assets/images/svg/bed-venue-detail.svg'
import IconText, { StyledTextLabel, StyledTextValue } from './IconText'

export const DefaultIconText = () => (
  <Box mx="m" my="m">
    <IconText.Item
      icon={bedroomIcon}
      texts={[
        <StyledTextValue>15</StyledTextValue>,
        <StyledTextLabel>rooms</StyledTextLabel>,
      ]}
    />
  </Box>
)

export default {
  component: IconText,
  title: createStoryName({ base, filename }),
}
