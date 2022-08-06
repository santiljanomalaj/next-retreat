import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import Swiper from 'react-id-swiper'
import 'swiper/css/swiper.css'
import { rem } from 'polished'
import { mq, COLORS } from 'Theme'
import Link from 'components/RouterLink'
import { Text } from 'components/Typography'
import { Box, Flex } from 'components/Layout'
import { fullWidthStyle } from 'components/mixins'
import { REVIEW_SLIDER_OFFSET } from 'routes/home/constants'
import ArrowButton from 'routes/components/ArrowButton'
import Slide from './Slide'

const MAX_WIDTH = rem(1120)
const IMAGE_HEIGHT = rem(180)

const BUTTON_STYLES = `
  z-index: 2;
  position: absolute;
  top: 50%;
`

const StyledBoxLeft = styled('div')`
  ${BUTTON_STYLES};
  transform: translate(-50%, -50%);
  ${mq.to.tablet`
      top: ${IMAGE_HEIGHT};
      transform: translate(-30%, -50%);
  `}
`
const StyledBoxRight = styled('div')`
  ${BUTTON_STYLES};
  transform: translate(50%, -50%);
  right: 0;
  ${mq.to.tablet`
      top: ${IMAGE_HEIGHT};
      transform: translate(30%, -50%);
  `}
`

const StyledBox = styled('div')`
  transform: rotate(180deg);
`

const ArrowSVG = () => (
  <StyledBox>
    <svg width="13" height="11" viewBox="0 0 22 18" fill="none">
      <path
        d="M21.021 8.947H1.185M9.095 1.037l-7.91 7.91 7.91 7.91"
        stroke={COLORS.WHITE}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </StyledBox>
)

const swiperConfig = {
  loop: true,
  grabCursor: true,
  observerUpdate: true,
  slidesPerView: 1,
  spaceBetween: 1,
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
    <Box
      position="relative"
      bg={COLORS.SOULSTONE_BLUE}
      pb={{ mobile: 'xxl', tablet: 'xl' }}
      px="l"
      css={fullWidthStyle}
    >
      <Box
        position="relative"
        maxWidth={MAX_WIDTH}
        m="0 auto"
        top={`-${rem(REVIEW_SLIDER_OFFSET)}`}
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
      <Box mt={`-${rem(REVIEW_SLIDER_OFFSET)}`}>
        <Box maxWidth={MAX_WIDTH} m="0 auto">
          <Text
            as="p"
            fontSize={{ mobile: 'xxl', tablet: 'xxxxxl' }}
            fontWeight="bold"
            color={COLORS.WHITE}
            mt="l"
            mb="m"
          >
            Love from our customers
          </Text>
          <Link to="/testimonials">
            <Flex display="inline-flex" alignItems="flex-end">
              <Text
                as="p"
                fontSize="l"
                fontWeight="semi_bold"
                color={COLORS.WHITE}
                mr="s"
              >
                Read more
              </Text>
              <ArrowSVG />
            </Flex>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

ReviewSlider.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      review: PropTypes.string.isRequired,
      logoUrl: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired,
      pictureUrl: PropTypes.string.isRequired,
      authorName: PropTypes.string.isRequired,
      authorJobTitle: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
}

export default ReviewSlider
