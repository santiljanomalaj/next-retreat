import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { Flex } from 'components/atoms/Layout'
import { COLORS, fontSizes, fontWeights } from 'Theme'
import { convertMinutesToHours } from 'utils/helpers'

const StyledFlex = styled(Flex)`
  align-items: center;
  justify-content: center;
  height: ${rem(20)};
`

const StyledText = styled('span')`
  font-size: ${fontSizes.xxs};
  font-weight: ${fontWeights.semi_bold};
  color: ${COLORS.WHITE};
`

const InfoWindow = ({ travelTimeInMinutes, isDirectionAvailable, bgColor }) => (
  <>
    {isDirectionAvailable ? (
      <StyledFlex width={rem(30)} bg={bgColor}>
        <StyledText>
          {`${convertMinutesToHours(travelTimeInMinutes)} h`}
        </StyledText>
      </StyledFlex>
    ) : (
      <StyledFlex width={rem(16)} bg={COLORS.BLUEBERRY_SODA}>
        <StyledText>X</StyledText>
      </StyledFlex>
    )}
  </>
)

InfoWindow.defaultProps = {
  bgColor: COLORS.EXPLORATION_GREEN,
}

InfoWindow.propTypes = {
  travelTimeInMinutes: PropTypes.number.isRequired,
  isDirectionAvailable: PropTypes.bool.isRequired,
  bgColor: PropTypes.string,
}

export default InfoWindow
