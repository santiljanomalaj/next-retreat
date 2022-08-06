import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Box, Flex } from './Layout'

export const BoxDefault = () => (
  <Box gutterY="20px">
    <Box p="5rem" backgroundColor="lime" maxWidth="20vw" mx="auto">
      Hello!
    </Box>
    <Box p="5rem" backgroundColor="lime" maxWidth="20vw" mx="auto">
      Hello!
    </Box>
    <Box p="5rem" backgroundColor="lime" maxWidth="20vw" mx="auto">
      Hello!
    </Box>
    <Box p="5rem" backgroundColor="lime" maxWidth="20vw" mx="auto">
      Hello!
    </Box>
  </Box>
)

export const FlexDefault = () => (
  <Flex alignItems="center" backgroundColor="#AAA">
    <Box flex="1" p="2rem" m="0.5rem" backgroundColor="#0074D9">
      Flex: 1
    </Box>
    <Box flex="2" p="2rem" m="0.5rem" backgroundColor="#01FF70">
      Flex: 2
    </Box>
    <Box flex="none" p="2rem" m="0.5rem" backgroundColor="#FF4136">
      Flex: none
    </Box>
  </Flex>
)

export default {
  title: createStoryName({ base, filename }),
}
