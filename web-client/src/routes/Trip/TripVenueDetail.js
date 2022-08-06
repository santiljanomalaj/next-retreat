import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import Carousel, { Modal, ModalGateway } from 'react-images'
import { rem, math } from 'polished'
import { COLORS, fontSizes, fontWeights, space, mq } from 'Theme'
import { format } from 'date-fns'
import { initializeArrayWithRange } from 'utils/helpers'
import Media from 'components/Media'
import Button from 'components/atoms/Button'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Rating from 'components/Rating'
import Climate from 'sharedComponents/Climate'
import { ReactComponent as Star } from 'assets/images/svg/rating-star.svg'
import IconText from './IconText'
import VenueImageSlider from './VenueImageSlider'
import arrowIcon from 'assets/images/svg/arrow-right-full.svg'

const MODAL_TOP_OFFSET = 30
const RATING_ICON_WIDTH = 100
const RATING_ICON_WIDTH_MOBILE = 50
const LEFT_COLUMN_WIDTH = 740
const TEMPERATURES = {
  C: 'C',
  F: 'F',
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

const SKAREDA_ZLTA = '#FCF6B1'

const VenuePriceContainer = styled(Flex)`
  background-color: ${SKAREDA_ZLTA};
  text-align:center;
  border-radius:4px;
`

const DAYS_OF_THE_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const VenuePriceBox = ({ details }) => {
  const { from,  to, nights, price } = details
  
  return (
    <Media>
      {(matches) => (
        <>
          {!matches.mobile && (
            <VenuePriceContainer my="l" p="s" >
              <Flex width="50%" justifyContent="space-between">
                <Flex flexDirection="column" p="m">
                  <Text as="p"
                    fontSize="s"
                  >{DAYS_OF_THE_WEEK[from.getDay()]}</Text>
                  <Text as="p"
                    fontSize="m"
                    fontWeight="semi_bold">{format(from, 'MMM d, yyyy')}</Text>
                </Flex>
                <Flex flexDirection="column" p="m">
                  <Text as="p"
                    fontSize="s">{nights} nights</Text>
                  <Text><img src={arrowIcon} alt="arrow"/></Text>
                </Flex>
                <Flex flexDirection="column" p="m">
                  <Text as="p"
                    fontSize="s">{DAYS_OF_THE_WEEK[to.getDay()]}</Text>
                  <Text as="p"
                    fontSize="m"
                    fontWeight="semi_bold">{format(to, 'MMM d, yyyy')}</Text>
                </Flex>
              </Flex>
              <Flex width="50%" justifyContent="space-between" style={{
                'border-left': `1px dashed ${COLORS.BLACK}`
              }}>
                <Flex flexDirection="column" p="m">
                  <Text as="p"
                    fontSize="s"
                  >Total price</Text>
                  <Text as="p"
                    fontSize="m"
                    fontWeight="semi_bold">{price} €</Text>
                </Flex>
                <Flex flexDirection="column" justifyContent="center" p="m" width="60%">
                  <Button.Primary isBlock>
                    Confirm Dates
                  </Button.Primary>
                </Flex>
              </Flex>
            </VenuePriceContainer>
          )}
          {matches.mobile && (
            <VenuePriceContainer my="s">
              <Flex flexDirection="column" width="100%">
                <Flex flexDirection="row" justifyContent="space-between">
                  <Flex flexDirection="column" p="m">
                    <Text as="p"
                      fontSize="s"
                    >{DAYS_OF_THE_WEEK[from.getDay()]}</Text>
                    <Text as="p"
                      fontSize="m"
                      fontWeight="semi_bold">{format(from, 'MMM d, yyyy')}</Text>
                  </Flex>
                  <Flex flexDirection="column" p="m">
                    <Text as="p"
                      fontSize="s"></Text>
                    <Text><img src={arrowIcon} alt="arrow"/></Text>
                  </Flex>
                  <Flex flexDirection="column" p="m">
                    <Text as="p"
                      fontSize="s">{DAYS_OF_THE_WEEK[to.getDay()]}</Text>
                    <Text as="p"
                      fontSize="m"
                      fontWeight="semi_bold">{format(to, 'MMM d, yyyy')}</Text>
                  </Flex>
                </Flex>
                <Flex flexDirection="column" style={{
                  'border-top': `1px dashed ${COLORS.BLACK}`
                }}>
                  <Flex p="m" justifyContent="space-between">
                    <Text as="p"
                      fontSize="s">{nights} nights</Text>
                    <Flex width="50%" justifyContent="space-between">
                      <Text as="p"
                        fontSize="s">Total price</Text>
                      <Text as="p"
                        fontSize="m" fontWeight="semi_bold">{price} €</Text>
                    </Flex>
                  </Flex>
                  <Button.Primary isBlock style={{
                    'border-top-left-radius' : '0px',
                    'border-top-right-radius' : '0px'
                  }}>
                    Confirm Dates
                  </Button.Primary>
                </Flex>
              </Flex>
            </VenuePriceContainer>
          )}
        </>
      )}
    </Media>
  )
}

const TripVenueDetail = ({ venueData, isProposal, variations = [] }) => {
  // const history = useHistory()
  const [temperature, setTemperature] = React.useState(TEMPERATURES.C)
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false)

  let venuePrices = variations.map(variation => {
    const venuePrice = (variation.prices || []).find(price => price.venueId === Number(venueData.id) && price.isAvailable)
    
    if (!venuePrice) return null
    return {
      from: new Date(variation.from),
      to: new Date(variation.to),
      pax: variation.pax,
      nights: Math.ceil(Math.abs((new Date(variation.to)).getTime() - (new Date(variation.from)).getTime()) / (1000 * 3600 * 24)),
      ...venuePrice
    }
  })
  venuePrices = venuePrices.filter(Boolean)

  const toggleLightbox = () => setIsLightboxOpen((prevOpen) => !prevOpen)

  const {
    type,
    title,
    rating,
    address,
    amenities,
    starRating,
    description,
    destination,
    numberOfRooms,
    thumbnailUrls,
    nearestAirports,
    isMeetingRoomIncluded,
    avgTemperaturesByMonth,
    capacity,
    houseRules: {
      checkIn,
      checkOut,
      cancellationDescription,
      roomTypeAssignmentDescription,
    },
  } = venueData

  const images = thumbnailUrls.map((thumbnailUrl) => ({ src: thumbnailUrl }))

  return (
    <Box>
      <VenueImage pictureUrl={thumbnailUrls[0]} onClick={toggleLightbox} />
      <Box m="0 auto">
        <Flex mx={{ mobile: 'm', tablet: 0 }}>
          <Box position="relative" width={{ mobile: '100%' }} mt="m">
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
                mobile: `calc(100vw - ${rem(RATING_ICON_WIDTH_MOBILE)} - ${space.m
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
            <Flex
              flexDirection={{ mobile: 'column-reverse', tablet: 'column' }}
            >
              <Flex flexDirection="column">
                <Box mt={{ mobile: 'm', tablet: 'xl' }}>
                  <IconText.Grid
                    numberOfRooms={numberOfRooms}
                    isMeetingRoomIncluded={isMeetingRoomIncluded}
                    capacity={capacity}
                  />
                </Box>
                {isProposal && (<Box mt={{ mobile: 'l', tablet: 'xl' }}>
                  <Text fontSize="xxl" fontWeight="semi_bold" color={COLORS.SPACE_CADET}>
                    Dates and prices
                  </Text>
                  {venuePrices.map((venuePrice, index) => (
                    <VenuePriceBox key={index} details={venuePrice} />
                  ))}
                </Box>)}
              </Flex>
              <Text
                as="p"
                fontSize="l"
                color={COLORS.DEEP_RESERVOIR}
                mt={{ mobile: 'm', tablet: 'xl' }}
              >
                {description}
              </Text>
            </Flex>
            <Box mt={{ mobile: 'l', tablet: 'xl' }}>
              <VenueImageSlider
                key={venueData.id}
                thumbnailUrls={thumbnailUrls}
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
            </Box>
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
            <Box my="xl" position="relative">
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
              {/* <VenueDetailButtonWrapper>
                <Box width={rem(280)}>
                  <Button.Primary
                    isBlock
                    onClick={() => {
                      history.push(
                        `/${ROUTES.PLAN}/?${queryString.stringify({
                          venue: JSON.stringify({ id: venueData.id }),
                          detail: null,
                        })}`
                      )
                    }}
                  >
                    Go to Venue detail
                  </Button.Primary>
                </Box>
              </VenueDetailButtonWrapper> */}
            </Box>
          </Box>
        </Flex>
      </Box>
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

TripVenueDetail.propTypes = {
  venueData: PropTypes.object.isRequired,
  isProposal: PropTypes.bool,
  variations: PropTypes.array
}

export default TripVenueDetail
