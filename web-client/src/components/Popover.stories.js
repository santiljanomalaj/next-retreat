import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { COLORS } from 'Theme'
import Button from 'components/atoms/Button'
import { Box } from 'components/atoms/Layout'
import Popover from './Popover'

export const DefaultView = () => {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <Popover
      isVisible={isVisible}
      targetComp={
        <Button.Primary
          onClick={() => {
            setIsVisible((prevIsVisible) => !prevIsVisible)
          }}
        >
          Click me to open popover
        </Button.Primary>
      }
    >
      <Box p="m" bg={COLORS.IRRADIANT_IRIS}>
        Popover content
      </Box>
    </Popover>
  )
}

export default {
  component: Popover,
  title: createStoryName({ base, filename }),
}
