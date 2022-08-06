import React from 'react'
import { actions, action } from '@storybook/addon-actions'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Box } from 'components/atoms/Layout'
import Button from './Button'

export const Back = () => (
  <Button.Back onClick={action('button-click')}>Back to list</Button.Back>
)

export const Primary = () => (
  <Button.Primary {...actions('onClick')}>Primary Button</Button.Primary>
)

export const PrimaryStretched = () => (
  <Box width="400px">
    <Button.Primary {...actions('onClick')} isBlock>
      Primary Button
    </Button.Primary>
  </Box>
)

export const PrimaryDisabled = () => (
  <Button.Primary {...actions('onClick')} disabled>
    Disabled
  </Button.Primary>
)

export const Secondary = () => (
  <Button.Secondary {...actions('onClick')}>Secondary Button</Button.Secondary>
)

export const SecondaryDisabled = () => (
  <Button.Secondary {...actions('onClick')} disabled>
    Disabled
  </Button.Secondary>
)

export const Tertiary = () => (
  <Button.Tertiary {...actions('onClick')}>Clear</Button.Tertiary>
)

export const Pill = () => (
  <Button.Pill {...actions('onClick')}>Pill</Button.Pill>
)

export const PillDisabled = () => (
  <Button.Pill {...actions('onClick')} disabled>
    Pill
  </Button.Pill>
)

export default {
  component: Button,
  title: createStoryName({ base, filename }),
}
