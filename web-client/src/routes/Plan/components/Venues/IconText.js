import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS } from 'Theme'
import { Text } from 'components/atoms/Typography'
import { Flex } from 'components/atoms/Layout'

const DIRECTIONS = {
  UP: `transform: rotate(0deg);`,
  DOWN: `transform: rotate(180deg);`,
}

const Icon = styled('img')`
  position: absolute;
  width: ${rem(13)};
  ${({ direction }) => DIRECTIONS[direction]}
`

const IconText = ({ src, value, text, direction }) => (
  <Flex position="relative" alignItems="center">
    <Icon src={src} direction={direction} />
    <Text pl="m" fontSize="xs" color={COLORS.BLUEBERRY_SODA}>
      <Text color={COLORS.SPACE_CADET} pl="xxs">{`${value} `}</Text>
      {text}
    </Text>
  </Flex>
)

IconText.propTypes = {
  direction: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  src: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}

export default IconText
