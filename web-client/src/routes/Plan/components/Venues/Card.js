import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { math, rem } from 'polished'
import { COLORS, BOXSHADOWS, space, mq } from 'Theme'
import { useDebouncedCallback } from 'use-debounce'
import { useAuth } from 'AuthProvider'
import { useTripManagement, MODAL_TYPES } from 'TripManagementProvider'
import { Box, Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Badge from 'components/Badge'
import Rating from 'components/Rating'
import RouterLink from 'sharedComponents/RouterLink'
import bedroomIcon from 'assets/images/svg/bedroom.svg'
import airplaneIcon from 'assets/images/svg/airplane.svg'
import personIcon from 'assets/images/svg/people.svg'
import heartIcon from 'assets/images/svg/heart.svg'
import heartFilledIcon from 'assets/images/svg/heart-filled.svg'
import { ReactComponent as LogoIcon } from 'assets/images/svg/logo-next-retreat-icon-inverted.svg'
import { formatPrice } from 'utils/money'
import IconText from './IconText'
import Slider from './Slider'

const SLIDER_WIDTH = rem(280)
const CARD_PADDING = space.m
const HEART_WIDTH = rem(19)
const HEART_HEIGHT = rem(17)

const LocationImage = styled('div')`
  height: ${rem(200)};
  ${mq.to.tablet`
    height: ${rem(320)};
  `}
  ${mq.from.tablet`
     width: ${SLIDER_WIDTH}
  `}
  ${({ src }) => `
     background: url("${src}") center / cover no-repeat;
  `}
`

const StyledFlex = styled(Flex)`
  width: 100%;
  min-height: ${rem(230)};
  background-color: ${COLORS.LYNX_WHITE};
  margin-bottom: ${space.m};
  padding: ${CARD_PADDING};

  &:first-child {
    margin-top: ${space.s};
  }

  ${mq.from.tablet`
    @media (hover: hover) {
      &:hover {
        box-shadow: ${BOXSHADOWS.CARD};
      }
    }
  `}
`

const StyledRouterLink = styled(RouterLink)`
  width: 100%;
`

const PromotedBadge = styled(Badge.Filled)`
  pointer-events: none;
  position: absolute;
  z-index: 1;

  margin-top: ${space.s};
  margin-left: -${math(`${CARD_PADDING} + ${space.xs}`)};
`

const StyledImg = styled.div`
  width: ${HEART_WIDTH};
  height: ${HEART_HEIGHT};
  ${({ isActive }) =>
    `background: url("${
      isActive ? heartFilledIcon : heartIcon
    }") center / ${HEART_WIDTH} ${HEART_HEIGHT} no-repeat;`};
  &:hover {
      background: url("${heartFilledIcon}") center / ${HEART_WIDTH} ${HEART_HEIGHT} no-repeat;
  }
`

const Card = ({
  id,
  type,
  title,
  price,
  priceTotal,
  venueTypes = [],
  rating,
  onHover,
  capacity,
  isPromoted,
  thumbnailUrl,
  thumbnailUrls,
  numberOfRooms,
  getDetailUrlByVenueId,
  isMeetingRoomIncluded,
  nearestAirport: { distanceInKilometers, code },
}) => {
  const { openModal, addedVenueIds, setAddedVenueIds } = useTripManagement()
  const { userTrips, isSignedIn } = useAuth()
  const [debouncedCallback] = useDebouncedCallback((value) => {
    onHover(value)
  }, 400)
  const isHouseOnly = venueTypes.length === 1 && venueTypes.includes('HOUSE')
  const isPriceDefined = (price ? price.amount : priceTotal.amount) > 0

  return (
    <StyledFlex
      onMouseEnter={() => debouncedCallback(id)}
      onMouseLeave={() => debouncedCallback(null)}
      flexDirection={{ mobile: 'column', tablet: 'row' }}
      ml={{ mobile: 0, tablet: 'auto' }}
    >
      <Slider
        id={id}
        slide={LocationImage}
        thumbnailUrls={[thumbnailUrl, ...thumbnailUrls]}
        sliderMaxWidth={{
          mobile: `calc(100vw - ${space.l})`,
          tablet: SLIDER_WIDTH,
        }}
        getDetailUrlByVenueId={getDetailUrlByVenueId}
      />
      <StyledRouterLink to={getDetailUrlByVenueId(id)} target="_blank">
        <Flex
          flex="1"
          flexDirection="column"
          justifyContent="space-between"
          ml={{ mobile: 0, tablet: 'm' }}
          height="100%"
        >
          <div>
            <Flex
              justifyContent="space-between"
              alignItems="flex-start"
              mt={{ mobile: 'm', tablet: 0 }}
            >
              <div>
                {type && (
                  <Badge isUppercase mr="s">
                    {type}
                  </Badge>
                )}
                {isMeetingRoomIncluded && <Badge>MEETING ROOM</Badge>}
              </div>
              <Rating>{rating}</Rating>
            </Flex>
            <Text
              display="inline-block"
              fontSize="l"
              fontWeight="bold"
              color={COLORS.SPACE_CADET}
              mt="xs"
            >
              {title}
            </Text>
            <Box mt="s" lineHeight="1.6">
              <IconText
                src={airplaneIcon}
                value={`${Math.floor(distanceInKilometers)} km`}
                text={`from ${code}`}
              />
              <Box mt="xs">
                <IconText
                  src={bedroomIcon}
                  value={numberOfRooms}
                  text={`${isHouseOnly ? 'unit' : 'room'}${
                    numberOfRooms > 1 ? 's' : ''
                  }`}
                />
              </Box>
              {capacity && (
                <Box mt="xs">
                  <IconText
                    src={personIcon}
                    value={capacity}
                    text={capacity > 1 ? 'people' : 'person'}
                  />
                </Box>
              )}
            </Box>
          </div>
          <Flex justifyContent="space-between" mt="m">
          {isPriceDefined && (
            <Text as="p" color={COLORS.BLUEBERRY_SODA} fontSize="xs">
              from
              <br />
              {isPriceDefined && (
                <>
                  <Text
                    verticalAlign="middle"
                    fontSize="m"
                    color={COLORS.DEEP_RESERVOIR}
                  >
                    {formatPrice({
                      value: Math.ceil(
                        price ? price.amount : priceTotal.amount
                      ),
                      currencyIsoCode: price
                        ? price.currencyIsoCode
                        : priceTotal.currencyIsoCode,
                      showCents: false,
                    })}
                  </Text>{' '}
                  <Text verticalAlign="middle">/ room / night</Text>
                </>
              )}
            </Text>
          )}
          {!isPriceDefined && <Text as="p" color={COLORS.BLUEBERRY_SODA} fontSize="xs"></Text>}
            {isSignedIn && (
              <Flex
                alignSelf="flex-end"
                onClick={(e) => {
                  e.preventDefault()
                  openModal({
                    type: MODAL_TYPES.ADD_VENUE_MODAL,
                    venueId: Number(id),
                    onSuccess: () =>
                      setAddedVenueIds((prevAddedVenueIds) => [
                        ...prevAddedVenueIds,
                        id,
                      ]),
                  })
                }}
              >
                <StyledImg
                  isActive={
                    addedVenueIds.includes(id) ||
                    userTrips.find((trip) =>
                      trip.tripVenues.find(
                        (tripVenue) => Number(tripVenue.venue.id) === Number(id)
                      )
                    )
                  }
                />
              </Flex>
            )}
          </Flex>
        </Flex>
      </StyledRouterLink>
      {isPromoted && (
        <PromotedBadge backgroundColor={COLORS.SOULSTONE_BLUE}>
          <LogoIcon />
          <Text ml="xs">CURATED</Text>
        </PromotedBadge>
      )}
    </StyledFlex>
  )
}

Card.propTypes = {
  isPromoted: PropTypes.bool,
  capacity: PropTypes.number,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onHover: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currencyIsoCode: PropTypes.string.isRequired,
  }),
  priceTotal: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currencyIsoCode: PropTypes.string.isRequired,
  }),
  rating: PropTypes.number.isRequired,
  numberOfRooms: PropTypes.number.isRequired,
  isMeetingRoomIncluded: PropTypes.bool.isRequired,
  nearestAirport: PropTypes.shape({
    distanceInKilometers: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
  }).isRequired,
  getDetailUrlByVenueId: PropTypes.func.isRequired,
  thumbnailUrls: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  venueTypes: PropTypes.arrayOf(PropTypes.string),
}

export default Card
