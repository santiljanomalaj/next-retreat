import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem, transparentize } from 'polished'
import { COLORS, BOXSHADOWS, space, radius } from 'Theme'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'

const BUBBLE_SIZE = '20px'

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
  background-color: ${COLORS.EXPLORATION_GREEN};
`

const Bubble = () => (
  <WrapperFlex>
    <Checkmark />
  </WrapperFlex>
)

const iconSize = rem(44)
const Icon = styled('img')`
  height: ${iconSize};
  max-height: ${iconSize};
  margin-right: calc(${space.m} + ${space.s});
`
const paddingY = `calc(${space.s} + ${space.xs})`

const StyledBox = styled(Box)`
  position: relative;
  cursor: pointer;
  height: ${rem(95)};
  border-radius: ${radius.m};
  box-shadow: ${BOXSHADOWS.DARK};
  border: 1px solid ${COLORS.IRRADIANT_IRIS};
  padding: ${paddingY} ${space.m} ${paddingY} ${space.m};
  ${({ isSelected }) =>
    isSelected &&
    `
    border: 1px solid ${COLORS.EXPLORATION_GREEN};
    background-color: ${transparentize(0.92, COLORS.EXPLORATION_GREEN)};
  `}
`

const IconText = ({ isSelected, src, title, text, onClick }) => (
  <StyledBox isSelected={isSelected} onClick={onClick}>
    <Flex>
      <Icon src={src} />
      <div>
        <Text
          as="p"
          fontSize="s"
          fontWeight="semi_bold"
          color={COLORS.SPACE_CADET}
          mb="xs"
        >
          {title}
        </Text>
        <Text fontSize="s" color={COLORS.SPACE_CADET}>
          {text}
        </Text>
      </div>
    </Flex>
    {isSelected && (
      <Box position="absolute" right={space.m} top={paddingY}>
        <Bubble />
      </Box>
    )}
  </StyledBox>
)

IconText.propTypes = {
  isSelected: PropTypes.bool,
  src: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default IconText
