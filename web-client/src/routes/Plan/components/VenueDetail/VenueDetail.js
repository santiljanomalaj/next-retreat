import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { useQuery, useLazyQuery, gql } from '@apollo/client'
import Carousel, { Modal, ModalGateway } from 'react-images'
import { Element as ScrollTo } from 'react-scroll'
import { rem, math } from 'polished'
import { formatISO, parseISO } from 'date-fns'
import { CurrencyContext } from 'CurrencyProvider'
import { DomesticTravelContext } from 'DomesticTravelProvider'
import { useAuth } from 'AuthProvider'
import { useTripManagement, MODAL_TYPES } from 'TripManagementProvider'
import { COLORS, fontSizes, fontWeights, breakpoints, space, mq } from 'Theme'
import { initializeArrayWithRange } from 'utils/helpers'
import { getScrollName, scrollIntoView } from 'utils/scroll'
import Button from 'components/atoms/Button'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Rating from 'components/Rating'
import AvailabilityCalendar from 'sharedComponents/AvailabilityCalendar'
import Climate from 'sharedComponents/Climate'
import FlightGrid from 'sharedComponents/FlightGrid'
import { ReactComponent as Star } from 'assets/images/svg/rating-star.svg'
import heartIcon from 'assets/images/svg/heart.svg'
import commentBubbleIcon from 'assets/images/svg/comment-bubble-blue.svg'
import { ROOM_TYPE, CALENDAR } from './constants'
import BookVenue from './BookVenueForm'
import RoomType from './RoomType'
import Faq from './Faq'
import { data as faqData } from './faqData'
import ContactSupportBanner from './ContactSupportBanner'
import Slider from './ReviewSlider'
import IconText from './IconText'
import Map from './Map'
import SkeletonLoader from './SkeletonLoader'
import FormModal from '../Modal'
import {
  useGoogleTracking,
  GTM_EVENTS,
} from '../../../../hooks/useGoogleTracking'

const MODAL_TOP_OFFSET = 30
const RATING_ICON_WIDTH = 100
const RATING_ICON_WIDTH_MOBILE = 50
const LEFT_COLUMN_WIDTH = 740
const RIGHT_COLUMN_WIDTH = 370
const TEMPERATURES = {
  C: 'C',
  F: 'F',
}

const getSameRoomTypeIdFromRatePlanCode = (ratePlanCode) => {
  if (ratePlanCode.includes('BKG')) {
    return /BKG__([^_]+)_([^_]+)/.exec(ratePlanCode)[0]
  }
  return /^[^__]+/.exec(ratePlanCode)[0]
}

const StyledRating = styled(Rating.Large)`
  ${mq.to.tablet`
      width: ${rem(RATING_ICON_WIDTH_MOBILE)};
      height: ${rem(42)};
      font-size: ${fontSizes.l};
  `}
`

const VenueImage = styled('div')`
  height: ${rem(440)};
  width: 100%;
  cursor: pointer;
  ${({ pictureUrl }) =>
    `background: url("${pictureUrl}") center / cover no-repeat;`}
`

const StarIcon = styled(Star)`
  height: ${rem(24)};
`

const StarFlexContainer = styled(Flex)`
  svg:not(:last-child) {
    margin-right: ${space.xs};
  }
`

const RoomTypeContainer = styled('div')`
  > div:not(:first-child) {
    margin-top: ${space.m};
  }
`

const RULES_FONTSIZE = `
  font-size: ${fontSizes.l};
`

const TextRulesLeft = styled(Text)`
  ${RULES_FONTSIZE}
  font-weight: ${fontWeights.semi_bold};
  color: ${COLORS.SPACE_CADET};
`

const TextRulesRight = styled(Text)`
  ${RULES_FONTSIZE}
  color: ${COLORS.DEEP_RESERVOIR};
  margin-left: ${space.s};
`

const StyledBox = styled('div')`
  columns: ${rem(165)} auto;
  line-height: ${rem(25)};
`

const StyledIconImage = styled.img`
  width: ${rem(15)};
  height: auto;
  margin-right: ${space.s};
`

const StyledIconButton = styled(Button.Secondary)`
  padding: ${space.s} ${space.l};
`

const GET_VENUE_DETAIL = gql`
  query VenueDetail($input: VenueInput!) {
    venue(input: $input) {
      hotelidPpn
      type
      title
      rating
      coordinates {
        lat
        lon
      }
      nearestAirports {
        distanceInKilometers
        code
      }
      avgTemperaturesByMonth {
        month
        celsius
      }
      houseRules {
        checkIn
        checkOut
        cancellationDescription
        roomTypeAssignmentDescription
      }
      address
      amenities
      starRating
      description
      destination
      numberOfRooms
      thumbnailUrl
      thumbnailUrls
      isMeetingRoomIncluded
      capacity
    }
  }
`

const GET_DESTINATION_DATA = gql`
  query Destination($input: DestinationInput!) {
    destination(input: $input) {
      id # apollographql/apollo-client#2510
      airports {
        code
        coordinates {
          lat
          lon
        }
      }
    }
  }
`

const GET_ROOM_DATA = gql`
  query RoomTypes($input: VenueInput!) {
    venue(input: $input) {
      roomData {
        rooms {
          id
          title
          quantity
          description
          thumbnailUrls
          occupancyLimit
          boardType
          beddingData {
            bedType
            bedCount
          }
          total {
            amount
            currencyIsoCode
          }
          pricePerNight {
            amount
            currencyIsoCode
          }
          cancelationPolicy {
            isCancelable
            description
          }
          icon
        }
      }
    }
  }
`

const VenueDetail = ({ stepData, updateStepData, onVenueNameChange }) => {
  const history = useHistory()
  const { logGTMEvent } = useGoogleTracking()
  const { dateFromUtc, dateToUtc } = stepData.venue.filters ?? {}
  const {
    checkInDate = stepData.venue?.filters?.dateFromUtc,
    checkOutDate = stepData.venue?.filters?.dateToUtc,
    rooms = [],
  } = stepData?.detail ?? {}

  const { currency } = React.useContext(CurrencyContext)
  const { isDomesticDestination } = React.useContext(DomesticTravelContext)
  const [temperature, setTemperature] = React.useState(TEMPERATURES.C)
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth)

  const { openModal: openTripManagementModal } = useTripManagement()
  const { isSignedIn } = useAuth()

  const toggleLightbox = () => setIsLightboxOpen((prevOpen) => !prevOpen)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const setUrlFilters = React.useCallback(
    (nextFilters, replace) => {
      logGTMEvent({event : GTM_EVENTS.dateSelectedOnVenuePage, ...nextFilters, isDomestic: isDomesticDestination})
      updateStepData(
        ({ detail: prevDetail }) => ({
          detail: { ...prevDetail, ...nextFilters },
        }),
        { replace }
      )
    },
    [updateStepData, logGTMEvent, isDomesticDestination]
  )

  React.useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  React.useEffect(() => {
    if (
      dateFromUtc &&
      dateToUtc &&
      !stepData.detail?.checkInDate &&
      !stepData.detail?.checkOutDate
    ) {
      setUrlFilters(
        {
          checkInDate: dateFromUtc,
          checkOutDate: dateToUtc,
        },
        { replace: true }
      )
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (screenWidth >= parseFloat(breakpoints.desktop)) {
      setIsModalOpen(false)
    }
  }, [screenWidth])

  React.useEffect(() => {
    if (
      checkInDate &&
      checkOutDate &&
      screenWidth >= parseFloat(breakpoints.desktop)
    ) {
      scrollIntoView(getScrollName(ROOM_TYPE))
    }
  }, [checkInDate, checkOutDate, screenWidth])

  const venueId = Number(stepData.venue.id)

  const { loading, error, data } = useQuery(GET_VENUE_DETAIL, {
    variables: { input: { id: venueId } },
  })

  const {
    loading: destinationLoading,
    error: destinationError,
    data: destinationData,
  } = useQuery(GET_DESTINATION_DATA, {
    variables: {
      input: {
        id: stepData.destination?.id,
        originLocations: stepData.originLocations?.map(({ id }) => id),
      },
    },
    skip: !stepData.destination && !stepData.originLocations,
  })

  const [
    getRoomTypesData,
    { loading: roomTypesLoading, error: roomTypesError, data: roomTypesData },
  ] = useLazyQuery(GET_ROOM_DATA, {
    variables: {
      input: {
        id: Number(stepData.venue.id),
        dateToUtc: checkOutDate,
        dateFromUtc: checkInDate,
      },
    },
    context: {
      headers: {
        'currency-iso-code': currency,
        'room-parameters': JSON.stringify({
          maxTeamSize: stepData.venue.filters?.maxTeamSize,
          isSingleRoomsOnly: false, // Backward compatibility
        }),
      },
    },
    fetchPolicy: 'cache-and-network',
  })

  React.useEffect(() => {
    if (checkInDate && checkOutDate) {
      getRoomTypesData()
    }
  }, [checkInDate, checkOutDate, getRoomTypesData, currency])

  React.useEffect(() => {
    const title = data?.venue.title
    if (title) {
      onVenueNameChange(title)
    }
  }, [onVenueNameChange, data])

  React.useEffect(() => {
    logGTMEvent({
      event: GTM_EVENTS.venueSelected,
      data: { venueid: stepData.venue.id, title: data?.venue.title },
    })
  }, [logGTMEvent, stepData, data])

  if (loading || destinationLoading) {
    return <SkeletonLoader />
  }

  if (error) {
    return error.graphQLErrors.map(({ message }) => <div>{message}</div>)
  }

  if (destinationError) {
    history.push('/internal-server-error')
  }

  const {
    venue: {
      hotelidPpn,
      type,
      title,
      rating,
      address,
      amenities,
      starRating,
      coordinates,
      description,
      destination,
      numberOfRooms,
      thumbnailUrls,
      nearestAirports,
      isMeetingRoomIncluded,
      capacity,
      avgTemperaturesByMonth,
      houseRules: {
        checkIn,
        checkOut,
        cancellationDescription,
        roomTypeAssignmentDescription,
      },
    },
  } = data

  const airports = destinationData?.destination?.airports || []

  const roomData = roomTypesData?.venue?.roomData?.rooms ?? []
  const peopleToFit = rooms.reduce((accumulator, current) => {
    const selectedRoom = roomData.find(({ id }) => id === current.id)
    return accumulator + current.count * selectedRoom?.occupancyLimit ?? 0
  }, 0)
  const finalPrice = rooms.reduce((accumulator, current) => {
    const selectedRoom = roomData.find(({ id }) => id === current.id)
    return accumulator + current.count * selectedRoom?.total?.amount ?? 0
  }, 0)
  const roomsTotalCount = rooms.reduce(
    (accumulator, current) => accumulator + current.count,
    0
  )
  const sameRoomsTypeCounts = rooms.reduce(
    (accumulator, { id: longId, count }) => {
      const id = getSameRoomTypeIdFromRatePlanCode(longId)
      const roomIndex = accumulator.findIndex((room) => room.id === id)

      return roomIndex !== -1
        ? Object.assign(accumulator, {
            [roomIndex]: {
              id,
              count: count + accumulator[roomIndex].count,
            },
          })
        : [...accumulator, { id, count }]
    },
    []
  )
  const currencyIsoCode = roomData?.[0]?.pricePerNight?.currencyIsoCode

  const images = thumbnailUrls.map((thumbnailUrl) => ({ src: thumbnailUrl }))

  const bookVenueForm = (
    <BookVenue.Form
      venueId={venueId}
      price={finalPrice}
      closeModal={closeModal}
      peopleToFit={peopleToFit}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      roomsTotalCount={roomsTotalCount}
      currencyIsoCode={currencyIsoCode}
      onSubmit={() => updateStepData({ summary: null })}
    />
  )

  return (
    <Box>
      <VenueImage pictureUrl={thumbnailUrls[0]} onClick={toggleLightbox} />
      <Box
        maxWidth={{
          tablet: rem(LEFT_COLUMN_WIDTH),
          desktop: math(
            `${rem(LEFT_COLUMN_WIDTH)} + ${rem(RIGHT_COLUMN_WIDTH)} + ${
              space.l
            }`
          ),
        }}
        m="0 auto"
      >
        <Flex mx={{ mobile: 'm', tablet: 0, desktop: 'm' }}>
          <Box
            position="relative"
            width={{ mobile: '100%' }}
            mr={{ desktop: 'l' }}
            mt="m"
          >
            <Box
              position="absolute"
              right="0"
              top={{
                mobile: `-${rem(MODAL_TOP_OFFSET)}`,
                tablet: math(`-${space.m} - ${rem(MODAL_TOP_OFFSET)}`),
              }}
              mr={{ mobile: 'm', tablet: 0 }}
            >
              <StyledRating>{rating}</StyledRating>
            </Box>
            <Flex
              alignItems="baseline"
              flexWrap="wrap"
              maxWidth={{
                mobile: `calc(100vw - ${rem(RATING_ICON_WIDTH_MOBILE)} - ${
                  space.m
                } * 3)`,
                tablet: rem(LEFT_COLUMN_WIDTH - RATING_ICON_WIDTH),
              }}
            >
              <Text
                as="p"
                fontSize="xxxxl"
                fontWeight="bold"
                color={COLORS.SPACE_CADET}
                mr="m"
              >
                {title}
              </Text>
              <StarFlexContainer>
                {initializeArrayWithRange(starRating - 1).map((i) => (
                  <StarIcon key={i} />
                ))}
              </StarFlexContainer>
            </Flex>
            <Box mt="s">
              <Text
                fontSize="l"
                fontWeight="semi_bold"
                color={COLORS.SPACE_CADET}
              >
                {destination}
              </Text>
              <Text color={COLORS.BROTHER_BLUE} mx="s">
                •
              </Text>
              <Text fontSize="s" color={COLORS.DEEP_RESERVOIR}>
                {`${type.charAt(0)}${type.slice(1).toLowerCase()}`}
              </Text>
              <Text color={COLORS.BROTHER_BLUE} mx="s">
                •
              </Text>
              <Text fontSize="s" color={COLORS.DEEP_RESERVOIR}>
                {address}
              </Text>
            </Box>
            <Flex mt="m">
              {isSignedIn && (
                <StyledIconButton
                  onClick={() => {
                    openTripManagementModal({
                      type: MODAL_TYPES.ADD_VENUE_MODAL,
                      venueId,
                    })
                  }}
                >
                  <StyledIconImage src={heartIcon} alt="heartIcon" />
                  Save to Trip
                </StyledIconButton>
              )}
              <Box ml={isSignedIn ? 'm' : undefined}>
                <StyledIconButton
                  onClick={() => {
                    openTripManagementModal({
                      type: MODAL_TYPES.ASK_QUESTION_MODAL,
                      venueId,
                    })
                  }}
                >
                  <StyledIconImage
                    src={commentBubbleIcon}
                    alt="commentBubbleIcon"
                  />
                  Ask a Question
                </StyledIconButton>
              </Box>
            </Flex>
            <Box mt="xl">
              <IconText.Grid
                numberOfRooms={numberOfRooms}
                isMeetingRoomIncluded={isMeetingRoomIncluded}
                capacity={capacity}
              />
            </Box>
            <Text as="p" fontSize="l" color={COLORS.DEEP_RESERVOIR} mt="xl">
              {description}
            </Text>
            <Box mt="xl">
              <Text
                as="p"
                fontSize="xxl"
                fontWeight="semi_bold"
                color={COLORS.SPACE_CADET}
                mb="l"
              >
                Venue location & airports
              </Text>
              <Flex alignItems="center" flexWrap="wrap" mb="m">
                {nearestAirports.map(({ distanceInKilometers, code }, i) => (
                  <div key={code}>
                    <Text
                      fontSize="l"
                      fontWeight="bold"
                      color={COLORS.SPACE_CADET}
                    >
                      {code}
                    </Text>
                    <Text fontSize="l" color={COLORS.SPACE_CADET}>
                      {` ${Math.floor(distanceInKilometers)} km`}
                    </Text>
                    {i !== nearestAirports.length - 1 && (
                      <Text fontSize="l" color={COLORS.BROTHER_BLUE} mx="xs">
                        |
                      </Text>
                    )}
                  </div>
                ))}
              </Flex>
              <Map
                venueCoordinates={coordinates}
                airports={airports}
                isDomesticDestination={isDomesticDestination}
              />
            </Box>
            <ScrollTo name={getScrollName(CALENDAR)}>
              <Box mt="xl">
                {isDomesticDestination !== null &&
                  (isDomesticDestination ? (
                    <AvailabilityCalendar
                      startDate={
                        checkInDate ? parseISO(checkInDate) : undefined
                      }
                      endDate={
                        checkOutDate ? parseISO(checkOutDate) : undefined
                      }
                      closeModal={closeModal}
                      onApply={({ startDate, endDate }) => {
                        setUrlFilters({
                          checkInDate:
                            startDate &&
                            formatISO(startDate, { representation: 'date' }),
                          checkOutDate:
                            endDate &&
                            formatISO(endDate, { representation: 'date' }),
                        })
                      }}
                    />
                  ) : (
                    <FlightGrid
                      toDate={checkOutDate}
                      fromDate={checkInDate}
                      setUrlFilters={setUrlFilters}
                      destination={String(stepData.destination.id)}
                      originLocations={stepData.originLocations.map(
                        ({ id }) => id
                      )}
                    />
                  ))}
              </Box>
            </ScrollTo>
            {checkInDate && checkOutDate && (
              <ScrollTo name={getScrollName(ROOM_TYPE)}>
                <Box mt="xl">
                  <Text
                    as="p"
                    fontSize="xxl"
                    fontWeight="semi_bold"
                    color={COLORS.SPACE_CADET}
                    mb="l"
                  >
                    Room type
                  </Text>
                  {/* eslint-disable no-nested-ternary */}
                  {roomTypesError ? (
                    <div>Error occurred...</div>
                  ) : roomTypesLoading ? (
                    <RoomType.SkeletonLoader />
                  ) : roomData.length === 0 ? (
                    <div>
                      <p>
                        We are sorry. The selected venue or rooms are not
                        available on the selected dates.
                      </p>
                      <p>You can either:</p>
                      <ul>
                        <li>Try choosing a different date range</li>
                        <li>
                          Go back to the results page and search for another
                          venue
                        </li>
                        <li>
                          <a
                            css={`
                              color: ${COLORS.CHUN_LI_BLUE};
                            `}
                            href={`https://www.nextretreat.com/contact`}
                          >
                            Contact our team
                          </a>{' '}
                          who will help you find suitable dates and the venue
                          that matches your requirements
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <RoomTypeContainer>
                      {roomData.map(({ id, quantity, ...props }) => {
                        const { count = 0 } =
                          rooms.find((room) => room.id === id) ?? {}
                        const { count: sameRoomTypeCount = 0 } =
                          sameRoomsTypeCounts.find(
                            (room) =>
                              room.id === getSameRoomTypeIdFromRatePlanCode(id)
                          ) ?? {}

                        return (
                          <RoomType
                            key={id}
                            id={id}
                            count={count}
                            maxRoomsCount={count + quantity - sameRoomTypeCount}
                            updateStepData={updateStepData}
                            {...props}
                          />
                        )
                      })}
                    </RoomTypeContainer>
                  )}
                </Box>
              </ScrollTo>
            )}
            <Box mt="xl">
              <Flex alignItems="center" mb="l">
                <Text
                  as="p"
                  fontSize="xxl"
                  fontWeight="semi_bold"
                  color={COLORS.SPACE_CADET}
                  mr="m"
                >
                  Climate and weather
                </Text>
                <Button.Pill
                  onClick={() =>
                    setTemperature(
                      temperature === TEMPERATURES.C
                        ? TEMPERATURES.F
                        : TEMPERATURES.C
                    )
                  }
                >
                  {`°${temperature}`}
                </Button.Pill>
              </Flex>
              <Climate
                temperaturesToMonths={avgTemperaturesByMonth}
                isCelsius={temperature === TEMPERATURES.C}
                bubbleSize={rem(40)}
                justifyContent="space-between"
              />
            </Box>
            <Box mt="xl">
              <Text
                as="p"
                fontSize="xxl"
                fontWeight="semi_bold"
                color={COLORS.SPACE_CADET}
                mb="l"
              >
                Venue facilities
              </Text>
              <StyledBox>
                {amenities.map((amenity, i) => (
                  <Text
                    key={i}
                    as="p"
                    fontSize="s"
                    color={COLORS.DEEP_RESERVOIR}
                  >
                    {amenity}
                  </Text>
                ))}
              </StyledBox>
            </Box>
            <Box mt="xl">
              <Text
                as="p"
                fontSize="xxl"
                fontWeight="semi_bold"
                color={COLORS.SPACE_CADET}
                mb="l"
              >
                House rules
              </Text>
              <div>
                <TextRulesLeft>Check-in:</TextRulesLeft>
                <TextRulesRight>{checkIn}</TextRulesRight>
              </div>
              <div>
                <TextRulesLeft>Check-out:</TextRulesLeft>
                <TextRulesRight>{checkOut}</TextRulesRight>
              </div>
              <Box mt="s">
                <TextRulesLeft>Cancellation:</TextRulesLeft>
                <TextRulesRight>{cancellationDescription}</TextRulesRight>
              </Box>
              <Box mt="s">
                <TextRulesLeft>Room type assignment:</TextRulesLeft>
                <TextRulesRight
                  fontSize="l"
                  color={COLORS.DEEP_RESERVOIR}
                  ml="s"
                >
                  {roomTypeAssignmentDescription}
                </TextRulesRight>
              </Box>
            </Box>
          </Box>
          <Box display={{ mobile: 'none', desktop: 'block' }}>
            <Box
              position="sticky"
              mt={rem(-MODAL_TOP_OFFSET)}
              top={rem(MODAL_TOP_OFFSET * 2)}
            >
              {bookVenueForm}
            </Box>
          </Box>
        </Flex>
      </Box>
      <Box mb={rem(70)} overflow="hidden">
        <Box
          maxWidth={{
            tablet: rem(LEFT_COLUMN_WIDTH),
            desktop: math(
              `${rem(LEFT_COLUMN_WIDTH)} + ${rem(RIGHT_COLUMN_WIDTH)} + ${
                space.l
              }`
            ),
          }}
          m="0 auto"
        >
          <Box mx={{ mobile: 'm', tablet: 0, desktop: 'm' }}>
            <Box mt="xl">
              <Slider />
            </Box>
            <Box mt="xl">
              <Faq.Container>{faqData}</Faq.Container>
            </Box>
            <Box mt="xl">
              <ContactSupportBanner />
            </Box>
          </Box>
          <Text color={COLORS.LYNX_WHITE} fontSize="xxs">
            {hotelidPpn}
          </Text>
        </Box>
      </Box>
      <BookVenue.Panel
        price={finalPrice}
        onClick={openModal}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        currencyIsoCode={currencyIsoCode}
      />
      <FormModal isOpen={isModalOpen} closeModal={closeModal}>
        {bookVenueForm}
      </FormModal>
      <ModalGateway>
        {isLightboxOpen && (
          <Modal onClose={toggleLightbox}>
            <Carousel views={images} />
          </Modal>
        )}
      </ModalGateway>
    </Box>
  )
}

VenueDetail.propTypes = {
  stepData: PropTypes.object.isRequired,
  updateStepData: PropTypes.func.isRequired,
  onVenueNameChange: PropTypes.func.isRequired,
}

export default VenueDetail
