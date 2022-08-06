import React from 'react'
import styled from 'styled-components'
import { rem, transparentize } from 'polished'
import { BOXSHADOWS, radius, COLORS, space, mq } from 'Theme'
import { Flex, Box } from 'components/Layout'
import { Text } from 'components/Typography'
import checkmarkIcon from 'images/svg/checkmark.svg'

const BUBBLE_SIZE = rem(22)

const CheckMark = styled('img')`
  width: ${rem(12)};
`

const WrapperFlex = styled(Flex)`
  align-items: center;
  justify-content: center;
  position: absolute;
  top: ${space.m};
  left: ${space.m};
  transform: translateX(50%);
  border-radius: ${radius.circle};
  height: ${BUBBLE_SIZE};
  width: ${BUBBLE_SIZE};
  background-color: ${COLORS.EXPLORATION_GREEN};
`

const StyledSuccessBox = styled('div')`
  position: relative;
  max-width: ${rem(548)};
  overflow: hidden;
  border-radius: ${radius.m};
  box-shadow: ${BOXSHADOWS.INNER};
  border: 1px solid ${COLORS.EXPLORATION_GREEN};
  background-color: ${transparentize(0.92, COLORS.EXPLORATION_GREEN)};
  ${mq.to.desktop`
    max-width: 100%;
  `}
`

const SuccessMessage = () => (
  <StyledSuccessBox>
    <Box px="xl" py="m">
      <Text
        as="p"
        fontSize="l"
        fontWeight="medium"
        color={COLORS.SPACE_CADET}
        mb="m"
      >
        Thank you for your submission! We will get back to you in 24 hours.
      </Text>
      <Text as="p" fontSize="l" color={COLORS.DEEP_RESERVOIR}>
        If your inquiry is urgent, please use the telephone number or webchat to
        get in touch with one of our Retreat Specialists.
      </Text>
    </Box>
    <WrapperFlex>
      <CheckMark src={checkmarkIcon} />
    </WrapperFlex>
  </StyledSuccessBox>
)

export default SuccessMessage
