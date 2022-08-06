import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { math } from 'polished'
import { addDays, formatISO, parseISO } from 'date-fns'
import { fontSizes, space, BORDER_WIDTH, COLORS } from 'Theme'
import { Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Media, { queries } from 'components/Media'
import BodyCell from './BodyCell'
import Cell from './Cell'
import FlightInfo from './FlightInfo'
import HeaderCell from './HeaderCell'
import HeaderUI, {
  HeaderTitle,
  ButtonGroup,
  ArrowButton,
  DropdownButton,
} from './HeaderUI'
import MonthPicker from './MonthPicker'
import {
  flightGridMQ,
  CELL_WIDTH,
  CELL_HEIGHT,
  YESTERDAY_ISO,
  TODAY_ISO,
} from './constants'

const TableWrapper = styled('div')`
  position: relative;
  display: grid;
  grid-template-areas:
    'from .'
    'table to';

  max-width: max-content;

  white-space: nowrap;
`

const Table = styled('div')`
  position: relative;
  overflow: hidden;
  grid-area: table;

  font-size: ${fontSizes.s};

  color: ${COLORS.DEEP_RESERVOIR};

  ${({ calendarSizePlusOne }) => `
    width: ${math(`${CELL_WIDTH} * ${calendarSizePlusOne}`)};
    height: ${math(`${CELL_HEIGHT} * ${calendarSizePlusOne}`)};
  `}
`

const EmptyCornerCell = styled(Cell)`
  top: 0;
  right: 0;

  background-color: ${COLORS.WHITE};
`

const RowCell = styled(HeaderCell)`
  height: 100%;

  color: ${COLORS.SPACE_CADET};
  border-top: ${BORDER_WIDTH} solid ${COLORS.BROTHER_BLUE};
`

const ColumnCell = styled(HeaderCell)`
  width: 100%;

  color: ${COLORS.SPACE_CADET};
  border-right: ${BORDER_WIDTH} solid ${COLORS.BROTHER_BLUE};
`

const Body = styled('div')`
  cursor: pointer;

  position: relative;
  left: -${CELL_WIDTH};

  width: 100%;
  height: 100%;
`

const FromDatesRow = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  left: -${CELL_WIDTH};

  display: flex;

  width: 100%;
  height: ${CELL_HEIGHT};

  background-color: ${COLORS.LYNX_WHITE};
`

const ToDatesColumn = styled('div')`
  position: absolute;
  top: 0;
  right: 0;

  display: flex;
  flex-direction: column;

  width: ${CELL_WIDTH};
  height: 100%;

  background-color: ${COLORS.LYNX_WHITE};
`

const FlightInfoWrapper = styled('div')`
  ${({ calendarSizePlusOne }) => `
    width: ${math(`${CELL_WIDTH} * ${calendarSizePlusOne}`)};
  `}

  ${flightGridMQ`
    margin-top: ${space.l};
  `}
`

const FlightGridTable = ({
  arrivals,
  departures,
  flightsTotal,
  onArrowClick,
  selectedDates,
  startFromDate,
  setStartToDate,
  availableDateTo,
  currentToOffset,
  calendarSizePlusOne,
  calendarSizePlusTwo,
  setStartFromDate,
  setSelectedDates,
  availableDateFrom,
  currentFromOffset,
  lastMoveDirection,
  setCurrentToOffset,
  nightsInDestination,
  setCurrentFromOffset,
  initialFlightsGridLoading,
  setInitialFetch,
}) => {
  const [hoveredCell, setHoveredCell] = React.useState([])
  const [
    selectedUnavailableFlights,
    setSelectedUnavailableFlights,
  ] = React.useState(null)

  const [ArrowButtonLeft, ArrowButtonRight, ArrowButtonUp, ArrowButtonDown] = [
    'left',
    'right',
    'up',
    'down',
  ].map((direction) => (props) => (
    <ArrowButton
      direction={direction}
      onClick={() => {
        onArrowClick(direction)
      }}
      {...props}
    />
  ))

  const datePicker = (
    <MonthPicker
      targetComp={DropdownButton}
      availableDateTo={availableDateTo}
      availableDateFrom={availableDateFrom}
      startDate={addDays(parseISO(startFromDate), 1)}
      onStartDateChange={(month) => {
        setInitialFetch(false)
        const nextStartFromDate = formatISO(addDays(month, -1))
        const nextStartToDate = formatISO(month)
        setStartFromDate(
          nextStartFromDate > YESTERDAY_ISO ? nextStartFromDate : YESTERDAY_ISO
        )
        setStartToDate(
          nextStartToDate > TODAY_ISO ? nextStartToDate : TODAY_ISO
        )
      }}
      onChange={() => {
        setCurrentToOffset(0)
        setCurrentFromOffset(0)
      }}
    />
  )

  const departureHeaderTitle = (
    <HeaderTitle>
      Departure <Text color={COLORS.BLUEBERRY_SODA}>&</Text> Check-in
    </HeaderTitle>
  )

  const returnHeaderTitle = (
    <HeaderTitle>
      Return <Text color={COLORS.BLUEBERRY_SODA}>&</Text> Check-out
    </HeaderTitle>
  )

  return (
    <Media queries={queries}>
      {(matches) => (
        <div>
          {!initialFlightsGridLoading && (
            <>
              {matches.mobile && (
                <>
                  <Text color={COLORS.BLUEBERRY_SODA}>
                    {departureHeaderTitle} / {returnHeaderTitle}
                  </Text>
                  <Box mt="s" mb="m">
                    {datePicker}
                  </Box>
                </>
              )}
              <TableWrapper>
                <Table calendarSizePlusOne={calendarSizePlusOne}>
                  <Body
                    onMouseLeave={() => {
                      setHoveredCell([])
                    }}
                  >
                    {arrivals.map(
                      (
                        {
                          date: fromDate,
                          unavailableFlights: unavailableFlightsFrom,
                        },
                        fromIndex
                      ) =>
                        departures.map(
                          (
                            {
                              date: toDate,
                              unavailableFlights: unavailableFlightsTo,
                            },
                            toIndex
                          ) => (
                            <BodyCell
                              toDate={toDate}
                              fromDate={fromDate}
                              hoveredCell={hoveredCell}
                              flightsTotal={flightsTotal}
                              key={`${fromDate}${toDate}`}
                              selectedDates={selectedDates}
                              y={toIndex - currentToOffset}
                              setHoveredCell={setHoveredCell}
                              calendarSizePlusOne={calendarSizePlusOne}
                              calendarSizePlusTwo={calendarSizePlusTwo}
                              x={fromIndex - currentFromOffset}
                              setSelectedDates={setSelectedDates}
                              lastMoveDirection={lastMoveDirection}
                              nightsInDestination={nightsInDestination}
                              unavailableFlightsTo={unavailableFlightsTo}
                              unavailableFlightsFrom={unavailableFlightsFrom}
                              setSelectedUnavailableFlights={
                                setSelectedUnavailableFlights
                              }
                            />
                          )
                        )
                    )}
                  </Body>

                  <FromDatesRow>
                    {arrivals.map(
                      ({ date: fromDate, unavailableFlights }, fromIndex) => (
                        <RowCell
                          key={fromDate}
                          date={fromDate}
                          hoveredX={hoveredCell[0]}
                          flightsTotal={flightsTotal}
                          calendarSizePlusOne={calendarSizePlusOne}
                          calendarSizePlusTwo={calendarSizePlusTwo}
                          x={fromIndex - currentFromOffset}
                          lastMoveDirection={lastMoveDirection}
                          unavailableFlightsCount={unavailableFlights.length}
                        />
                      )
                    )}
                  </FromDatesRow>

                  <ToDatesColumn>
                    {departures.map(
                      ({ date: toDate, unavailableFlights }, toIndex) => (
                        <ColumnCell
                          key={toIndex}
                          date={toDate}
                          hoveredY={hoveredCell[1]}
                          flightsTotal={flightsTotal}
                          y={toIndex - currentToOffset}
                          calendarSizePlusOne={calendarSizePlusOne}
                          calendarSizePlusTwo={calendarSizePlusTwo}
                          lastMoveDirection={lastMoveDirection}
                          unavailableFlightsCount={unavailableFlights.length}
                        />
                      )
                    )}
                  </ToDatesColumn>

                  <EmptyCornerCell
                    calendarSizePlusOne={calendarSizePlusOne}
                    calendarSizePlusTwo={calendarSizePlusTwo}
                  />
                </Table>

                {matches.mobile ? (
                  <>
                    <ArrowButtonLeft isInset />
                    <ArrowButtonRight isInset />
                    <ArrowButtonUp isInset />
                    <ArrowButtonDown isInset />
                  </>
                ) : (
                  <>
                    <HeaderUI position="top">
                      {departureHeaderTitle}
                      {datePicker}
                      <ButtonGroup axis="horizontal">
                        <ArrowButtonLeft />
                        <ArrowButtonRight />
                      </ButtonGroup>
                    </HeaderUI>

                    <HeaderUI position="right">
                      <ButtonGroup axis="vertical">
                        <ArrowButtonUp />
                        <ArrowButtonDown />
                      </ButtonGroup>
                      {returnHeaderTitle}
                    </HeaderUI>
                  </>
                )}
              </TableWrapper>
            </>
          )}

          {selectedDates && (
            <FlightInfoWrapper calendarSizePlusOne={calendarSizePlusOne}>
              <FlightInfo
                arrivalDate={selectedDates.from}
                locations={selectedUnavailableFlights?.from ?? []}
              />
              <FlightInfo
                departureDate={selectedDates.to}
                locations={selectedUnavailableFlights?.to ?? []}
              />
            </FlightInfoWrapper>
          )}
        </div>
      )}
    </Media>
  )
}

FlightGridTable.propTypes = {
  selectedDates: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }),
  arrivals: PropTypes.array.isRequired,
  nightsInDestination: PropTypes.number,
  departures: PropTypes.array.isRequired,
  onArrowClick: PropTypes.func.isRequired,
  initialFlightsGridLoading: PropTypes.bool,
  flightsTotal: PropTypes.number.isRequired,
  setStartToDate: PropTypes.func.isRequired,
  startFromDate: PropTypes.string.isRequired,
  setStartFromDate: PropTypes.func.isRequired,
  setSelectedDates: PropTypes.func.isRequired,
  availableDateTo: PropTypes.instanceOf(Date),
  calendarSizePlusOne: PropTypes.number.isRequired,
  calendarSizePlusTwo: PropTypes.number.isRequired,
  currentToOffset: PropTypes.number.isRequired,
  availableDateFrom: PropTypes.instanceOf(Date),
  setCurrentToOffset: PropTypes.func.isRequired,
  lastMoveDirection: PropTypes.string.isRequired,
  currentFromOffset: PropTypes.number.isRequired,
  setCurrentFromOffset: PropTypes.func.isRequired,
  setInitialFetch: PropTypes.func.isRequired
}

export default FlightGridTable
