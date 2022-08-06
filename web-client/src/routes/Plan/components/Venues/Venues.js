import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'
import { rem } from 'polished'
import { format, formatISO, parseISO } from 'date-fns'
import { useQuery, gql } from '@apollo/client'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { CurrencyContext } from 'CurrencyProvider'
import { DomesticTravelContext } from 'DomesticTravelProvider'
import { COLORS } from 'Theme'
import { Box, Flex } from 'components/atoms/Layout'
import Button from 'components/atoms/Button'
import { Text } from 'components/atoms/Typography'
import Pagination from 'components/organisms/Pagination'
import { useModal } from 'components/Modal'
import Stepper from 'components/Stepper'
import LinkText from "./linkText";
import { sum } from 'utils/helpers'
import Layout, { LIST_PADDING } from 'sharedComponents/Layout'
import MaxTeamSize from './Filters/MaxTeamSize'
import MoreFilters from './Filters/MoreFilters'
import PriceRange from './Filters/PriceRange'
import ToggleMapViewButton from './Map/ToggleMapViewButton'
import { SkeletonMap, SkeletonList, SkeletonStep } from './SkeletonLoader'
import AvailabilityCalendarModal from './AvailabilityCalendarModal'
import Card from './Card'
import FlightGridModal from './FlightGridModal'
import Map from './Map'
import OriginLocationsStep from '../OriginLocationsStep'
import EditButton from '../EditButton'
import FilterGroup from '../FilterGroup'
import Sorter from '../Sorter'
import useStickyObserver from '../../useStickyObserver'
import {
  useGoogleTracking,
  GTM_EVENTS,
} from '../../../../hooks/useGoogleTracking'
import MapNextRetreatImg from "../../../../assets/images/map-nextretreat.svg";
import SignPostImg from "../../../../assets/images/signpost.png";

const PAGINATION_LIMIT = 10
const MIN_TEAM_SIZE = 5

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

  return `${from}-${to} of ${total} venues for teams`
}

const GET_VENUES = gql`
  query Venues($input: VenuesInput, $thumbnailsLimit: Int) {
    venues(input: $input) {
      data {
        id
        thumbnailUrl
        thumbnailUrls(limit: $thumbnailsLimit)
        type
        rating
        title
        amenities
        numberOfRooms
        capacity
        isMeetingRoomIncluded
        isPromoted
        price {
          amount
          currencyIsoCode
        }
        priceTotal {
          amount
          currencyIsoCode
        }
        airportsCoordinates {
          lat
          lon
        }
        nearestAirport {
          distanceInKilometers
          name
          code
        }
        coordinates {
          lat
          lon
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
      airportData {
        name
        code
        coordinates {
          lat
          lon
        }
      }
      filterData {
        priceMin {
          amount
          currencyIsoCode
        }
        priceMax {
          amount
          currencyIsoCode
        }
      }
    }
  }
`

const GET_STEPPER_DATA = gql`
  query StepperData($filter: OriginLocationsInput!, $input: DestinationInput!) {
    originLocations(filter: $filter) {
      name
    }
    destination(input: $input) {
      id
      title
      country
    }
  }
`

const Venues = ({
  stepData,
  updateStepData,
  getNextUrl,
  onDestinationNameChange,
}) => {
  const history = useHistory()
  const { logGTMEvent } = useGoogleTracking()
  const { originLocations, destination, venue } = stepData
  const originLocationsTeamSize = sum(originLocations.map(({ size }) => size))

  const {
    retreatType,
    isMeetingRoomIncluded,
    isPromotedOnly,
    venueTypes,
    priceRange: [minPrice, maxPrice] = [],
    maxTeamSize,
    sortBy,
    page: activePage = 1,
    dateFromUtc,
    dateToUtc,
  } = venue?.filters ?? {}

  const areDatesSet = Boolean(dateFromUtc) && Boolean(dateToUtc)

  const { isOpen, openModal, closeModal } = useModal()
  const { currency, getCurrencySymbol } = React.useContext(CurrencyContext)
  const { isDomesticDestination } = React.useContext(DomesticTravelContext)
  const filtersRef = React.useRef(null)
  const containerRef = React.useRef(null)
  const { isSticky } = useStickyObserver(containerRef, filtersRef)

  const setUrlFilters = React.useCallback(
    (nextFilters, replace) => {
      updateStepData(
        ({ venue: prevVenue }) => {
          logGTMEvent({
            event: GTM_EVENTS.venueSearch,
            ...prevVenue?.filters,
            ...nextFilters,
          })
          return {
            venue: {
              ...prevVenue,
              filters: {
                ...prevVenue?.filters,
                ...nextFilters,
              },
            },
          }
        },
        { replace }
      )
    },
    [logGTMEvent, updateStepData]
  )

  const setActivePage = (page) => {
    setUrlFilters({ page })
  }

  const { loading, error, data, refetch } = useQuery(GET_VENUES, {
    variables: {
      input: {
        filter: {
          destination: destination.id,
          originLocations: originLocations.map(({ id }) => id),
          teamSize: maxTeamSize || MIN_TEAM_SIZE,
          retreatType,
          isPromotedOnly,
          isMeetingRoomIncluded,
          dateFromUtc,
          dateToUtc,
          priceFrom: { amount: minPrice },
          priceTo: { amount: maxPrice },
          type: venueTypes ?? [],
        },
        sorter: sortBy,
        pagination: {
          page: activePage,
          limit: PAGINATION_LIMIT,
        },
      },
      thumbnailsLimit: 100,
    },
    context: {
      headers: {
        'currency-iso-code': currency,
      },
    },
    fetchPolicy: 'cache-and-network',
  })

  React.useEffect(() => {
    refetch()
  }, [refetch, currency])

  const {
    loading: stepperLoading,
    error: stepperError,
    data: stepperData,
  } = useQuery(GET_STEPPER_DATA, {
    variables: {
      filter: {
        ids: originLocations.map(({ id }) => id),
        selectedOriginLocations: [], // Has to be here because of BE bug
      },
      input: {
        id: destination.id,
        originLocations: originLocations.map(({ id }) => id),
      },
    },
  })

  const [hoveredVenueId, setHoveredVenueId] = React.useState(null)
  const [isMapOpen, setIsMapOpen] = React.useState(false)

  const toggleMap = () => setIsMapOpen(!isMapOpen)

  const getDetailUrlByVenueId = (id) =>
    getNextUrl(({ venue: prevVenue }) => ({
      venue: { ...prevVenue, id },
      detail: null,
    }))

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [activePage])

  React.useEffect(() => {
    if (!maxTeamSize) {
      setTimeout(() => {
        setUrlFilters(
          { maxTeamSize: Math.max(originLocationsTeamSize, MIN_TEAM_SIZE) },
          { replace: true }
        )
      })
    }
  }, [originLocationsTeamSize, maxTeamSize, setUrlFilters])

  React.useEffect(() => {
    if (!loading) {
      clearAllBodyScrollLocks()
    }
  }, [loading])

  React.useEffect(() => {
    const title = stepperData?.destination.title
    if (title) {
      onDestinationNameChange(title)
    }
  }, [onDestinationNameChange, stepperData])

  if (loading) {
    disableBodyScroll(document.querySelector('#root'))
  }

  React.useEffect(() => {
    if(data?.venues?.data?.length === 0){
      logGTMEvent({event: GTM_EVENTS.venuesNotFound})
    }
  }, [logGTMEvent, data])

  if (error || stepperError) {
    history.push('/internal-server-error')
  }

  const {
    venues: {
      data: serverData,
      paginationInfo: {
        currentPage,
        firstPage,
        lastPage,
        nextPage,
        previousPage,
        totalCount,
      } = {},
      airportData,
      filterData: {
        priceMin: { amount: priceMin, currencyIsoCode } = {},
        priceMax: { amount: priceMax } = {},
      } = {},
    } = {},
  } = data ?? {}

  const {
    originLocations: locations,
    destination: { title: destinationTitle, country: destinationCountry } = {},
  } = stepperData ?? {}

  return (
    <>
      <Layout
        isMapOpen={isMapOpen}
        contentWidth={rem('675px')}
        ratio={2}
        listContent={
          <Layout.List>
            <Stepper mb="m" pt="m">
              <OriginLocationsStep
                isLoading={stepperLoading}
                locations={locations}
                updateStepData={updateStepData}
              />
              <Stepper.Step label="CHOOSE A DESTINATION">
                {stepperLoading ? (
                  <SkeletonStep />
                ) : (
                  <Flex
                    display="inline-flex"
                    flexWrap="wrap"
                    alignItems="center"
                  >
                    <Text fontSize="l" fontWeight="semi_bold">
                      {destinationTitle}
                    </Text>
                    <Text fontSize="xxs" color={COLORS.BROTHER_BLUE} px="xs">
                      •
                    </Text>
                    <Text fontSize="s" pr="s">
                      {destinationCountry}
                    </Text>
                    <EditButton
                      onClick={() => {
                        updateStepData(
                          ({
                            originLocations: originLocationsStep,
                            destination: destinationStep,
                          }) => ({
                            originLocations: originLocationsStep,
                            destination: destinationStep,
                          }),
                          {
                            overwrite: true,
                          }
                        )
                      }}
                    />
                  </Flex>
                )}
              </Stepper.Step>
              <Stepper.Step label="Choose a venue" />
            </Stepper>
            <Flex flexDirection="column" ref={containerRef}>
              <FilterGroup
                outerPadding={LIST_PADDING}
                isSticky={isSticky}
                ref={filtersRef}
              >
                {maxTeamSize && (
                  <MaxTeamSize
                    isOpen={maxTeamSize === MIN_TEAM_SIZE}
                    venueTypes={venueTypes}
                    maxTeamSize={maxTeamSize}
                    defaultMaxTeamSize={MIN_TEAM_SIZE}
                    setUrlFilters={setUrlFilters}
                  />
                )}
                <PriceRange
                  minPriceLimit={priceMin}
                  maxPriceLimit={priceMax}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  getCurrencySymbol={getCurrencySymbol}
                  currencyIsoCode={currencyIsoCode}
                  setUrlFilters={setUrlFilters}
                />
                <MoreFilters
                  retreatType={retreatType}
                  isPromotedOnly={isPromotedOnly}
                  isMeetingRoomIncluded={isMeetingRoomIncluded}
                  maxTeamSize={maxTeamSize}
                  setUrlFilters={setUrlFilters}
                />
                <Button.Pill
                  isOutlined={areDatesSet}
                  onClick={
                    isDomesticDestination !== null ? openModal : undefined
                  }
                >
                  {areDatesSet
                    ? `${format(parseISO(dateFromUtc), 'MMM d')} - ${format(
                        parseISO(dateToUtc),
                        'MMM d'
                      )}`
                    : 'Select dates'}
                </Button.Pill>
                <Sorter
                  sortBy={sortBy}
                  innerLabel="Sort venues by:"
                  setUrlFilters={setUrlFilters}
                  travelTimeLabel="Distance from airport"
                />
              </FilterGroup>
              {loading ? (
                <SkeletonList />
              ) : (
                data && serverData?.length > 0 ? (
                  <>
                    <Box>
                      {serverData.map((venueData) => (
                        <Card
                          key={venueData.id}
                          onHover={setHoveredVenueId}
                          getDetailUrlByVenueId={getDetailUrlByVenueId}
                          venueTypes={venueTypes}
                          {...venueData}
                        />
                      ))}
                    </Box>
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
                          currentCount: serverData.length,
                        })}
                        mb={{ mobile: 's', desktop: 'l' }}
                      />
                    </Box>
                  </>
                ) : (
                  <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    backgroundImage={`url(${MapNextRetreatImg})`}
                    backgroundPosition="center"
                    backgroundSize="contain"
                    backgroundRepeat="no-repeat"
                    mt="40px"
                    pb="30px"
                  >
                    <img src={SignPostImg} width="50" alt="postImage" />
                    <Text
                      fontWeight="600"
                      fontSize="l"
                      mt="m"
                      mb="m"
                      lineHeight="1.2"
                    >
                      Sorry, no venues match your criteria
                    </Text>
                    <Text
                      fontWeight="400"
                      fontSize="s"
                      lineHeight="1.5"
                    >
                      We weren't able to find suitable venues within your criteria in {" "}
                      <Text
                        fontWeight="700"
                        fontSize="s"
                        lineHeight="1.5"
                      >
                        {destinationTitle}, {destinationCountry}
                      </Text>
                    </Text>
                    <Text
                      fontWeight="400"
                      fontSize="s"
                      lineHeight="1.5"
                    >
                      Try loosen your search criteria or try {" "}
                      <LinkText
                        text="another destination"
                        click={() => {
                          updateStepData(
                            ({
                               originLocations: originLocationsStep,
                               destination: destinationStep,
                             }) => ({
                              originLocations: originLocationsStep,
                              destination: destinationStep,
                            }),
                            {
                              overwrite: true,
                            }
                          )
                        }}
                      />
                    </Text>
                  </Flex>
                )
              )}
            </Flex>
          </Layout.List>
        }
        mapContent={
          <Layout.Map>
            {loading ? (
              <SkeletonMap />
            ) : (
              data && (
                <Map
                  venues={serverData}
                  airports={airportData}
                  hoveredVenueId={hoveredVenueId}
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
                  getDetailUrlByVenueId={getDetailUrlByVenueId}
                  isDomesticDestination={isDomesticDestination}
                />
              )
            )}
          </Layout.Map>
        }
      />
      {isDomesticDestination ? (
        <AvailabilityCalendarModal
          startDate={areDatesSet ? parseISO(dateFromUtc) : undefined}
          endDate={areDatesSet ? parseISO(dateToUtc) : undefined}
          isOpen={isOpen}
          closeModal={closeModal}
          onApply={({ startDate, endDate }) =>
            setUrlFilters({
              dateFromUtc:
                startDate && formatISO(startDate, { representation: 'date' }),
              dateToUtc:
                endDate && formatISO(endDate, { representation: 'date' }),
              page: 1,
            })
          }
        />
      ) : (
        <FlightGridModal
          isOpen={isOpen}
          toDate={dateToUtc}
          fromDate={dateFromUtc}
          closeModal={closeModal}
          setUrlFilters={(prevFilters) =>
            setUrlFilters({ ...prevFilters, page: 1 })
          }
          destination={String(destination.id)}
          originLocations={originLocations.map(({ id }) => id)}
        />
      )}
    </>
  )
}

Venues.propTypes = {
  stepData: PropTypes.object.isRequired,
  updateStepData: PropTypes.func.isRequired,
  getNextUrl: PropTypes.func.isRequired,
  onDestinationNameChange: PropTypes.func.isRequired,
}

export default Venues
