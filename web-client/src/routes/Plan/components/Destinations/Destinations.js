import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery, gql } from '@apollo/client'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { COLORS } from 'Theme'
import { CurrencyContext } from 'CurrencyProvider'
import { DomesticTravelContext } from 'DomesticTravelProvider'
import { parseISO } from 'date-fns'
import { Box, Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Button from 'components/atoms/Button'
import Pagination from 'components/organisms/Pagination'
import Stepper from 'components/Stepper'
import Layout, { LIST_PADDING } from 'sharedComponents/Layout'
import AllDestinations from './Filters/AllDestinations'
import CardList from './CardList'
import ToggleMapViewButton from './Map/ToggleMapViewButton'
import { SkeletonMap, SkeletonList } from './SkeletonLoader'
import Slider from './Slider'
import Map from './Map'
import SuggestionForm from './SuggestionForm'
import Modal from '../Modal'
import MonthFilter from './MonthFilter'
import OriginLocationsStep from '../OriginLocationsStep'
import FilterGroup from '../FilterGroup'
import Sorter from '../Sorter'
import useStickyObserver from '../../useStickyObserver'
import {
  useGoogleTracking,
  GTM_EVENTS,
} from '../../../../hooks/useGoogleTracking'

const PAGINATION_LIMIT = 10
const TEMPERATURES = {
  C: 'C',
  F: 'F',
}

const getPaginationInfo = ({
  limit,
  currentPage,
  totalCount,
  currentCount,
}) => {
  const base = limit * (currentPage - 1)
  const from = base + 1
  const to = base + Math.min(limit, currentCount)
  const total = totalCount > 500 ? '500+' : totalCount

  return `${from}-${to} of ${total} suggested destinations`
}

const GET_DESTINATIONS = gql`
  query Destinations($input: DestinationsInput!) {
    destinations(input: $input) {
      data {
        id
        title
        description
        avgPrice {
          amount
          currencyIsoCode
        }
        pictureUrl
        types
        country
        isDomestic
        kiwiCityId
        availableOriginLocationIds
        avgTravelTimeInMinutes
        avgTemperaturesByMonth {
          month
          celsius
          fahrenheit
        }
        coordinates {
          lat
          lon
        }
        flightDurations {
          originLocation
          duration
        }
        travelDurations {
          originLocation
          duration
          coordinates {
            lat
            lon
          }
          type
          price
          airportTo
          stepovers
        }
      }
      paginationInfo {
        currentPage
        firstPage
        lastPage
        nextPage
        previousPage
        totalCount
      }
      originLocations {
        id
        name
        coordinates {
          lat
          lon
        }
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

const Destinations = ({ stepData, updateStepData, getNextUrl }) => {
  const history = useHistory()
  const { logGTMEvent } = useGoogleTracking()
  const { destination } = stepData
  const { currency } = React.useContext(CurrencyContext)
  const {
    countryCode: domesticTravelCountryCode,
    isSameOrigin,
  } = React.useContext(DomesticTravelContext)
  const [hoveredDestinationId, setHoveredDestinationId] = React.useState(null)
  const [swipedDestinationId, setSwipedDestinationId] = React.useState(null)
  const [isMapOpen, setIsMapOpen] = React.useState(false)
  const [isSuggestionFormOpen, setIsSuggestionFormOpen] = React.useState(false)

  const filtersRef = React.useRef(null)
  const containerRef = React.useRef(null)
  const { isSticky } = useStickyObserver(containerRef, filtersRef)

  const toggleSuggestionForm = () => setIsSuggestionFormOpen((prev) => !prev)

  const {
    destinationTypes,
    temperature = TEMPERATURES.C,
    sortBy,
    page: activePage = 1,
    startMonth,
    endMonth,
  } = destination?.filters ?? {}

  const toggleMap = () => {
    if (isMapOpen) {
      clearAllBodyScrollLocks()
    } else {
      disableBodyScroll(document.querySelector('#root'))
    }
    setIsMapOpen((prevOpen) => !prevOpen)
  }

  const setUrlFilters = React.useCallback(
    (nextFilters) => {
      updateStepData(({ destination: prevDestination }) => {
        logGTMEvent({
          event: GTM_EVENTS.destinationSearch,
          ...prevDestination?.filters,
          ...nextFilters,
        })
        return {
          destination: {
            ...prevDestination,
            filters: {
              ...prevDestination?.filters,
              ...nextFilters,
            },
          },
        }
      })
    },
    [logGTMEvent, updateStepData]
  )

  const getVenueUrlByDestinationId = (id) => {
    return getNextUrl(({ destination: prevDestination }) => ({
      destination: { ...prevDestination, id },
      venue: null,
    }))
  }

  const setActivePage = (page) => {
    setUrlFilters({ page })
  }

  const { loading, error, data, refetch } = useQuery(GET_DESTINATIONS, {
    variables: {
      input: {
        filter: {
          domesticTravelCountryCode,
          type: destinationTypes ?? [],
          originLocations: stepData.originLocations.map(({ id }) => id),
          monthFromUtc: startMonth,
          monthToUtc: endMonth,
        },
        sorter: sortBy,
        pagination: {
          page: activePage,
          limit: PAGINATION_LIMIT,
        },
      },
    },
    context: {
      headers: {
        'currency-iso-code': currency,
      },
    },
    fetchPolicy: 'cache-and-network',
  })

  const availableDatesQuery = useQuery(GET_AVAILABLE_DATES)
  const { dateFrom: availableDateFrom, dateTo: availableDateTo } =
    availableDatesQuery?.data?.availableDestinationsDates ?? {}

  React.useEffect(() => {
    refetch()
  }, [currency, refetch])

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [activePage])

  React.useEffect(() => {
    if (isSameOrigin != null && window.ga) {
      window.ga(() => {
        const tracker = window.ga.getAll()[0]
        tracker.send({
          hitType: 'event',
          eventCategory: 'destination_selection',
          eventAction: 'page_viewed',
          eventValue: isSameOrigin ? 1 : 0,
        })
      })
    }
  }, [isSameOrigin])

  if (error) {
    history.push('/internal-server-error')
  }

  const {
    destinations: {
      data: destinations,
      paginationInfo: {
        currentPage,
        firstPage,
        lastPage,
        nextPage,
        previousPage,
        totalCount,
      } = {},
      originLocations,
    } = {},
  } = data ?? {}
  
  return (
    <Layout
      isMapOpen={isMapOpen}
      listContent={
        <Layout.List>
          <Stepper mb="m" pt="m">
            <OriginLocationsStep
              isLoading={loading}
              locations={originLocations}
              updateStepData={updateStepData}
            />
            <Stepper.Step label="CHOOSE A DESTINATION" />
          </Stepper>
          <Flex flexDirection="column" ref={containerRef}>
            <FilterGroup
              outerPadding={LIST_PADDING}
              isSticky={isSticky}
              ref={filtersRef}
            >
              {totalCount && !isSticky && (
                <Text fontSize="s">{totalCount} suggestions</Text>
              )}
              <MonthFilter
                startMonth={startMonth && parseISO(startMonth)}
                endMonth={endMonth && parseISO(endMonth)}
                setUrlFilters={setUrlFilters}
                availableDateFrom={
                  availableDateFrom && parseISO(availableDateFrom)
                }
                availableDateTo={availableDateTo && parseISO(availableDateTo)}
              />
              <AllDestinations
                destinationTypes={destinationTypes}
                setUrlFilters={setUrlFilters}
              />
              <Button.Pill
                onClick={() => {
                  setUrlFilters({
                    temperature:
                      temperature === TEMPERATURES.C
                        ? TEMPERATURES.F
                        : TEMPERATURES.C,
                  })
                }}
              >
                {`°${temperature}`}
              </Button.Pill>
              <Sorter
                sortBy={sortBy}
                innerLabel="Sort destination by:"
                setUrlFilters={setUrlFilters}
              />
            </FilterGroup>
            {loading && !isMapOpen ? (
              <SkeletonList />
            ) : (
              destinations && (
                <>
                  <CardList
                    destinations={destinations}
                    originLocations={originLocations}
                    onHover={setHoveredDestinationId}
                    isMapOpen={isMapOpen}
                    isCelsius={temperature === TEMPERATURES.C}
                    getVenueUrlByDestinationId={getVenueUrlByDestinationId}
                    stepData={stepData}
                  />
                  {!isMapOpen && (
                    <ToggleMapViewButton
                      isMapDisplayed={isMapOpen}
                      toggleMap={toggleMap}
                      display={{ mobile: 'block', tablet: 'none' }}
                    />
                  )}
                  <Box mt={{ mobile: 'm', desktop: 'l' }}>
                    <Pagination
                      firstPage={firstPage}
                      lastPage={lastPage}
                      currentPage={currentPage}
                      previousPage={previousPage}
                      nextPage={nextPage}
                      onNextClick={setActivePage}
                      onPrevClick={setActivePage}
                      onPageClick={setActivePage}
                      info={getPaginationInfo({
                        limit: PAGINATION_LIMIT,
                        currentPage,
                        totalCount,
                        currentCount: destinations.length,
                      })}
                      mb={{ mobile: 's', desktop: 'l' }}
                    />
                    <Modal
                      isOpen={isSuggestionFormOpen}
                      closeModal={toggleSuggestionForm}
                    >
                      <SuggestionForm closeModal={toggleSuggestionForm} />
                    </Modal>
                    <Box
                      width="100%"
                      height="1px"
                      bg={COLORS.IRRADIANT_IRIS}
                      mb="l"
                    />
                    <Button.Secondary isBlock onClick={toggleSuggestionForm}>
                      Cannot find your destination?
                    </Button.Secondary>
                  </Box>
                </>
              )
            )}
          </Flex>
        </Layout.List>
      }
      mapContent={
        <Layout.Map>
          {loading && !isMapOpen ? (
            <SkeletonMap />
          ) : (
            destinations && (
              <Map
                destinations={destinations}
                originLocations={originLocations}
                hoveredDestinationId={hoveredDestinationId}
                setSwipedDestinationId={setSwipedDestinationId}
                swipedDestinationId={
                  isMapOpen ? swipedDestinationId : undefined
                }
                toggleMap={toggleMap}
                isMapOpen={isMapOpen}
                toggleMapViewButton={
                  <ToggleMapViewButton
                    isMapDisplayed={isMapOpen}
                    toggleMap={toggleMap}
                    display={{
                      mobile: 'block',
                      desktop: `${isMapOpen ? 'block' : 'none'}`,
                    }}
                  />
                }
                carousel={
                  isMapOpen &&
                  !loading && (
                    <Slider
                      nextPage={nextPage}
                      currentPage={currentPage}
                      previousPage={previousPage}
                      setActivePage={setActivePage}
                      destinations={destinations}
                      originLocations={originLocations}
                      swipedDestinationId={swipedDestinationId}
                      onSwipe={setSwipedDestinationId}
                      getVenueUrlByDestinationId={getVenueUrlByDestinationId}
                    />
                  )
                }
              />
            )
          )}
        </Layout.Map>
      }
    />
  )
}

Destinations.propTypes = {
  stepData: PropTypes.object.isRequired,
  updateStepData: PropTypes.func.isRequired,
  getNextUrl: PropTypes.func.isRequired,
}

export default Destinations
