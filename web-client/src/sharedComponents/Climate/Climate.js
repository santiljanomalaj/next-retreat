import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS, radius } from 'Theme'
import { roundUp } from 'utils/helpers'
import { Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'

const SIZE = rem(28)

const WrapperFlex = styled(Flex)`
  justify-content: center;
  align-items: center;
  border-radius: ${radius.circle};
  ${({ bubbleSize }) => `
    height: ${bubbleSize || SIZE};
    width: ${bubbleSize || SIZE};
  `}
`

/* chooses blue or yellow and gradually increases its opacity
from 0.2 to 1 based on the temperature in celsius
 */

const getColor = (temperature) => {
  const MINIMUM_VALUE = 4 // to avoid opacity 0.1
  const PRECISION = 1
  const DIVISION_COEFFICIENT = 3
  if (temperature <= 0) {
    return `rgba(170, 204, 255, ${roundUp(
      (Math.abs(Math.min(-MINIMUM_VALUE, temperature)) / 100) *
        DIVISION_COEFFICIENT,
      PRECISION
    )})`
  }
  return `rgba(255, 211, 71, ${roundUp(
    (Math.abs(Math.max(MINIMUM_VALUE, temperature)) / 100) *
      DIVISION_COEFFICIENT,
    PRECISION
  )})`
}

const convertCelsiusToFahrenheit = (celsius) => (celsius * 9) / 5 + 32

const Bubble = ({ temperature, bubbleColor, bubbleSize }) => (
  <WrapperFlex bubbleSize={bubbleSize} bg={bubbleColor}>
    <Text fontSize="xs" color={COLORS.SPACE_CADET}>
      {`${temperature}`}
    </Text>
    <Text fontSize="xs" color={COLORS.BLUEBERRY_SODA}>
      °
    </Text>
  </WrapperFlex>
)

Bubble.propTypes = {
  bubbleSize: PropTypes.string,
  temperature: PropTypes.number.isRequired,
  bubbleColor: PropTypes.string.isRequired,
}

const StyledFlex = styled(Flex)`
  flex-wrap: nowrap;
  overflow-x: auto;
`

const Climate = ({ temperaturesToMonths, isCelsius, bubbleSize, ...props }) => (
  <StyledFlex {...props}>
    {temperaturesToMonths.map(({ month, celsius }, i) => (
      <Flex
        key={month}
        flex="0 0 auto"
        flexDirection="column"
        alignItems="center"
        mr={i === temperaturesToMonths.length - 1 ? 0 : 'm'}
      >
        <Bubble
          temperature={Math.round(
            isCelsius ? celsius : convertCelsiusToFahrenheit(celsius)
          )}
          bubbleColor={getColor(celsius)}
          bubbleSize={bubbleSize}
        />
        <Text fontSize="xs">{month.slice(0, 3)}</Text>
      </Flex>
    ))}
  </StyledFlex>
)

Climate.propTypes = {
  bubbleSize: PropTypes.string,
  isCelsius: PropTypes.bool,
  temperaturesToMonths: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      celsius: PropTypes.number,
    }).isRequired
  ).isRequired,
}

export default Climate
