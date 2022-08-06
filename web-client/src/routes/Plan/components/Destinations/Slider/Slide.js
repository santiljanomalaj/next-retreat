import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { space } from 'styled-system'
import { rem } from 'polished'
import { COLORS, fontSizes, fontWeights, radius, BOXSHADOWS } from 'Theme'
import { Box, Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import { convertMinutesToHours } from 'utils/helpers'
import { ReactComponent as Airplane } from 'assets/images/svg/airplane-carousel.svg'
import { ReactComponent as Car } from 'assets/images/svg/car.svg'
import mountainsIcon from 'assets/images/svg/mountainous.svg'
import sunIcon from 'assets/images/svg/sunny.svg'
import cityIcon from 'assets/images/svg/city.svg'
import { formatPrice } from 'utils/money'
import { TRAVEL_TYPES } from '../constants'

const IconType = styled('img')`
  height: ${rem(20)};
  ${space}
`

const IconPlane = styled(Airplane)`
  width: ${rem(13)};
`

const IconCar = styled(Car)`
  width: ${rem(13)};
`

const IconText = ({ time, price, hasFlight, hasDriving }) => (
  <Flex alignItems="center">
    {hasDriving && <IconCar />}
    {hasDriving && hasFlight && (
      <Text mx="xs" color={COLORS.BROTHER_BLUE}>
        •
      </Text>
    )}
    {hasFlight && <IconPlane />}
    <Text pl="xs" fontSize="s" color={COLORS.SPACE_CADET}>
      {`${convertMinutesToHours(time)} h `}
      {!hasDriving && hasFlight && (
        <>
          <Text color={COLORS.BLUEBERRY_SODA} pl="xxs">
            / from
          </Text>{' '}
          {formatPrice({
            value: price.amount,
            currencyIsoCode: price.currencyIsoCode,
            showCents: false,
          })}{' '}
        </>
      )}
    </Text>
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

const StyledBox = styled('div')`
  width: ${rem(250)};
  box-shadow: ${BOXSHADOWS.CARD};
  border-radius: ${radius.m} ${radius.s};
  margin-top: ${rem(20)};
  margin-bottom: ${rem(5)};
`
const IMAGE_HEIGHT = rem(65)

const LocationImage = styled('img')`
  object-fit: cover;
  width: ${rem(90)};
  height: ${IMAGE_HEIGHT};
  border-top-left-radius: ${radius.m};
`

const StyledText = styled(Text)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: ${fontSizes.xs};
  color: ${COLORS.SPACE_CADET};
`

const StyledFlexBottom = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${rem(20)};
  border-radius: 0 0 ${radius.s} ${radius.s};
  font-size: ${fontSizes.xs};
  font-weight: ${fontWeights.semi_bold};
  color: ${COLORS.WHITE};
  background-color: ${COLORS.BLUEBERRY_SODA};
  background-color: ${({ areAllTeamsAvailable }) =>
    areAllTeamsAvailable ? COLORS.EXPLORATION_GREEN : COLORS.BLUEBERRY_SODA};
`

const StyledBoxInfo = styled(Box)`
  overflow: hidden;
  width: 100%;
  height: ${IMAGE_HEIGHT};
  background-color: ${COLORS.WHITE};
  border-top-right-radius: ${radius.m};
`

const ICON_BY_TYPE = {
  BEACH: sunIcon,
  MOUNTAINS: mountainsIcon,
  CITY: cityIcon,
}

const Slide = ({
  title,
  types,
  country,
  avgPrice,
  pictureUrl,
  isDomestic,
  originLocations,
  travelDurations,
  avgTravelTimeInMinutes,
  availableOriginLocationIds,
}) => {
  const allTeams = originLocations.length
  const availableTeams = isDomestic
    ? allTeams
    : availableOriginLocationIds.length
  return (
    <StyledBox>
      <Flex position="relative">
        <LocationImage src={pictureUrl} />
        <StyledBoxInfo pl="s" pt="xs">
          <StyledText as="p" fontWeight="semi_bold">
            {title}
          </StyledText>
          <StyledText as="p" color={COLORS.SPACE_CADET} mr="xxs">
            {country}
          </StyledText>
          <IconText
            time={avgTravelTimeInMinutes}
            price={avgPrice}
            hasFlight={travelDurations.some(
              ({ type }) => type === TRAVEL_TYPES.FLIGHT
            )}
            hasDriving={travelDurations.some(
              ({ type }) => type === TRAVEL_TYPES.DRIVING
            )}
          />
        </StyledBoxInfo>
        <Flex
          alignItems="center"
          position="absolute"
          top={rem(-10)}
          right={rem(5)}
        >
          {types.map((type) => (
            <IconType key={type} src={ICON_BY_TYPE[type]} mr="xxs" />
          ))}
        </Flex>
      </Flex>
      <StyledFlexBottom areAllTeamsAvailable={availableTeams === allTeams}>
        {`${availableTeams} OF ${allTeams} TEAMS OK`}
      </StyledFlexBottom>
    </StyledBox>
  )
}
Slide.propTypes = {
  title: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  isDomestic: PropTypes.bool.isRequired,
  travelDurations: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired
  ),
  avgPrice: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currencyIsoCode: PropTypes.string.isRequired,
  }).isRequired,
  pictureUrl: PropTypes.string.isRequired,
  avgTravelTimeInMinutes: PropTypes.number.isRequired,
  originLocations: PropTypes.array.isRequired,
  types: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  availableOriginLocationIds: PropTypes.arrayOf(PropTypes.string.isRequired)
    .isRequired,
}

export default Slide
