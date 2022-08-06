import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Box } from 'components/atoms/Layout'
import Checkbox from './Checkbox'

export const DefaultView = () => {
  const [isChecked, setChecked] = React.useState(false)
  return (
    <Box p="m">
      <Checkbox
        isChecked={isChecked}
        onChange={() => {
          setChecked((prevChecked) => !prevChecked)
        }}
      >
        Single checkbox
      </Checkbox>
    </Box>
  )
}

export default {
  component: Checkbox,
  title: createStoryName({ base, filename }),
}
