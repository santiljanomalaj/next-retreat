import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { COLORS } from 'Theme'
import { Text } from 'components/atoms/Typography'
import Cell from './Cell'
import { formatDate } from './helpers'

const FlightsInfo = styled(Text)`
  color: ${COLORS.BLUEBERRY_SODA};

  ${({ isSuccessful }) =>
    isSuccessful &&
    `
      color: ${COLORS.EXPLORATION_GREEN};
    `}
`

const HeaderCell = ({
  x,
  y,
  date,
  hoveredX,
  hoveredY,
  className,
  flightsTotal,
  calendarSizePlusOne,
  calendarSizePlusTwo,
  lastMoveDirection,
  unavailableFlightsCount,
}) => {
  const hasAllFlights = unavailableFlightsCount === 0
  const hasNoFlights = unavailableFlightsCount === flightsTotal || !flightsTotal

  /* prettier-ignore */
  // eslint-disable-next-line no-nested-ternary
  const flightsLabel = hasNoFlights
    ? 'No flights'
    : hasAllFlights
      ? 'All flights'
      : `${flightsTotal - unavailableFlightsCount} of ${flightsTotal} flights`

  return (
    <Cell
      x={x}
      y={y}
      className={className}
      calendarSizePlusOne={calendarSizePlusOne}
      calendarSizePlusTwo={calendarSizePlusTwo}
      lastMoveDirection={lastMoveDirection}
      isHighlighted={date === hoveredX || date === hoveredY}
    >
      <span>{formatDate(date)}</span>
      <FlightsInfo fontSize="xs" isSuccessful={hasAllFlights && !hasNoFlights}>
        {flightsLabel}
      </FlightsInfo>
    </Cell>
  )
}

HeaderCell.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  hoveredX: PropTypes.string,
  hoveredY: PropTypes.string,
  date: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  flightsTotal: PropTypes.number.isRequired,
  calendarSizePlusOne: PropTypes.number.isRequired,
  calendarSizePlusTwo: PropTypes.number.isRequired,
  lastMoveDirection: PropTypes.string.isRequired,
  unavailableFlightsCount: PropTypes.number.isRequired,
}

export default HeaderCell
