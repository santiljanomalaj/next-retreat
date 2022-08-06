import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Swiper from 'react-id-swiper'
import 'swiper/css/swiper.css'
import { Box } from 'components/atoms/Layout'
import RouterLink from 'sharedComponents/RouterLink'
import Button from 'components/atoms/Button'
import Slide from './Slide'

const StyledBox = styled(Box)`
  position: absolute;
  top: 0;
  transform: translateY(110%);
`

const swiperConfig = {
  observerUpdate: true,
  centeredSlides: true,
  spaceBetween: 5,
  grabCursor: true,
  breakpoints: {
    1024: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    640: {
      slidesPerView: 2.7,
      spaceBetween: 20,
    },
    370: {
      slidesPerView: 1.7,
      spaceBetween: 20,
    },
    320: {
      slidesPerView: 1.5,
      spaceBetween: 10,
    },
  },
}

const SLIDE_EVENT = 'slideChange'

const getSlideIndexIgnoringButtons = ({
  index,
  nextPage,
  currentPage,
  destinationsLength,
}) => {
  if (currentPage > 1 && nextPage) {
    if (index === 0 || index === 1) {
      return 0
    }
    if (index === destinationsLength + 1) {
      return destinationsLength - 1
    }
    return index - 1
  }
  if (currentPage > 1) {
    if (index === 0 || index === 1) {
      return 0
    }
    return index - 1
  }
  if (nextPage) {
    if (index === destinationsLength) {
      return destinationsLength - 1
    }
  }
  return index
}

const Slider = ({
  onSwipe,
  nextPage,
  currentPage,
  previousPage,
  destinations,
  setActivePage,
  originLocations,
  swipedDestinationId,
  getVenueUrlByDestinationId,
}) => {
  const [swiper, setSwiper] = React.useState(null)
  const [currentIndex, updateCurrentIndex] = React.useState(0)
  const updateIndex = React.useCallback(
    () => updateCurrentIndex(swiper.realIndex),
    [swiper]
  )
  const handlePrevClick = () => setActivePage(previousPage)
  const handleNextClick = () => setActivePage(nextPage)

  React.useEffect(() => {
    if (swiper !== null) {
      swiper.on(SLIDE_EVENT, updateIndex)
    }
    return () => {
      if (swiper !== null) {
        swiper.off(SLIDE_EVENT, updateIndex)
      }
    }
  }, [swiper, updateIndex])

  React.useEffect(() => {
    onSwipe(
      destinations[
        getSlideIndexIgnoringButtons({
          nextPage,
          currentPage,
          index: currentIndex,
          destinationsLength: destinations.length,
        })
      ].id
    )
  }, [currentIndex, currentPage, destinations, nextPage, onSwipe])

  const selectedDestinationIndex = destinations.findIndex(
    ({ id }) => id === swipedDestinationId
  )

  React.useEffect(() => {
    if (swiper !== null) {
      swiper.slideTo(
        currentPage > 1
          ? selectedDestinationIndex + 1
          : selectedDestinationIndex
      )
    }
  }, [currentPage, selectedDestinationIndex, swiper])

  return (
    <Box position="absolute" bottom="5%" right="0" width="100%">
      <Swiper getSwiper={setSwiper} {...swiperConfig}>
        {currentPage > 1 ? (
          <Box position="relative">
            <StyledBox left="l">
              <Button.Secondary onClick={handlePrevClick}>
                Show previous 10 destinations
              </Button.Secondary>
            </StyledBox>
          </Box>
        ) : (
          [] // Swiper doesn't accept null, undefined, false, true - renders them and breaks down
        )}
        {destinations.map((destination) => (
          <RouterLink
            key={destination.id}
            to={getVenueUrlByDestinationId(destination.id)}
          >
            <div>
              <Slide originLocations={originLocations} {...destination} />
            </div>
          </RouterLink>
        ))}
        {nextPage ? (
          <Box position="relative">
            <StyledBox left="0">
              <Button.Secondary onClick={handleNextClick}>
                Show next 10 destinations
              </Button.Secondary>
            </StyledBox>
          </Box>
        ) : (
          []
        )}
      </Swiper>
    </Box>
  )
}

Slider.propTypes = {
  destinations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
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
    })
  ).isRequired,
  onSwipe: PropTypes.func.isRequired,
  swipedDestinationId: PropTypes.string,
  previousPage: PropTypes.number,
  nextPage: PropTypes.number,
  currentPage: PropTypes.number.isRequired,
  setActivePage: PropTypes.func.isRequired,
  originLocations: PropTypes.array.isRequired,
  getVenueUrlByDestinationId: PropTypes.func.isRequired,
}

export default Slider
