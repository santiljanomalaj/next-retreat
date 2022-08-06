import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { fontSizes, space, COLORS } from 'Theme'
import { Text } from 'components/atoms/Typography'
import landingIcon from 'assets/images/svg/landing.svg'
import takeOffIcon from 'assets/images/svg/takeoff.svg'
import { formatDate } from './helpers'

const StyledFlightInfo = styled('div')`
  display: flex;

  margin-top: ${space.s};
  padding: 0 ${space.s};

  font-size: ${fontSizes.s};

  color: ${COLORS.DEEP_RESERVOIR};
  background-color: ${COLORS.LYNX_WHITE};

  > * {
    padding: ${space.s};
  }
`

const Icon = styled('img')`
  flex: none;
`

const FlightInfo = ({ arrivalDate, departureDate, locations }) =>
  locations.length > 0 && (
    <StyledFlightInfo>
      {arrivalDate && (
        <>
          <Icon src={takeOffIcon} alt="" />
          <span>
            There are no available flights{' '}
            <Text color={COLORS.SPACE_CADET}>from {locations.join(', ')}</Text>{' '}
            on your arrival ({formatDate(arrivalDate)})
          </span>
        </>
      )}
      {departureDate && (
        <>
          <Icon src={landingIcon} alt="" />
          <span>
            There are no available flights{' '}
            <Text color={COLORS.SPACE_CADET}>to {locations.join(', ')}</Text> on
            your departure ({formatDate(departureDate)})
          </span>
        </>
      )}
    </StyledFlightInfo>
  )

FlightInfo.propTypes = {
  arrivalDate: PropTypes.string,
  departureDate: PropTypes.string,
  locations: PropTypes.array,
}

export default FlightInfo
