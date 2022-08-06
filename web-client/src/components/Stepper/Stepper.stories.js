import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Box } from 'components/atoms/Layout'
import Stepper from './index'

export const DefaultView = () => (
  <Box py="m" px="xl">
    <Stepper>
      <Stepper.Step label="This is the first step label">
        <p>Berlin, Budapest, Lisbon, Kosice</p>
      </Stepper.Step>
      <Stepper.Step label="Also a second step">
        <p>Berlin, Budapest, Lisbon, Kosice</p>
      </Stepper.Step>
      <Stepper.Step label="There’s a third">
        <p>Berlin, Budapest, Lisbon, Kosice</p>
      </Stepper.Step>
      <Stepper.Step label="Fourth and the last step in stepper">
        <p>Berlin, Budapest, Lisbon, Kosice</p>
      </Stepper.Step>
    </Stepper>
  </Box>
)

export default {
  component: Stepper,
  title: createStoryName({ base, filename }),
}
