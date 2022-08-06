import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { rem, math, rgba } from 'polished'
import { toast } from 'react-toastify'
import { space, COLORS, radius, mq } from 'Theme'
import Page from 'sharedComponents/Page'
import Media from 'components/Media'
import { Text } from 'components/atoms/Typography'
import { Flex, Box } from 'components/atoms/Layout'
import { TOPBAR_HEIGHT } from 'constants/style'
import { requireDynamicFlag } from 'utils/flags'
import tentCircleIcon from 'assets/images/svg/tent-circle.svg'
import TripVenue from '../Trip/TripVenue'
import TripVenueDetail from '../Trip/TripVenueDetail'
import Map from '../Trip/Map'
import SkeletonLoader from '../Trip/SkeletonLoader'
import VenueSlider from '../Trip/VenueSlider'

const LEFT_COLUMN_WIDTH = 366
const RIGHT_COLUMN_WIDTH = 744
const NUMBER_WIDTH = 20

const StyledVenuesContainer = styled(Box)`
  position: sticky;
  top: ${TOPBAR_HEIGHT};
  border: 1px solid ${COLORS.IRRADIANT_IRIS};
  border-radius: ${radius.m};
`

const StyledFlagImage = styled.img`
  height: ${rem(14)};
  margin-right: ${space.xs};
`

const TripImage = styled('div')`
  height: ${rem(340)};
  width: 100%;
  cursor: default;
  position: relative;
  ${({ pictureUrl }) =>
    `background: linear-gradient(0deg, ${rgba(
      COLORS.BLACK,
      0.5
    )} 16.43%, ${rgba(
      COLORS.BLACK,
      0
    )} 57.36%), url("${pictureUrl}") center / cover no-repeat;`}
  ${mq.to.desktop`
    height: ${rem(200)}
    padding: ${space.m}
  `}
`

const StyledDot = styled.span`
  height: ${rem(4)};
  width: ${rem(4)};
  background-color: ${COLORS.WHITE};
  border-radius: 50%;
  display: inline-block;
  margin: 0 ${space.m};
`

const GET_TRIP_DETAIL = gql`
  query TripDetail($input: TripInput!) {
    trip(input: $input) {
      id
      name
      userId
      shareToken
      tripVenues {
        id
        venue {
          id
          thumbnailUrls
          title
          destination
          countryCode
          country
          hotelidPpn
          type
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
          numberOfRooms
          isMeetingRoomIncluded
          capacity
        }
      }
    }
  }
`

const venueSortFunction = (tripVenue1, tripVenue2) => {
  const { venue: venue1 } = tripVenue1
  const { venue: venue2 } = tripVenue2
  if (venue1.countryCode === venue2.countryCode) {
    if (venue1.destination === venue2.destination) {
      return tripVenue1.id - tripVenue2.id
    }
    return venue1.destination > venue2.destination ? 1 : -1
  }
  return venue1.countryCode > venue2.countryCode ? 1 : -1
}

const TripShared = () => {
  const history = useHistory()
  const params = useParams()
  const [activeVenue, setActiveVenue] = React.useState(null)

  const { shareToken } = params
  const id = Number(params.id)

  const { data, loading } = useQuery(GET_TRIP_DETAIL, {
    variables: { input: { id, shareToken } },
    onError: () => {
      history.push(``)
    },
    onCompleted: (resultData) => {
      if (resultData?.trip?.tripVenues.length) {
        setActiveVenue(
          [...resultData.trip.tripVenues].sort(venueSortFunction)[0].venue
        )
      }
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  })

  const trip = data?.trip

  const sortedTripVenues = React.useMemo(
    () => [...(trip?.tripVenues || [])].sort(venueSortFunction),
    [trip]
  )

  const tripVenuesByDestination = React.useMemo(
    () =>
      sortedTripVenues.reduce((acc, item, index) => {
        const { venue } = item
        const venueDestinationKey = `${venue.countryCode}-${venue.destination}`
        return {
          ...acc,
          [venueDestinationKey]: {
            destination: venue.destination,
            countryCode: venue.countryCode,
            country: venue.country,
            tripVenues: [
              ...(acc?.[venueDestinationKey]?.tripVenues || []),
              { ...item, destinationMapKey: index + 1 },
            ],
          },
        }
      }, {}),
    [sortedTripVenues]
  )

  React.useEffect(() => {
    if (trip && !trip.tripVenues.length) {
      history.push(``)
      toast.info(
        'Trip has no venues, please add venues to trip to visit trip page.'
      )
    }
  }, [history, trip])

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    <Media>
      {(matches) => (
        <Page loginRequired={false}>
          <Helmet titleTemplate="NextRetreat | %s" title={trip?.name} />
          <TripImage
            pictureUrl={
              sortedTripVenues?.find(
                (tripVenue) => tripVenue.venue.thumbnailUrls.length
              )?.venue.thumbnailUrls[0]
            }
          >
            <Box
              position="relative"
              maxWidth={{
                desktop: math(
                  `${rem(LEFT_COLUMN_WIDTH)} + ${rem(RIGHT_COLUMN_WIDTH)} + ${
                    space.l
                  }`
                ),
              }}
              m="0 auto"
              width="100%"
              height="100%"
            >
              <Box
                position="absolute"
                bottom={{ mobile: 0, desktop: 'xl' }}
                width="100%"
              >
                <Text
                  as="p"
                  color={COLORS.WHITE}
                  fontSize="xxs"
                  fontWeight="semi_bold"
                  display={{ mobile: 'none', desktop: 'initial' }}
                >
                  TRIP DETAILS
                </Text>
                {trip && (
                  <>
                    <Flex py="s" alignItems="center">
                      <Text
                        as="p"
                        color={COLORS.WHITE}
                        fontSize={{ mobile: 'xl', desktop: 'xxxxl' }}
                        fontWeight="bold"
                        mr="m"
                        maxWidth={{ mobile: '80%', desktop: 'initial' }}
                      >
                        {trip.name}
                      </Text>
                    </Flex>
                    <Flex alignItems="center">
                      <Text
                        color={COLORS.WHITE}
                        fontSize="l"
                        fontWeight="semi_bold"
                      >
                        {`${
                          Object.keys(tripVenuesByDestination).length
                        } destination${
                          Object.keys(tripVenuesByDestination).length !== 1
                            ? 's'
                            : ''
                        }`}
                      </Text>
                      <StyledDot />
                      <Text color={COLORS.WHITE} fontSize="m">
                        {`${trip.tripVenues.length} venue${
                          trip.tripVenues.length !== 1 ? 's' : ''
                        }`}
                      </Text>
                    </Flex>
                  </>
                )}
              </Box>
            </Box>
          </TripImage>
          <Box
            maxWidth={{
              desktop: math(
                `${rem(LEFT_COLUMN_WIDTH)} + ${rem(RIGHT_COLUMN_WIDTH)} + ${
                  space.l
                }`
              ),
            }}
            m="0 auto"
          >
            <Box
              height={{ mobile: rem(240), desktop: rem(320) }}
              mt={{ mobile: 0, desktop:  `-${space.l}` }}
            >
              <Map
                venues={sortedTripVenues.map((tripVenue) => tripVenue.venue)}
                activeVenueId={activeVenue?.id}
                setActiveVenue={setActiveVenue}
              />
            </Box>
            <Box
              display={{ desktop: 'none' }}
              ml="s"
              mt={space.l}
            >
              <VenueSlider
                activeVenueId={activeVenue?.id}
                setActiveVenue={setActiveVenue}
                tripVenues={sortedTripVenues}
                onRemoveButtonClick={undefined}
              />
            </Box>
            <Flex my="l">
              <Box
                display={{ mobile: 'none', desktop: 'block' }}
                maxWidth={{
                  desktop: rem(LEFT_COLUMN_WIDTH),
                }}
                width="100%"
                mr="l"
              >
                <StyledVenuesContainer pb="l">
                  <Text
                    as="p"
                    fontSize="l"
                    fontWeight="semi_bold"
                    mt="m"
                    mb="l"
                    ml={math(`${space.m} + ${rem(NUMBER_WIDTH / 2)}`)}
                  >
                    Venue shortlist
                  </Text>

                  {Object.values(tripVenuesByDestination).map(
                    (tripVenueDestination) => (
                      <React.Fragment key={tripVenueDestination.countryCode}>
                        <Flex
                          alignItems="center"
                          m="m"
                          ml={math(`${space.m} + ${rem(NUMBER_WIDTH / 2)}`)}
                        >
                          <StyledFlagImage
                            src={requireDynamicFlag(
                              tripVenueDestination.countryCode
                            )}
                            alt={tripVenueDestination.countryCode}
                          />
                          <Text>{`${tripVenueDestination.destination}, ${tripVenueDestination.country}`}</Text>
                        </Flex>
                        {tripVenueDestination.tripVenues.map((tripVenue) => (
                          <TripVenue
                            key={tripVenue.id}
                            onClick={() => setActiveVenue(tripVenue.venue)}
                            onActionIconClick={undefined}
                            text={tripVenue.venue.title}
                            imageSrc={
                              tripVenue.venue.thumbnailUrls[0] || tentCircleIcon
                            }
                            actionIconSrc={undefined}
                            number={tripVenue.destinationMapKey}
                            isActive={activeVenue?.id === tripVenue.venue.id}
                          />
                        ))}
                      </React.Fragment>
                    )
                  )}
                </StyledVenuesContainer>
              </Box>
              <Box
                width="100%"
                maxWidth={{
                  desktop: rem(RIGHT_COLUMN_WIDTH),
                }}
              >
                {activeVenue && <TripVenueDetail venueData={activeVenue} />}
              </Box>
            </Flex>
          </Box>
        </Page>
      )}
    </Media>
  )
}

export default TripShared
