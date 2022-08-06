import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Swiper from 'react-id-swiper'
import 'swiper/css/swiper.css'
import { rem } from 'polished'
import { COLORS, BOXSHADOWS, radius, space, BORDER_WIDTH } from 'Theme'
import { Box, Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import arrowIcon from 'assets/images/svg/arrow-carousel.svg'

const DIRECTIONS = {
  LEFT: `transform: rotate(0deg);`,
  RIGHT: `transform: rotate(180deg);`,
}

const SIZE = rem(32)

const LocationImage = styled('div')`
  width: ${rem(550)};
  height: ${rem(280)};
  border-radius: ${radius.m};
  ${({ src }) => `
     background: url("${src}") center / cover no-repeat;
  `}
`

const ArrowImg = styled('img')`
  height: ${rem(12)};
  ${({ direction }) => DIRECTIONS[direction]}
`

const Button = styled('button')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${SIZE};
  height: ${SIZE};
  border: ${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS};
  border-radius: ${radius.circle};
  background-color: ${COLORS.WHITE};
  box-shadow: ${BOXSHADOWS.DARK};
  margin-left: ${space.s};
`

const ArrowButton = ({ onClick, direction }) => (
  <Button onClick={onClick}>
    <ArrowImg src={arrowIcon} direction={direction} />
  </Button>
)

ArrowButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  direction: PropTypes.string,
}

const SliderWrapper = styled.div`
  .swiper-container {
    border-radius: ${radius.m};
  }
  .swiper-pagination-bullet {
    opacity: 0.6;
    background: ${COLORS.WHITE};
  }
  .swiper-pagination-bullet-active {
    background: ${COLORS.WHITE};
    opacity: 0.9;
  }
`

const params = {
  observerUpdate: true,
  observer: true,
  loop: true,
  slidesPerView: 1,
  spaceBetween: 10,
  grabCursor: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },
  breakpoints: {
    768: { slidesPerView: 1.35, spaceBetween: 20 },
  },
}

const VenueImageSlider = ({ thumbnailUrls }) => {
  const [swiper, setSwiper] = React.useState(null)
  React.useEffect(() => {
    let timeout
    if (swiper !== null) {
      timeout = setTimeout(() => swiper.update(), 500)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [swiper]) // fixing first opening not loaded
  const handleNextClick = () => {
    if (swiper !== null) {
      swiper.slideNext()
    }
  }
  const handlePreviousClick = () => {
    if (swiper !== null) {
      swiper.slidePrev()
    }
  }
  return (
    <Box maxWidth="100%" position="relative">
      <Flex justifyContent="space-between" alignItems="center" mb="l">
        <Text fontSize="xxl" fontWeight="semi_bold" color={COLORS.SPACE_CADET}>
          More photos
        </Text>
        <Flex>
          <ArrowButton onClick={() => handlePreviousClick()} direction="LEFT" />
          <ArrowButton
            onClick={() => handleNextClick()}
            isRotated
            direction="RIGHT"
          />
        </Flex>
      </Flex>
      <SliderWrapper>
        <Swiper getSwiper={setSwiper} {...params}>
          {thumbnailUrls.map((image) => (
            <div key={image}>
              <LocationImage src={image} />
            </div>
          ))}
        </Swiper>
      </SliderWrapper>
    </Box>
  )
}

VenueImageSlider.propTypes = {
  thumbnailUrls: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

export default VenueImageSlider
