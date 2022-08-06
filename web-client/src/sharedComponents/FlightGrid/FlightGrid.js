import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { mix, rem } from 'polished'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { useQuery, useLazyQuery, gql } from '@apollo/client'
import { space, BOXSHADOWS, COLORS } from 'Theme'
import Button from 'components/atoms/Button'
import { Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Media from 'components/Media'
// import { updateArrayByIndex, modulo } from 'utils/helpers'
import { flightGridMQ, YESTERDAY_ISO, TODAY_ISO } from './constants'
import { addISODays } from './helpers'
import FlightGridTable from './FlightGridTable'
import SuccessFlag from './SuccessFlag'

const GET_FLIGHT_OPTIONS_GRID = gql`
  query FlightOptionsGrid($input: FlightOptionsGridInput!) {
    flightOptionsGrid(input: $input) {
      arrivals {
        date
        unavailableFlights
      }
      departures {
        date
        unavailableFlights
      }
    }
  }
`

const GET_AVAILABLE_DATES = gql`
  query AvailableDestinationsDates {
    availableDestinationsDates {
      dateFrom
      dateTo
    }
  }
`

const Legend = styled(Text)`
  position: relative;

  display: inline-flex;
  align-items: center;

  min-height: ${rem('24px')};
  padding: 0 ${space.s} 0 ${space.m};
  margin-top: ${space.xs};

  background-color: ${mix(0.1, COLORS.EXPLORATION_GREEN, COLORS.WHITE)};
  color: ${COLORS.EXPLORATION_GREEN};
`

const Footer = styled('div')`
  display: flex;
  justify-content: space-between;

  margin-top: ${space.l};

  ${flightGridMQ`
    display: flex;
    align-items: center;

    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;

    height: ${rem('56px')};
    padding: 0 ${space.m};
    margin: 0;

    background-color: ${COLORS.LYNX_WHITE};
    box-shadow: ${BOXSHADOWS.LIGHT};
  `}
`

const FlightGrid = ({
  toDate,
  fromDate,
  closeModal,
  destination,
  calendarSize,
  setUrlFilters,
  originLocations,
  hasFooterControls,
}) => {
  const history = useHistory()
  const [startFromDate, setStartFromDate] = React.useState(
    fromDate ? addISODays(fromDate, -1) : YESTERDAY_ISO
  )
  const [startToDate, setStartToDate] = React.useState(
    toDate ? addISODays(toDate, -1) : TODAY_ISO
  )
  const [selectedDates, setSelectedDates] = React.useState(
    fromDate && toDate
      ? {
          from: fromDate,
          to: toDate,
        }
      : null
  )
  const [currentFromOffset, setCurrentFromOffset] = React.useState(0)
  const [currentToOffset, setCurrentToOffset] = React.useState(0)
  const [arrivalsData, setArrivalsData] = React.useState([])
  const [departuresData, setDeparturesData] = React.useState([])
  const [lastMoveDirection, setLastMoveDirection] = React.useState('')
  // const [isMoveDisabled, setIsMoveDisabled] = React.useState(false)

  const calendarSizePlusOne = React.useMemo(() => calendarSize + 1, [
    calendarSize,
  ])
  const calendarSizePlusTwo = React.useMemo(() => calendarSize + 2, [
    calendarSize,
  ])

  const [getFlightGrid, { loading: flightGridLoading }] = useLazyQuery(
    GET_FLIGHT_OPTIONS_GRID,
    {
      onCompleted: ({ flightOptionsGrid: { arrivals, departures } }) => {
        // debugger
        if (lastMoveDirection === 'right') {
          setArrivalsData([...arrivalsData.slice(1, arrivalsData.length), arrivals[0]])
        }
        if (lastMoveDirection === 'left') {
          setArrivalsData([arrivals[0], ...arrivalsData.slice(0, arrivalsData.length - 1)])
          // setArrivalsData((prevArrivalsData) =>
          //   updateArrayByIndex({
          //     value: arrivals[0],
          //     index: modulo(currentFromOffset, calendarSizePlusTwo),
          //     array: prevArrivalsData,
          //   })
          // )
        }
        if (lastMoveDirection === 'down') {
          setDeparturesData([...departuresData.slice(1, departuresData.length), departures[0]])
          // setDeparturesData((prevDeparturesData) =>
          //   updateArrayByIndex({
          //     value: departures[0],
          //     index: modulo(currentToOffset - 1, calendarSizePlusTwo),
          //     array: prevDeparturesData,
          //   })
          // )
        }
        if (lastMoveDirection === 'up') {
          setDeparturesData([departures[0], ...departuresData.slice(0, departuresData.length - 1)])
          // setDeparturesData((prevDeparturesData) =>
          //   updateArrayByIndex({
          //     value: departures[0],
          //     index: modulo(currentToOffset, calendarSizePlusTwo),
          //     array: prevDeparturesData,
          //   })
          // )
        }
      },
    }
  )

  const getFlightGridByDate = React.useCallback(
    ({ arrivalDate, departureDate }) =>
      getFlightGrid({
        variables: {
          input: {
            arrivalDates: arrivalDate ? [arrivalDate] : [],
            departureDates: departureDate ? [departureDate] : [],
            originLocations,
            destination,
          },
        },
      }),
    [getFlightGrid, originLocations, destination]
  )

  // const {
  //   loading: initialFlightGridLoading,
  //   error: initialFlightGridError,
  //   refetch: initialFlightGridRefetch,
  // } = useQuery(
    const [initialFlightGridRefetch, { loading: initialFlightGridLoading, error: initialFlightGridError }] = useLazyQuery(GET_FLIGHT_OPTIONS_GRID, {
    variables: {
      input: {
        arrivalDates: [...Array(calendarSizePlusTwo)].map((_, i) =>
          addISODays(startFromDate, i)
        ),
        departureDates: [...Array(calendarSizePlusTwo)].map((_, i) =>
          addISODays(startToDate, i)
        ),
        originLocations,
        destination,
      },
    },
    onCompleted: ({ flightOptionsGrid: { arrivals, departures } }) => {
      if(!initalFetch) {
        setArrivalsData(arrivals)
        setDeparturesData(departures)
        setInitialFetch(true)
      }
    },
    fetchPolicy: 'cache-and-network',
  })

  const availableDatesQuery = useQuery(GET_AVAILABLE_DATES)
  const { dateFrom: availableDateFrom, dateTo: availableDateTo } =
    availableDatesQuery?.data?.availableDestinationsDates ?? {}

  const handleMove = (direction) => {
    // debugger
    if (!flightGridLoading) {
      // setIsMoveDisabled(true)
      // setTimeout(() => {
      //   setIsMoveDisabled(false)
      // }, 400)


      if (direction === 'left') {
        const arrivalDate = addISODays(arrivalsData[0].date || startFromDate, currentFromOffset - 1)

        if (arrivalDate >= YESTERDAY_ISO) {
          setLastMoveDirection('left')
          // setCurrentFromOffset(
          //   (prevCurrentFromOffset) => prevCurrentFromOffset - 1
          // )
          getFlightGridByDate({ arrivalDate })
        }
      }

      if (direction === 'right') {
        setLastMoveDirection('right')
        // setCurrentFromOffset(
        //   (prevCurrentFromOffset) => prevCurrentFromOffset + 1
        // )
        getFlightGridByDate({
          arrivalDate: addISODays(
            arrivalsData[0].date || startFromDate,
            calendarSizePlusOne + currentFromOffset + 1
          ),
        })
      }

      if (direction === 'up') {
        const departureDate = addISODays(departuresData[0].date || startToDate, currentToOffset - 1)

        if (departureDate >= TODAY_ISO && departureDate >= arrivalsData[0].date) {
          setLastMoveDirection('up')
          // setCurrentToOffset((prevCurrentToOffset) => prevCurrentToOffset - 1)
          getFlightGridByDate({ departureDate })
        }
      }

      if (direction === 'down') {
        setLastMoveDirection('down')
        // setCurrentToOffset((prevCurrentToOffset) => prevCurrentToOffset + 1)
        getFlightGridByDate({
          departureDate: addISODays(
            departuresData[0].date || startToDate,
            calendarSizePlusOne + currentToOffset + 1
          ),
        })
      }
    }
  }

  const [initalFetch, setInitialFetch] = React.useState(false)

  // React.useEffect(() => {initialFlightGridRefetch()})
  React.useEffect(() => {
    if(!initalFetch) {
      initialFlightGridRefetch()

    }
  }, [initalFetch, calendarSize, startFromDate, startToDate, initialFlightGridRefetch])

  React.useEffect(() => {
  }, [arrivalsData, departuresData])


  const { from: selectedDatesFrom, to: selectedDatesTo } = selectedDates ?? {}

  React.useEffect(() => {
    if (!hasFooterControls) {
      setUrlFilters({
        checkInDate: selectedDatesFrom,
        checkOutDate: selectedDatesTo,
      })
    }
  }, [setUrlFilters, hasFooterControls, selectedDatesFrom, selectedDatesTo])

  const nightsInDestination = selectedDates
    ? differenceInCalendarDays(
        parseISO(selectedDates.to),
        parseISO(selectedDates.from)
      )
    : undefined

  if (initialFlightGridError) {
    history.push('/internal-server-error')
  }

  return (
    <div>
      <Box mb="l">
        <Text display="block" fontSize="xxl" fontWeight="semi_bold">
          NextRetreat Sync Calendar
        </Text>
        <Text display="block" fontSize="l" color={COLORS.DEEP_RESERVOIR}>
          Use NextRetreat Sync Calendar to choose the best dates
        </Text>
        <Legend fontSize="xs">
          <SuccessFlag size={rem('10px')} />
          All team members have flights on same day
        </Legend>
      </Box>
      <FlightGridTable
        arrivals={arrivalsData}
        onArrowClick={handleMove}
        departures={departuresData}
        startFromDate={startFromDate}
        selectedDates={selectedDates}
        setStartToDate={setStartToDate}
        currentToOffset={currentToOffset}
        calendarSizePlusOne={calendarSizePlusOne}
        calendarSizePlusTwo={calendarSizePlusTwo}
        setStartFromDate={setStartFromDate}
        setSelectedDates={setSelectedDates}
        flightsTotal={originLocations.length}
        currentFromOffset={currentFromOffset}
        lastMoveDirection={lastMoveDirection}
        setCurrentToOffset={setCurrentToOffset}
        nightsInDestination={nightsInDestination}
        setCurrentFromOffset={setCurrentFromOffset}
        initialFlightGridLoading={initialFlightGridLoading}
        availableDateTo={availableDateTo && parseISO(availableDateTo)}
        availableDateFrom={availableDateFrom && parseISO(availableDateFrom)}
        setInitialFetch={setInitialFetch}
      />
      {hasFooterControls && (
        <Footer>
          <Button.Tertiary
            onClick={() => {
              setUrlFilters({
                dateFromUtc: null,
                dateToUtc: null,
              })
              setSelectedDates(null)
            }}
          >
            Clear
          </Button.Tertiary>
          <Button.Primary
            disabled={!selectedDates}
            onClick={() => {
              if (selectedDates) {
                setUrlFilters({
                  dateFromUtc: selectedDates.from,
                  dateToUtc: selectedDates.to,
                })
                closeModal()
              }
            }}
          >
            Select
          </Button.Primary>
        </Footer>
      )}
    </div>
  )
}

FlightGrid.propTypes = {
  toDate: PropTypes.string,
  fromDate: PropTypes.string,
  closeModal: PropTypes.func,
  hasFooterControls: PropTypes.bool,
  destination: PropTypes.string.isRequired,
  setUrlFilters: PropTypes.func.isRequired,
  calendarSize: PropTypes.number.isRequired,
  originLocations: PropTypes.array.isRequired,
}

const ResponsiveFlightGrid = (props) => (
  <Media>
    {(matches) => {
      const getCalendarSize = () => {
        if (matches.mobile) {
          return 3
        }
        if (matches.tablet) {
          return 6
        }
        if (matches.desktop) {
          return 7
        }
        return 7
      }

      return <FlightGrid {...props} calendarSize={getCalendarSize()} />
    }}
  </Media>
)

export default ResponsiveFlightGrid
