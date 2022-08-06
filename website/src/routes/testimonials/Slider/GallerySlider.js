import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import Swiper from 'react-id-swiper'
import 'swiper/css/swiper.css'
import { rem } from 'polished'
import { useMedia } from 'useMedia'
import { COLORS, mq, space, breakpoints } from 'Theme'
import { Box, Flex } from 'components/Layout'
import { fullWidthStyle } from 'components/mixins'
import Card from './Card'

const CARD_OFFSET = rem(60)
const DESKTOP_WIDTH = rem(990)
const SLIDE_EVENT = 'slideChange'

const StyledBox = styled(Box)`
  cursor: pointer;
  width: ${rem(170)};
  height: ${rem(110)};
  ${({ pictureUrl }) =>
    `background: url("${pictureUrl}") center / cover no-repeat;`}
  ${({ currentIndex, index }) => currentIndex === index && `opacity: 0.3;`}
`

const StyledFlex = styled(Flex)`
  margin-top: ${space.m};
  > :not(:last-child) {
    margin-right: ${space.m};
  }
  ${({ align }) =>
    `justify-content: ${align === 'right' ? 'flex-start' : 'flex-end'}`}
`

const Picture = styled('div')`
  height: ${rem(660)};
  ${mq.to.desktop`
    height: ${rem(550)};
  `}
  ${mq.to.tablet`
    height: ${rem(320)};
  `}
  ${({ pictureUrl }) =>
    `background: url("${pictureUrl}") center / cover no-repeat;`}
`

const CardWrapper = styled(Box)`
  z-index: 2;
  ${mq.from.tablet`
    position: relative;
    left: ${CARD_OFFSET};
    top: ${CARD_OFFSET};
    ${({ align }) =>
      align === 'right' &&
      `
       left: unset;
       right: ${CARD_OFFSET};
       display: flex;
       justify-content: flex-end;
     `}
  `}
  ${mq.from.tv`
     position: absolute;
     top: 50%;
     left: unset;
     right:-30%;
     ${({ align }) =>
       align === 'right' &&
       `
       left:-30%;
       right: unset;
     `}
     transform: translateY(-50%);
  `}
`

const StyledContainer = styled(Box)`
  ${mq.to.tablet`
    ${fullWidthStyle}
  `}
  ${mq.from.desktop`
    ${fullWidthStyle}
  `}
  ${mq.from.tv`
    padding-top: 0;
  `}
`

const SliderWrapper = styled.div`
  .swiper-pagination-bullet {
    opacity: 0.6;
    background: ${COLORS.WHITE};
  }
  .swiper-pagination-bullet-active {
    background: ${COLORS.WHITE};
    opacity: 0.9;
  }
  ${mq.from.tablet`
    .swiper-pagination-bullet {
      display: none;
    }
    .swiper-pagination-bullet-active {
      display: none;
    }
  `}
`

const GallerySlider = ({ slides, swiperConfig, align, cardData }) => {
  const [swiper, setSwiper] = React.useState(null)
  const [currentIndex, updateCurrentIndex] = React.useState(0)
  const matches = useMedia()

  const updateIndex = React.useCallback(
    () => updateCurrentIndex(swiper.realIndex),
    [swiper]
  )

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

  const slideTo = (index) => {
    if (swiper !== null) {
      swiper.slideTo(index + 1)
    }
  }

  return (
    <StyledContainer>
      <Box maxWidth={rem(breakpoints.tv)} m="0 auto">
        <Box
          position="relative"
          maxWidth={{ desktop: DESKTOP_WIDTH }}
          ml={align === 'right' ? 'auto' : 'unset'}
        >
          <Box position="relative">
            <CardWrapper align={align}>
              <Card {...cardData} />
            </CardWrapper>
            <SliderWrapper>
              <Swiper getSwiper={setSwiper} {...swiperConfig}>
                {slides.map((slide, i) => (
                  <div key={i}>
                    <Picture pictureUrl={slide} />
                  </div>
                ))}
              </Swiper>
            </SliderWrapper>
          </Box>
          {!matches.mobile && (
            <StyledFlex align={align}>
              {slides.map((slide, i) => (
                <StyledBox
                  key={i}
                  index={i}
                  pictureUrl={slide}
                  currentIndex={currentIndex}
                  onClick={() => slideTo(i)}
                />
              ))}
            </StyledFlex>
          )}
        </Box>
      </Box>
    </StyledContainer>
  )
}

GallerySlider.propTypes = {
  align: PropTypes.string,
  swiperConfig: PropTypes.object.isRequired,
  cardData: PropTypes.shape({
    review: PropTypes.string.isRequired,
    logoUrl: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    numberOfDays: PropTypes.string.isRequired,
    authorJobTitle: PropTypes.string.isRequired,
    numberOfteamMembers: PropTypes.string.isRequired,
    goals: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired,
  slides: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

export default GallerySlider
