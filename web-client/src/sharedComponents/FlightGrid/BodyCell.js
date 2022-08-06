import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { mix } from 'polished'
import { COLORS } from 'Theme'
import { Text } from 'components/atoms/Typography'
import Cell from './Cell'
import SuccessFlag from './SuccessFlag'

const StyledBodyCell = styled(Cell)`
  background-color: ${COLORS.WHITE};

  ${({ isSelected }) =>
    isSelected &&
    `
      background-color: ${COLORS.CHUN_LI_BLUE} !important;
      color: ${COLORS.WHITE};
    `}

  ${({ isSuccessful }) =>
    isSuccessful &&
    `
      background-color: ${mix(0.1, COLORS.EXPLORATION_GREEN, COLORS.WHITE)};
    `}
`

const BodyCell = ({
  x,
  y,
  toDate,
  fromDate,
  hoveredCell,
  flightsTotal,
  selectedDates,
  setHoveredCell,
  calendarSizePlusOne,
  calendarSizePlusTwo,
  setSelectedDates,
  lastMoveDirection,
  nightsInDestination,
  unavailableFlightsTo,
  unavailableFlightsFrom,
  setSelectedUnavailableFlights,
}) => {
  const isValid = fromDate < toDate
  const isSelected =
    isValid && selectedDates?.from === fromDate && selectedDates?.to === toDate

  const flightsPercentage =
    Math.ceil(
      (((flightsTotal -
        (unavailableFlightsFrom.length + unavailableFlightsTo.length) / 2) /
        flightsTotal) *
        100) /
        5
    ) * 5
  const isSuccessful = isValid && flightsPercentage === 100

  return (
    <StyledBodyCell
      x={x}
      y={y}
      onMouseEnter={() => {
        setHoveredCell([fromDate, toDate])
      }}
      onClick={() => {
        if (isValid) {
          setSelectedDates({ from: fromDate, to: toDate })
          setSelectedUnavailableFlights({
            from: unavailableFlightsFrom,
            to: unavailableFlightsTo,
          })
        }
      }}
      isHighlighted={
        (hoveredCell[0] === fromDate && hoveredCell[1] >= toDate) ||
        (hoveredCell[1] === toDate && hoveredCell[0] <= fromDate)
      }
      isSelected={isSelected}
      isSuccessful={isSuccessful}
      calendarSizePlusOne={calendarSizePlusOne}
      calendarSizePlusTwo={calendarSizePlusTwo}
      lastMoveDirection={lastMoveDirection}
    >
      {isValid &&
        (flightsPercentage !== 0 ? (
          <>
            <Text fontWeight={isSelected ? 'semi_bold' : undefined}>
              {`${flightsPercentage}%`}
            </Text>
            {isSelected && (
              <span>
                {`${nightsInDestination} ${
                  nightsInDestination === 1 ? 'night' : 'nights'
                }`}
              </span>
            )}
          </>
        ) : (
          'No flights'
        ))}
      {isSuccessful && <SuccessFlag />}
    </StyledBodyCell>
  )
}

BodyCell.propTypes = {
  hoveredCell: PropTypes.array,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  selectedDates: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }),
  toDate: PropTypes.string.isRequired,
  fromDate: PropTypes.string.isRequired,
  nightsInDestination: PropTypes.number,
  flightsTotal: PropTypes.number.isRequired,
  setHoveredCell: PropTypes.func.isRequired,
  setSelectedDates: PropTypes.func.isRequired,
  calendarSizePlusOne: PropTypes.number.isRequired,
  calendarSizePlusTwo: PropTypes.number.isRequired,
  lastMoveDirection: PropTypes.string.isRequired,
  unavailableFlightsTo: PropTypes.array.isRequired,
  unavailableFlightsFrom: PropTypes.array.isRequired,
  setSelectedUnavailableFlights: PropTypes.func.isRequired,
}

export default BodyCell
