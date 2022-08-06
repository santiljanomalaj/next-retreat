import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { rem } from 'polished'
import { COLORS } from 'Theme'
import { Text } from 'components/atoms/Typography'
import { Box } from 'components/atoms/Layout'
import Tooltip from './Tooltip'

export const DefaultUsage = () => (
  <Box mt="100px">
    <Tooltip
      contentComp={
        <Text textAlign="center" fontSize="xs">
          I am hovered on!
        </Text>
      }
    >
      Hover on me! Hover on me! Hover on me! Hover on me! Hover on me! Hover on
      me! Hover on me! Hover on me! Hover on me! Hover on me! Hover on me! Hover
      on me! Hover on me! Hover on me! Hover on me! Hover on me! Hover on me!
      Hover on me! Hover on me! Hover on me! Hover on me! Hover on me! Hover on
      me! Hover on me! Hover on me! Hover on me! Hover on me! Hover on me! Hover
      on me! Hover on me! Hover on me! Hover on me! Hover on me! Hover on me!
      Hover on me! Hover on me! Hover on me! Hover on me! Hover on me! Hover on
      me! Hover on me! Hover on me! Hover on me! Hover on me! Hover on me! Hover
      on me! Hover on me! Hover on me! Hover on me! Hover on me! Hover on me!
      Hover on me! Hover on me! Hover on me! Hover on me! Hover on me! Hover on
      me! Hover on me! Hover on me! Hover on me! Hover on me! Hover on me! Hover
      on me! Hover on me! Hover on me! Hover on me! Hover on me! Hover on me!
      Hover on me! Hover on me! Hover on me! Hover on me! Hover on me! Hover on
      me! Hover on me!
    </Tooltip>
  </Box>
)

export const DefaultTooltipTextRight = () => (
  <Box mt="20px">
    <Tooltip
      text="Average price for a return ticket per person"
      maxWidth={rem(160)}
    />
  </Box>
)
export const DefaultTooltipTextTop = () => (
  <Box mt="60px">
    <Tooltip
      position="TOP"
      text="Average price for a return ticket per person"
      maxWidth={rem(160)}
    />
  </Box>
)

export const LabelTextTopViolet = () => (
  <Box mt="100px">
    <Tooltip
      position="TOP"
      textAlign="left"
      iconSize={10}
      iconFill={COLORS.SPACE_CADET}
      label="NON-REFUNDABLE"
      text="For the room type and rate that you've selected, you are not allowed to change or cancel your reservation. If you cancel your room, you will still be charged for the full reservation amount."
    />
  </Box>
)

export const LabelTextRightGreen = () => (
  <Box mt="100px">
    <Tooltip
      textAlign="left"
      iconSize={10}
      iconFill={COLORS.EXPLORATION_GREEN}
      label="FLEXIBLE CANCELLATION"
      text="For the room type and rate that you've selected, you are not allowed to change or cancel your reservation"
    />
  </Box>
)

export default {
  component: Tooltip,
  title: createStoryName({ base, filename }),
}
