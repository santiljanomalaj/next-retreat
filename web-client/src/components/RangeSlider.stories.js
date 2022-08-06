import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Flex } from 'components/atoms/Layout'
import RangeSlider from './RangeSlider'

export const DefaultView = () => {
  const [[min, max], setValue] = React.useState([0, 100])

  return (
    <Flex flexDirection="column" alignItems="center" p="l" width="300px">
      <code>
        [min: {min}, max: {max}]
      </code>
      <RangeSlider value={[min, max]} onChange={setValue} />
    </Flex>
  )
}

export default {
  component: RangeSlider,
  title: createStoryName({ base, filename }),
}
