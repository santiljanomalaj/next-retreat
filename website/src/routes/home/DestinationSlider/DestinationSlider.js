import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Swiper from 'react-id-swiper'
import 'swiper/css/swiper.css'
import { rem } from 'polished'
import { COLORS, mq } from 'Theme'
import { Text } from 'components/Typography'
import { Box } from 'components/Layout'
import ArrowButton from 'routes/components/ArrowButton'
import Slide from './Slide'

const IMAGE_HEIGHT = 500
const IMAGE_WIDTH = 357
const IMAGE_GAP = 24

const BUTTON_STYLES = `
  z-index: 2;
  position: absolute;
  top: ${rem(IMAGE_HEIGHT / 2)};
`

const StyledBoxLeft = styled('div')`
  ${BUTTON_STYLES};
  transform: translate(-50%, -50%);
  ${mq.to.tablet`
      transform: translate(-30%, -50%);
  `}
`
const StyledBoxRight = styled('div')`
  ${BUTTON_STYLES};
  transform: translate(50%, -50%);
  right: 0;
  ${mq.to.tablet`
      transform: translate(30%, -50%);
  `}
`

const swiperConfig = {
  loop: true,
  grabCursor: true,
  observerUpdate: true,
  breakpoints: {
    1024: {
      slidesPerView: 3,
      spaceBetween: IMAGE_GAP,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: IMAGE_GAP,
    },
    320: {
      slidesPerView: 1,
    },
  },
}

const DestinationSlider = ({ slides }) => {
  const [swiper, setSwiper] = React.useState(null)

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
    <div>
      <Text
        as="p"
        textAlign="center"
        fontSize="xxxxxl"
        fontWeight="bold"
        color={COLORS.SPACE_CADET}
        mb="l"
      >
        Popular destinations for teams
      </Text>
      <Box
        maxWidth={{
          mobile: rem(IMAGE_WIDTH),
          tablet: rem(IMAGE_WIDTH * 2 + IMAGE_GAP * 2),
          desktop: rem(IMAGE_WIDTH * 3 + IMAGE_GAP * 3),
        }}
        position="relative"
        m="0 auto"
      >
        <StyledBoxLeft>
          <ArrowButton onClick={() => handlePreviousClick()} direction="LEFT" />
        </StyledBoxLeft>
        <StyledBoxRight>
          <ArrowButton onClick={() => handleNextClick()} direction="RIGHT" />
        </StyledBoxRight>
        <Swiper getSwiper={setSwiper} {...swiperConfig}>
          {slides.map((slide, i) => (
            <div key={i}>
              <Slide {...slide} />
            </div>
          ))}
        </Swiper>
      </Box>
    </div>
  )
}

DestinationSlider.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      pictureUrl: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
}

export default DestinationSlider
