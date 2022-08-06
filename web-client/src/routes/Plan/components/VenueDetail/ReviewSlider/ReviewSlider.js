import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Swiper from 'react-id-swiper'
import 'swiper/css/swiper.css'
import { rem } from 'polished'
import { mq } from 'Theme'
import { Box, Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Slide from './Slide'
import ArrowButton from './ArrowButton'

const StyledBox = styled('div')`
  .swiper-slide {
    ${mq.from.tablet`
       max-width: ${rem(740)};
  `}
  }
  .swiper-container {
    overflow: visible !important;
  }
`

const swiperConfig = {
  grabCursor: true,
  observerUpdate: true,
  breakpoints: {
    1024: {
      slidesPerView: 2.25,
      spaceBetween: 25,
    },
    768: {
      slidesPerView: 1.3,
      spaceBetween: 20,
    },
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
  },
}

const ReviewSlider = ({ slides }) => {
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
    <Box minWidth="100%">
      <Flex justifyContent="space-between" alignItems="center" mb="l">
        <Text fontSize="xxl" fontWeight="semi_bold">
          What customers say about NextRetreat
        </Text>
        <Flex>
          <Box mr="s">
            <ArrowButton
              onClick={() => {
                handlePreviousClick()
              }}
              direction="LEFT"
            />
          </Box>
          <ArrowButton
            onClick={() => {
              handleNextClick()
            }}
            direction="RIGHT"
          />
        </Flex>
      </Flex>
      <StyledBox>
        <Swiper getSwiper={setSwiper} {...swiperConfig}>
          {slides.map((slide, i) => (
            <div key={i}>
              <Slide {...slide} />
            </div>
          ))}
        </Swiper>
      </StyledBox>
    </Box>
  )
}

ReviewSlider.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      review: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      logoUrl: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired,
      pictureUrl: PropTypes.string.isRequired,
      authorName: PropTypes.string.isRequired,
      authorJobTitle: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
}

export default ReviewSlider
