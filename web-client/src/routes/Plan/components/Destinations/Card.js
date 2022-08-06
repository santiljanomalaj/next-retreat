import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { space as styledSpace } from 'styled-system'
import { cover, rem } from 'polished'
import { space, COLORS, radius, fontSizes, fontWeights } from 'Theme'
import { convertMinutesToHours } from 'utils/helpers'
import { Text } from 'components/atoms/Typography'
import { Flex, Box } from 'components/atoms/Layout'
import Media, { queries } from 'components/Media'
import Badge from 'components/Badge'
import Climate from 'sharedComponents/Climate'
import Tooltip from 'components/molecules/Tooltip'
import { ReactComponent as Airplane } from 'assets/images/svg/airplane-carousel.svg'
import { ReactComponent as Car } from 'assets/images/svg/car.svg'
import mountainsIcon from 'assets/images/svg/mountainous.svg'
import sunIcon from 'assets/images/svg/sunny.svg'
import cityIcon from 'assets/images/svg/city.svg'
import { formatPrice } from 'utils/money'
import { TRAVEL_TYPES } from './constants'
import Flights from "./Flights/Flights"

const CARD_PADDING_VALUE = 'm'
const DOMESTIC_BORDER_WIDTH = '4px'

const IconPlane = styled(Airplane)`
  width: ${rem(14)};
`

const StyledText = styled('span')`
  white-space: nowrap;
  font-size: ${fontSizes.l};
  color: ${COLORS.SPACE_CADET};
  margin-right: ${space.s};
`

const IconText = ({ time, price, hasFlight, hasDriving }) => (
  <Flex alignItems="center">
    {hasDriving && <Car />}
    {hasDriving && hasFlight && (
      <Text mx="s" color={COLORS.BROTHER_BLUE}>
        •
      </Text>
    )}
    {hasFlight && <IconPlane />}
    <StyledText>
      <Text pl="xs" fontWeight="semi_bold">
        {`${convertMinutesToHours(time)} `}
      </Text>
      <Text fontSize="xs" fontWeight="normal">
        h
      </Text>
      {!hasDriving && hasFlight && (
        <>
          <Text
            fontSize="xs"
            fontWeight="normal"
            color={COLORS.BLUEBERRY_SODA}
            pl="xxs"
          >
            <Text fontSize="l" color={COLORS.BROTHER_BLUE}>
              {' '}
              /{' '}
            </Text>
          </Text>{' '}
          {formatPrice({
            value: Math.ceil(price.amount),
            currencyIsoCode: price.currencyIsoCode,
            showCents: false,
          })}
        </>
      )}
    </StyledText>
    {!hasDriving && hasFlight && (
      <Tooltip
        onClick={(e) => {
          e.preventDefault()
        }}
        text="Average price for a return ticket per person"
        maxWidth={rem(150)}
      />
    )}
  </Flex>
)

IconText.propTypes = {
  time: PropTypes.number.isRequired,
  hasFlight: PropTypes.bool.isRequired,
  hasDriving: PropTypes.bool.isRequired,
  price: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currencyIsoCode: PropTypes.string.isRequired,
  }).isRequired,
}

const DestinationImage = styled('div')`
  ${({ pictureUrl }) =>
    `background: url("${pictureUrl}") center / cover no-repeat;`}
  height: ${rem(200)};
  border-radius: ${radius.m} ${radius.m} 0 0;
`

const IconType = styled('img')`
  height: ${rem(26)};
  ${styledSpace}
`

const ICON_BY_TYPE = {
  BEACH: sunIcon,
  MOUNTAINS: mountainsIcon,
  CITY: cityIcon,
}

const StyledBox = styled(Box)`
  position: relative;

  border-radius: ${radius.m};
`

const DomesticTravelFrame = styled('div')`
  ${cover()}

  user-select: none;
  pointer-events: none;

  box-shadow: inset 0 0 0 ${DOMESTIC_BORDER_WIDTH} ${COLORS.CERULEAN};
  border-radius: ${radius.m};

  ${({ label }) => `
    &::after {
      content: '${label}';

      position: absolute;
      bottom: calc(100% - ${DOMESTIC_BORDER_WIDTH});

      padding: ${DOMESTIC_BORDER_WIDTH};

      font-size: ${fontSizes.xxs};
      font-weight: ${fontWeights.semi_bold};
      line-height: 1;

      border-radius: ${radius.s} ${radius.s} 0 0;
      background-color: ${COLORS.CERULEAN};
      color: ${COLORS.WHITE};
    }
  `}
`

const StyledClimate = styled(Climate)`
  margin: 0 -${space[CARD_PADDING_VALUE]};

  &::before,
  &::after {
    content: '';

    width: ${space[CARD_PADDING_VALUE]};
    flex: none;
  }
`


const Card = ({
  types,
  title,
  country,
  avgPrice,
  isCelsius,
  pictureUrl,
  isDomestic,
  kiwiCityId,
  description,
  originLocations,
  travelDurations,
  avgTravelTimeInMinutes,
  avgTemperaturesByMonth,
  availableOriginLocationIds,
  stepData,
  ...props
}) => {
  const allTeamsCount = originLocations.length
  const availableTeamsCount = availableOriginLocationIds.length


  return (
    <Media queries={queries}>
      {(matches) => (
        <StyledBox bg={COLORS.LYNX_WHITE} {...props}>
          <Box position="relative">
            <DestinationImage pictureUrl={pictureUrl} />
            <Box position="absolute" top={rem(16)} right={rem(16)}>
              {allTeamsCount === availableTeamsCount || isDomestic ? (
                <Badge.Success>WORKS FOR ALL TEAM MEMBERS!</Badge.Success>
              ) : (
                <Badge.Filled>
                  {`${availableTeamsCount} OF ${allTeamsCount} TEAMS OK`}
                </Badge.Filled>
              )}
            </Box>
            <Flex
              alignItems="center"
              position="absolute"
              bottom={rem(-10)}
              left={rem(16)}
            >
              {types.map((type) => (
                <IconType key={type} src={ICON_BY_TYPE[type]} mr="xxs" />
              ))}
            </Flex>
          </Box>
          <Box px={space[CARD_PADDING_VALUE]} mt="s">
            <Flex
              flexDirection={{ mobile: 'column', desktop: 'row' }}
              justifyContent={{ mobile: 'flex-start', desktop: 'space-between' }}
              alignItems="baseline"
            >
              <Box mb={{ mobile: 's', desktop: 0 }}>
                <Text
                  fontSize="l"
                  fontWeight="semi_bold"
                  color={COLORS.SPACE_CADET}
                >
                  {title}
                </Text>
                <Text color={COLORS.BROTHER_BLUE} mx="s">
                  •
                </Text>
                <Text fontSize="s" color={COLORS.SPACE_CADET}>
                  {country}
                </Text>
              </Box>
              <IconText
                hasFlight={travelDurations.some(
                  ({ type }) => type === TRAVEL_TYPES.FLIGHT
                )}
                hasDriving={travelDurations.some(
                  ({ type }) => type === TRAVEL_TYPES.DRIVING
                )}
                price={avgPrice}
                time={avgTravelTimeInMinutes}
              />
            </Flex>
            {(!isDomestic && !(!matches.mobile && !matches.tablet)) && <Box pb="m" pt="s">
              <Flights travelDurations={travelDurations} stepData={stepData} kiwiCityId={kiwiCityId}></Flights>
            </Box>
            }
            <Text
              as="p"
              textAlign="left"
              fontSize="s"
              color={COLORS.DEEP_RESERVOIR}
              my="s"
            >
              {description}
            </Text>
            <Box pb="m" pt="s">
              <StyledClimate
                temperaturesToMonths={avgTemperaturesByMonth}
                isCelsius={isCelsius}
              />
            </Box>
            {(!isDomestic && (!matches.mobile && !matches.tablet)) && <Box pb="m" pt="s">
              <Flights travelDurations={travelDurations} stepData={stepData}></Flights>
            </Box>
            }
          </Box>
          {(isDomestic) && <DomesticTravelFrame label="DOMESTIC TRAVEL" />}
        </StyledBox>
      )}
    </Media>

  )
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  isCelsius: PropTypes.bool.isRequired,
  travelDurations: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired
  ),
  avgPrice: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currencyIsoCode: PropTypes.string.isRequired,
  }).isRequired,
  isDomestic: PropTypes.bool.isRequired,
  pictureUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  originLocations: PropTypes.array.isRequired,
  avgTravelTimeInMinutes: PropTypes.number.isRequired,
  types: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  avgTemperaturesByMonth: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      celsius: PropTypes.number.isRequired,
    }).isRequired
  ).isRequired,
  availableOriginLocationIds: PropTypes.arrayOf(PropTypes.string.isRequired)
    .isRequired,
  stepData: PropTypes.object.isRequired,
}

export default Card
