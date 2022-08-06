import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Box } from 'components/atoms/Layout'
import RadioGroup from './RadioGroup'

const INITIAL_STATE = 'initial'

export const DefaultView = () => {
  const [state, setState] = React.useState(INITIAL_STATE)
  return (
    <Box p="m">
      <RadioGroup selectedValue={state} onSelect={(value) => setState(value)}>
        <RadioGroup.Option value="default" label="Default" />
        <RadioGroup.Option value={INITIAL_STATE} label="Initial select" />
        <RadioGroup.Option
          value="long_label"
          label="This one has a very long label"
        />
        <RadioGroup.Option value="disabled" label="Disabled" disabled />
      </RadioGroup>
    </Box>
  )
}

export default {
  component: RadioGroup,
  title: createStoryName({ base, filename }),
}
