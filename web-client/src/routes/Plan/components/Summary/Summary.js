import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useQuery, gql } from '@apollo/client'
import Carousel, { Modal, ModalGateway } from 'react-images'
import { format, parseISO } from 'date-fns'
import { rem, math } from 'polished'
import { CurrencyContext } from 'CurrencyProvider'
import { COLORS, space, radius, fontSizes, fontWeights } from 'Theme'
import { initializeArrayWithRange } from 'utils/helpers'
import { formatPrice } from 'utils/money'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import { ReactComponent as Star } from 'assets/images/svg/star-summary.svg'
import { getNumberOfNightsByDates } from 'utils/getNumberOfNightsByDates'
import Button from 'components/atoms/Button'
import Stepper from './Stepper'
import Map from './Map'
import BookingDetail from './BookingDetail'
import BookingForm from './BookingForm'
import BookingSummary from './BookingSummary'
import SelectedServices from './SelectedServices'
import SkeletonLoader from './SkeletonLoader'
import {
  useGoogleTracking,
  GTM_EVENTS,
} from '../../../../hooks/useGoogleTracking'

const CONTAINER_WIDTH = rem(450)
const SUCCESS_MESSAGE_WIDTH = rem(680)

const VenueImage = styled('div')`
  height: ${rem(240)};
  min-width: 100%;
  cursor: pointer;
  border-radius: ${radius.s};
  ${({ pictureUrl }) =>
    `background: url("${pictureUrl}") center / cover no-repeat;`};
`

const DecorativeBox = styled('div')`
  z-index: -1;
  position: absolute;
  width: 100vw;
  height: 100%;
  top: 0;
  left: 50%;
  right: 50%;
  transform: translateX(-50%);
  background-color: ${COLORS.BRILLIANCE};
  border-bottom: 1px solid ${COLORS.COLD_MORNING};
`

const StarIcon = styled(Star)`
  height: ${rem(18)};
`

const BookingDetailContainer = styled('div')`
  > div:not(:first-child) {
    margin-top: ${space.m};
  }
  margin-top: calc(${space.s} + ${space.m});
`
const TotalPriceBox = styled('div')`
  position: relative;
  padding: ${space.m} 0 calc(${space.m} + ${space.s});
  border-bottom: 1px solid ${COLORS.BROTHER_BLUE};
`

const DecorativeLine = styled('div')`
  position: absolute;
  bottom: ${space.xs};
  width: 100%;
  height: 1px;
  background-color: ${COLORS.IRRADIANT_IRIS};
`

const BorderFlex = styled(Flex)`
  justify-content: space-between;
  padding-bottom: ${space.m};
  border-bottom: 1px solid ${COLORS.IRRADIANT_IRIS};
`

const DatesContainer = styled('div')`
  > div:not(:first-child) {
    margin-top: ${space.m};
  }
  margin-top: calc(${space.l} + ${space.m});
`

const StyledSpan = styled('span')`
  white-space: nowrap;
  font-size: ${fontSizes.l};
  font-weight: ${fontWeights.semi_bold};
  color: ${COLORS.SPACE_CADET};
  margin-right: ${space.m};
`

const TextType = styled(Text)`
  display: inline-block;
  font-size: ${fontSizes.s};
  color: ${COLORS.DEEP_RESERVOIR};
  text-transform: lowercase;
  :first-letter {
    text-transform: uppercase;
  }
`

const GET_VENUE_DETAIL = gql`
  query VenueDetail($input: VenueInput!) {
    venue(input: $input) {
      type
      title
      address
      starRating
      destination
      hotelidPpn
      thumbnailUrls
      country
      coordinates {
        lat
        lon
      }
      houseRules {
        checkIn
        checkOut
      }
      taxesData
      roomData {
        rooms {
          id
          title
          quantity
          description
          thumbnailUrls
          occupancyLimit
          boardType
          pricePerNight {
            amount
            currencyIsoCode
          }
          resortFee {
            amount
            currencyIsoCode
          }
          cancelationPolicy {
            isCancelable
            description
          }
          icon
          subtotalSum {
            amount
            currencyIsoCode
          }
          taxesAndFeesSum {
            amount
            currencyIsoCode
          }
          totalSum {
            amount
            currencyIsoCode
          }
        }
        totalPrice {
          amount
          currencyIsoCode
        }
        totalTaxesAndFees {
          amount
          currencyIsoCode
        }
        totalResortFees {
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
      id
      name
      coordinates {
        lat
        lon
      }
    }
    destination(input: $input) {
      id
      title
      country
      coordinates {
        lat
        lon
      }
      availableOriginLocationIds
    }
  }
`

const Summary = ({ stepData, updateStepData }) => {
  const history = useHistory()
  const { logGTMEvent } = useGoogleTracking()
  const { checkInDate, checkOutDate, rooms } = stepData.detail
  const { bookingId, additionalServices, userCommentary } =
    stepData?.summary ?? {}

  const { currency } = React.useContext(CurrencyContext)
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false)
  const toggleLightbox = () => setIsLightboxOpen((prevOpen) => !prevOpen)

  const { refetch: venueQueryRefetch, ...venueQuery } = useQuery(
    GET_VENUE_DETAIL,
    {
      variables: {
        input: {
          id: Number(stepData.venue.id),
          dateToUtc: checkOutDate,
          dateFromUtc: checkInDate,
          roomIdsWithCounts: rooms,
        },
      },
      context: {
        headers: {
          'currency-iso-code': currency,
        },
      },
      fetchPolicy: 'cache-and-network',
    }
  )

  React.useEffect(() => {
    venueQueryRefetch()
  }, [currency, venueQueryRefetch])

  React.useEffect(() => {
    if (!venueQuery.error && !venueQuery.loading 
      && stepData && bookingId && additionalServices && checkInDate && checkOutDate && rooms) {

      logGTMEvent({
        event: GTM_EVENTS.requestToBookForm,
        bookingId,
        additionalServices,
        checkInDate,
        checkOutDate,
        rooms: rooms.map(({ id: roomId, count }) => {
          const room = venueQuery.data.venue.roomData.rooms.find(
            (selectedVenueRoom) => roomId === selectedVenueRoom.id
          )
          const {
            id,
            title,
            boardType,
            pricePerNight,
            resortFee,
            occupancyLimit,
            cancelationPolicy,
            taxesAndFeesSum,
            subtotalSum,
            totalSum,
          } = room
          return {
            id,
            quantity: Number.parseInt(count),
            title,
            boardType,
            pricePerNight,
            resortFee,
            occupancyLimit,
            cancelationPolicy,
            taxesAndFeesSum,
            subtotalSum,
            totalSum,
          }
        }),
        venueid: stepData.venue.id,
      })
    }

  }, [venueQuery, logGTMEvent, stepData, bookingId, additionalServices, checkInDate, checkOutDate, rooms])

  const stepperQuery = useQuery(GET_STEPPER_DATA, {
    variables: {
      input: {
        id: stepData.destination?.id,
        originLocations: stepData.originLocations?.map(({ id }) => id),
      },
      filter: {
        ids: stepData.originLocations?.map(({ id }) => id),
        selectedOriginLocations: [],
      },
    },
    skip: !stepData.destination && !stepData.originLocations,
  })

  if (venueQuery.loading || stepperQuery.loading) {
    return <SkeletonLoader />
  }
  
  if (venueQuery.error || stepperQuery.error) {
    history.push('/internal-server-error')
  }

  const { venue: selectedVenue } = venueQuery.data

  const selectedOriginLocations = stepperQuery.data?.originLocations || []
  const selectedDestination = stepperQuery.data?.destination || {
    title: venueQuery.data?.venue.destination,
    coordinates: venueQuery.data?.venue.coordinates,
    country: venueQuery.data?.venue.country,
  }

  const images = selectedVenue.thumbnailUrls.map((thumbnailUrl) => ({
    src: thumbnailUrl,
  }))
  const totalNumberOfNights = getNumberOfNightsByDates(
    checkInDate,
    checkOutDate
  )
  const maxTeamSize = rooms.reduce((accumulator, current) => {
    const selectedRoom = selectedVenue.roomData.rooms.find(
      ({ id }) => id === current.id
    )
    return accumulator + current.count * selectedRoom.occupancyLimit
  }, 0)
  const totalRoomCount = rooms.reduce(
    (accumulator, current) => accumulator + current.count,
    0
  )

  const { currencyIsoCode } = selectedVenue.roomData.rooms[0].pricePerNight

  const originLocationNames = selectedOriginLocations?.map(({ name }) => name)

  const selectedRooms = rooms.map(({ id: roomId, count }) => {
    const room = selectedVenue.roomData.rooms.find(
      (selectedVenueRoom) => roomId === selectedVenueRoom.id
    )
    const {
      id,
      title,
      boardType,
      pricePerNight,
      resortFee,
      occupancyLimit,
      cancelationPolicy,
      taxesAndFeesSum,
      subtotalSum,
      totalSum,
    } = room
    return {
      id,
      quantity: Number.parseInt(count),
      title,
      boardType,
      pricePerNight,
      resortFee,
      occupancyLimit,
      cancelationPolicy,
      taxesAndFeesSum,
      subtotalSum,
      totalSum,
    }
  })

  return (
    <Box mx="auto" maxWidth={rem('1120px')}>
      <Flex flexDirection="column" alignItems="center">
        <div>
          <Box
            position="relative"
            maxWidth="100vw"
            p={`${space.m} ${space.m} ${math(`${space.m} + ${space.l}`)} ${space.m
              }`}
          >
            <Button.Back
              onClick={() => {
                updateStepData(
                  ({ originLocations, destination, venue, detail }) => ({
                    originLocations,
                    destination,
                    venue,
                    detail,
                  }),
                  {
                    overwrite: true,
                  }
                )
              }}
            >
              Back to venue selection
            </Button.Back>
            <Text
              as="p"
              fontSize="xxxxl"
              fontWeight="bold"
              color={COLORS.SPACE_CADET}
              my="l"
            >
              {`Your team trip to ${selectedVenue.title}, ${selectedVenue.destination}`}
            </Text>
            <Stepper
              originLocations={originLocationNames}
              destinationCountry={selectedDestination.country}
              destinationCity={selectedDestination.title}
              venueTitle={selectedVenue.title}
            />
            <DecorativeBox />
          </Box>
          <Box mx="m" mt={math(`${space.xs} + ${space.l}`)} mb="l">
            <Box m="0 auto">
              <Flex justifyContent="center">
                {bookingId && (
                  <Box
                    flex="1"
                    maxWidth={{ desktop: SUCCESS_MESSAGE_WIDTH }}
                    mb={math(`${space.xl} + ${space.l}`)}
                    mr={{ mobile: 0, desktop: 'm' }}
                  >
                    <BookingSummary bookingNumber={bookingId} />
                  </Box>
                )}
                <Box flex={{ desktop: '1' }} maxWidth={CONTAINER_WIDTH} />
              </Flex>
              <Flex justifyContent="center">
                <Box flex="1" mr={{ mobile: 0, desktop: 'm' }}>
                  <VenueImage
                    pictureUrl={selectedVenue.thumbnailUrls[0]}
                    onClick={toggleLightbox}
                  />
                  <Flex alignItems="baseline" flexWrap="wrap" mt="m">
                    <Text
                      as="p"
                      fontSize="xxl"
                      fontWeight="bold"
                      color={COLORS.SPACE_CADET}
                      mr="m"
                    >
                      {selectedVenue.title}
                    </Text>
                    <Flex>
                      {initializeArrayWithRange(
                        selectedVenue.starRating - 1
                      ).map((i) => (
                        <StarIcon key={i} />
                      ))}
                    </Flex>
                  </Flex>
                  <Text
                    fontSize="s"
                    fontWeight="semi_bold"
                    color={COLORS.SPACE_CADET}
                  >
                    {selectedVenue.destination}
                  </Text>
                  <Text color={COLORS.BROTHER_BLUE} mx="s">
                    •
                  </Text>
                  <TextType as="p">{selectedVenue.type}</TextType>
                  <Text color={COLORS.BROTHER_BLUE} mx="s">
                    •
                  </Text>
                  <Text fontSize="s" color={COLORS.DEEP_RESERVOIR}>
                    {selectedVenue.address}
                  </Text>
                  <DatesContainer>
                    <BorderFlex>
                      <StyledSpan>Arrival</StyledSpan>
                      <Text as="p" fontSize="l" textAlign="right">
                        <Text color={COLORS.SPACE_CADET}>
                          {format(parseISO(checkInDate), 'MMM d, yyyy')}
                        </Text>
                        <Text
                          color={COLORS.BLUEBERRY_SODA}
                          display="inline-block"
                          ml="xs"
                        >
                          {selectedVenue.houseRules.checkIn}
                        </Text>
                      </Text>
                    </BorderFlex>
                    <BorderFlex>
                      <StyledSpan>Departure</StyledSpan>
                      <Text as="p" fontSize="l" textAlign="right">
                        <Text color={COLORS.SPACE_CADET}>
                          {format(parseISO(checkOutDate), 'MMM d, yyyy')}
                        </Text>
                        <Text
                          color={COLORS.BLUEBERRY_SODA}
                          display="inline-block"
                          ml="xs"
                        >
                          {selectedVenue.houseRules.checkOut}
                        </Text>
                      </Text>
                    </BorderFlex>
                    <BorderFlex>
                      <Text
                        fontSize="l"
                        fontWeight="semi_bold"
                        color={COLORS.SPACE_CADET}
                      >
                        Duration
                      </Text>
                      <Text fontSize="l" color={COLORS.SPACE_CADET}>
                        {`${totalNumberOfNights} ${totalNumberOfNights > 1 ? 'nights' : 'night'
                          }`}
                      </Text>
                    </BorderFlex>
                  </DatesContainer>
                  <Flex justifyContent="space-between" mt="m">
                    <Text
                      fontSize="l"
                      fontWeight="semi_bold"
                      color={COLORS.SPACE_CADET}
                    >
                      Booking details
                    </Text>
                    <div>
                      <Text fontSize="l" color={COLORS.SPACE_CADET}>
                        {totalRoomCount}
                        {` ${totalRoomCount > 1 ? 'rooms' : 'room'} `}
                      </Text>
                      <Text fontSize="l" color={COLORS.BLUEBERRY_SODA}>
                        {`(max ${maxTeamSize} ${maxTeamSize > 1 ? 'people' : 'person'
                          })`}
                      </Text>
                    </div>
                  </Flex>
                  <BookingDetailContainer>
                    {rooms.map(({ id, count }) => {
                      const selectedRoom = selectedVenue.roomData.rooms.find(
                        (room) => room.id === id
                      )
                      const {
                        icon,
                        pricePerNight,
                        resortFee,
                        occupancyLimit,
                        title: roomTitle,
                        cancelationPolicy,
                        boardType,
                        taxesAndFeesSum,
                        subtotalSum,
                        totalSum,
                      } = selectedRoom
                      return (
                        <BookingDetail
                          key={id}
                          icon={icon}
                          pricePerNight={pricePerNight}
                          taxesAndFees={taxesAndFeesSum}
                          resortFee={resortFee}
                          subtotal={subtotalSum}
                          total={totalSum}
                          quantity={count}
                          title={roomTitle}
                          occupancyLimit={occupancyLimit}
                          cancelationPolicy={cancelationPolicy}
                          numberOfNights={totalNumberOfNights}
                          taxesData={selectedVenue.taxesData}
                          boardType={boardType}
                        />
                      )
                    })}
                  </BookingDetailContainer>
                  <TotalPriceBox>
                    <Flex justifyContent="space-between">
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color={COLORS.SPACE_CADET}
                      >
                        Total booking price
                      </Text>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color={COLORS.SPACE_CADET}
                      >
                        {formatPrice({
                          value: selectedVenue.roomData.totalPrice.amount,
                          currencyIsoCode,
                        })}
                      </Text>
                    </Flex>
                    <Box maxWidth={CONTAINER_WIDTH} mt="s">
                      <Text fontSize="xs" color={COLORS.BLUEBERRY_SODA}>
                        {`Price includes accommodation in ${totalRoomCount} ${totalRoomCount > 1 ? 'rooms' : 'room'
                          } in ${selectedVenue.title
                          }. Price does not include flight tickets or any
                        other services. Meeting room price is not included.`}
                      </Text>
                    </Box>
                    <DecorativeLine />
                  </TotalPriceBox>
                  <Box mt="l">
                    {!bookingId ? (
                      <BookingForm
                        stepData={stepData}
                        updateStepData={updateStepData}
                        totalPrice={selectedVenue.roomData.totalPrice.amount}
                        totalTaxesAndFees={
                          selectedVenue.roomData.totalTaxesAndFees.amount
                        }
                        totalResortFees={
                          selectedVenue.roomData.totalResortFees.amount
                        }
                        maxTeamSize={maxTeamSize}
                        venue={{
                          title: selectedVenue.title,
                          hotelidPpn: selectedVenue.hotelidPpn,
                          roomData: selectedRooms,
                        }}
                      />
                    ) : (
                      <SelectedServices
                        note={userCommentary}
                        services={additionalServices}
                      />
                    )}
                  </Box>
                </Box>
                <Box
                  display={{ mobile: 'none', desktop: 'block' }}
                  width={CONTAINER_WIDTH}
                >
                  <Map
                    destination={selectedDestination}
                    originLocations={selectedOriginLocations}
                  />
                </Box>
              </Flex>
            </Box>
          </Box>
        </div>
      </Flex>
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

Summary.propTypes = {
  stepData: PropTypes.shape({
    detail: PropTypes.shape({
      checkInDate: PropTypes.string.isRequired,
      checkOutDate: PropTypes.string.isRequired,
      rooms: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          count: PropTypes.number.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
    venue: PropTypes.shape({
      id: PropTypes.string.isRequired,
      filters: PropTypes.shape({
        maxTeamSize: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
    destination: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    originLocations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
      }).isRequired
    ).isRequired,
    summary: PropTypes.shape({
      additionalServices: PropTypes.arrayOf(PropTypes.string),
      bookingId: PropTypes.number,
      userCommentary: PropTypes.string,
    }),
  }).isRequired,
  updateStepData: PropTypes.func.isRequired,
}

export default Summary
