import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import { radius, COLORS } from 'Theme'
import { H3, Text } from 'components/Typography'
import { Flex, Box } from 'components/Layout'
import checkmarkIcon from 'images/svg/checkmark.svg'

const BUBBLE_SIZE = rem('26px')
const CHECK_MARK_SIZE = rem('12px')
const BOTTOM_TEXT_WIIDTH = rem('320px')

const CheckMark = styled('img')`
  width: ${CHECK_MARK_SIZE};
`

const Circle = styled(Flex)`
  align-items: center;
  justify-content: center;
  height: ${BUBBLE_SIZE};
  width: ${BUBBLE_SIZE};
  border-radius: ${radius.circle};
  background-color: ${COLORS.GOUDA_GOLD};
  margin: 0 auto;
`

const SuccessMessage = () => (
  <div id="get-access-success-container">
    <Circle>
      <CheckMark src={checkmarkIcon} />
    </Circle>
    <H3 textAlign="center" color={COLORS.SPACE_CADET} my="m">
      Thanks, your request was sent!
    </H3>
    <Box width={BOTTOM_TEXT_WIIDTH} m="0 auto">
      <Text as="p" textAlign="center" fontSize="m">
        Representative from our team will be in touch with you soon.
      </Text>
    </Box>
  </div>
)

export default SuccessMessage
