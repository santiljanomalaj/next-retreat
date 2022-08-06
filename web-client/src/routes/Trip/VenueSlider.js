import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Swiper from 'react-id-swiper'
import 'swiper/css/swiper.css'
import { rem } from 'polished'
import { COLORS, BOXSHADOWS, radius, space } from 'Theme'
import { requireDynamicFlag } from 'utils/flags'
import { Box, Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import xmarkIcon from 'assets/images/svg/xmark-bold.svg'

const NUMBER_SIZE = 22
export const SLIDE_HEIGHT = 86
const REMOVE_BUTTON_SIZE = rem(11)

const SliderCardWrapper = styled(Flex)`
  position: relative;
  background: ${COLORS.WHITE};
  box-shadow: ${BOXSHADOWS.CARD};
  border-radius: ${radius.m};
`

const LocationImage = styled('div')`
  width: 90px;
  height: ${SLIDE_HEIGHT}px;
  border-radius: ${radius.m};
  ${({ src }) => `
     background: url("${src}") center / cover no-repeat;
  `}
`

const StyledFlagImage = styled.img`
  height: ${rem(12)};
  margin-right: ${space.xs};
`

const StyledNumberWrapper = styled(Flex)`
  justify-content: center;
  align-items: center;
  position: absolute;
  width: ${rem(NUMBER_SIZE)};
  height: ${rem(NUMBER_SIZE)};
  background: ${COLORS.CHUN_LI_BLUE};
  border-radius: 50%;
  top: 0;
  bottom: 0;
  transform: translateX(-50%);
  margin-top: auto;
  margin-bottom: auto;
`

const SliderWrapper = styled.div`
  .swiper-slide {
    height: 95px;
  }
`
const RemoveButton = styled('button')`
  position: absolute;
  right: ${space.m};
  top: ${space.m};
`

const StyledCloseImage = styled.img`
  display: block;
  height: ${REMOVE_BUTTON_SIZE};
  width: ${REMOVE_BUTTON_SIZE};
`

const params = {
  observerUpdate: true,
  observer: true,
  slidesPerView: 1.2,
  spaceBetween: 15,
  grabCursor: true,
}

const SLIDE_EVENT = 'snapIndexChange'

const VenueSlider = ({
  tripVenues,
  activeVenueId,
  setActiveVenue,
  onRemoveButtonClick,
}) => {
  const swiperRef = React.useRef(null)

  const updateActiveVenue = React.useCallback(() => {
    if (swiperRef.current !== null && swiperRef.current.snapIndex >= 0) {
      setActiveVenue(tripVenues[swiperRef.current.snapIndex].venue)
    }
  }, [setActiveVenue, swiperRef, tripVenues])

  React.useEffect(() => {
    if (swiperRef.current !== null) {
      swiperRef.current.slideTo(
        tripVenues.findIndex(
          (tripVenue) => tripVenue.venue.id === activeVenueId
        )
      )
    }
  }, [swiperRef, activeVenueId, tripVenues])

  React.useEffect(() => {
    let timeout
    if (swiperRef.current !== null) {
      timeout = setTimeout(() => swiperRef.current.update(), 500)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [swiperRef]) // fixing first opening not loaded

  React.useEffect(() => {
    if (swiperRef.current !== null) {
      swiperRef.current.on(SLIDE_EVENT, updateActiveVenue)
    }
    return () => {
      if (swiperRef.current !== null) {
        swiperRef.current.off(SLIDE_EVENT, updateActiveVenue)
      }
    }
  }, [swiperRef, updateActiveVenue])

  return (
    <Box maxWidth="100%" position="relative">
      <SliderWrapper>
        <Swiper
          getSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          {...params}
        >
          {tripVenues.map(({ id: tripVenueId, venue }, index) => (
            <div key={venue.id} height="100px">
              <SliderCardWrapper
                width="250px"
                height={`${SLIDE_HEIGHT}px`}
                ml="10px"
              >
                <Box position="relative">
                  <StyledNumberWrapper>
                    <Text fontSize="s" color={COLORS.WHITE}>
                      {index + 1}
                    </Text>
                  </StyledNumberWrapper>
                  <LocationImage src={venue.thumbnailUrls[0]} />
                </Box>
                <Flex
                  mx="s"
                  flexDirection="column"
                  my="m"
                  justifyContent="space-between"
                >
                  <Text fontWeight="semi_bold" fontSize="xs">
                    {venue.title}
                  </Text>
                  <Flex alignItems="center">
                    <StyledFlagImage
                      src={requireDynamicFlag(venue.countryCode)}
                      alt={venue.countryCode}
                    />
                    <Text fontSize="xs">{`${venue.destination}, ${venue.country}`}</Text>
                  </Flex>
                </Flex>
                {onRemoveButtonClick && <RemoveButton
                  type="button"
                  onClick={() => onRemoveButtonClick(tripVenueId)}
                >
                  <StyledCloseImage src={xmarkIcon} alt="" />
                </RemoveButton>}
              </SliderCardWrapper>
            </div>
          ))}
        </Swiper>
      </SliderWrapper>
    </Box>
  )
}

VenueSlider.propTypes = {
  tripVenues: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  activeVenueId: PropTypes.string,
  setActiveVenue: PropTypes.func.isRequired,
  onRemoveButtonClick: PropTypes.func,
}

export default VenueSlider
