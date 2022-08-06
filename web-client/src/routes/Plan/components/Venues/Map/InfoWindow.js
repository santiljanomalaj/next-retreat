import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { rem } from 'polished'
import { Text } from 'components/atoms/Typography'
import { Flex, Box } from 'components/atoms/Layout'
import { COLORS } from 'Theme'
import bedroomIcon from 'assets/images/svg/bedroom.svg'
import airplaneIcon from 'assets/images/svg/airplane.svg'
import Slider from '../Slider'

const MAX_WIDTH = rem(240)

const LocationImage = styled('img')`
  object-fit: cover;
  height: ${rem(200)};
  width: 100%;
`

const Icon = styled('img')`
  display: inline-block;
  width: ${rem(13)};
`

const TextWithIcon = ({ src, value, text, ...rest }) => (
  <Flex alignItems="center" {...rest}>
    <Icon src={src} />
    <Text color={COLORS.SPACE_CADET} fontSize="xs" ml="xs">
      {value}{' '}
      <span
        css={`
          color: ${COLORS.BLUEBERRY_SODA};
        `}
      >
        {text}
      </span>
    </Text>
  </Flex>
)

TextWithIcon.propTypes = {
  src: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  text: PropTypes.string.isRequired,
}

const InfoWindow = ({
  id,
  title,
  thumbnailUrls,
  numberOfRooms,
  getDetailUrlByVenueId,
  nearestAirport: { distanceInKilometers, code },
}) => (
  <Box maxWidth={MAX_WIDTH}>
    <Slider
      id={id}
      slide={LocationImage}
      sliderMaxWidth={MAX_WIDTH}
      thumbnailUrls={thumbnailUrls}
      getDetailUrlByVenueId={getDetailUrlByVenueId}
    />
    <Box m="m">
      <Text
        display="block"
        fontSize="l"
        fontWeight="semi_bold"
        color={COLORS.SPACE_CADET}
        my="s"
      >
        {title}
      </Text>
      <TextWithIcon
        src={bedroomIcon}
        value={`${numberOfRooms}`}
        text={numberOfRooms > 1 ? 'rooms' : 'room'}
        mb="s"
      />
      <TextWithIcon
        src={airplaneIcon}
        value={`${Math.floor(distanceInKilometers)} km`}
        text={`from ${code}`}
      />
    </Box>
  </Box>
)

InfoWindow.propTypes = {
  id: PropTypes.string.isRequired,
  nearestAirport: PropTypes.shape({
    distanceInKilometers: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  numberOfRooms: PropTypes.number.isRequired,
  getDetailUrlByVenueId: PropTypes.func.isRequired,
  thumbnailUrls: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

export default InfoWindow
