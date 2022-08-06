import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS, radius, space } from 'Theme'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Tooltip from 'components/molecules/Tooltip'

const BUBBLE_SIZE = rem(22)
const HEADER_WIDTH = rem(170)

const Checkmark = () => (
  <svg viewBox="0 0 12 9" width="12" height="9">
    <path
      fill={COLORS.WHITE}
      d="M4.25 9a.75.75 0 01-.53-.22L.19 5.25l1.06-1.06 3 3 6.5-6.5 1.06 1.06-7.03 7.03a.75.75 0 01-.53.22z"
    />
  </svg>
)

const WrapperFlex = styled(Flex)`
  align-items: center;
  justify-content: center;
  border-radius: ${radius.circle};
  height: ${BUBBLE_SIZE};
  width: ${BUBBLE_SIZE};
`

const Bubble = ({ bubbleColor, bubbleValue }) => (
  <WrapperFlex bg={bubbleColor || COLORS.LYNX_WHITE}>
    {bubbleValue || <Checkmark />}
  </WrapperFlex>
)

Bubble.propTypes = {
  bubbleValue: PropTypes.node,
  bubbleColor: PropTypes.string,
}

const ContainerFlex = styled(Flex)`
  max-width: ${HEADER_WIDTH};
  min-width: ${HEADER_WIDTH};
  align-items: center;
  position: relative;
  height: ${rem(55)};
  padding: 0 ${space.s};
  background-color: ${({ headerColor }) => headerColor || COLORS.WHITE};
  border: ${({ headerBorderColor }) =>
    headerBorderColor &&
    `1px solid ${headerBorderColor}; border-radius: ${radius.m};`};
`

const Header = ({
  textColor,
  bubbleValue,
  tooltipText,
  bubbleColor,
  headerColor,
  headerBorderColor,
  headerText: { top, bottom },
}) => (
  <ContainerFlex
    headerColor={headerColor}
    headerBorderColor={headerBorderColor}
  >
    <Bubble bubbleColor={bubbleColor} bubbleValue={bubbleValue} />
    <Box ml="s">
      <Text
        as="p"
        fontSize="xxs"
        fontWeight="semi_bold"
        color={textColor || COLORS.BLUEBERRY_SODA}
      >
        {top}
      </Text>
      <Text
        as="p"
        fontSize="xxs"
        fontWeight="semi_bold"
        color={textColor || COLORS.BLUEBERRY_SODA}
      >
        {bottom}
      </Text>
    </Box>
    <Box position="absolute" right="s" top="s">
      {tooltipText && (
        <Tooltip
          maxWidth={rem(140)}
          position="LEFT"
          textAlign="left"
          iconSize={12}
          iconFill={COLORS.BLUEBERRY_SODA}
          text={tooltipText}
        />
      )}
    </Box>
  </ContainerFlex>
)

Header.propTypes = {
  bubbleValue: PropTypes.node,
  textColor: PropTypes.string,
  bubbleColor: PropTypes.string,
  headerColor: PropTypes.string,
  tooltipText: PropTypes.string,
  headerBorderColor: PropTypes.string,
  headerText: PropTypes.object.isRequired,
}

export default Header
