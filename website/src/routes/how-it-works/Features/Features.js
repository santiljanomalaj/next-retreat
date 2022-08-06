import React from 'react'
import styled from 'styled-components/macro'
import { rgba } from 'polished'
import { useMedia } from 'useMedia'
import Swiper from 'react-id-swiper'
import 'swiper/css/swiper.css'
import { mq, space, BORDER_WIDTH, COLORS } from 'Theme'
import { Box } from 'components/Layout'
import { H2 } from 'components/Typography'
import { fullWidthStyle, maxWidthStyle, GUTTER } from 'components/mixins'
import NavButton from 'routes/components/ArrowButton'
import Slide from './Slide'
import Title from './Title'
import { data as features } from './data'

const SLIDE_EVENT = 'slideChange'
const TITLE_TABLET_SIZE = '33.333%'
const TITLE_MARGIN = space.l

const Pagination = styled('div')`
  position: relative;
  display: flex;

  transition: transform 0.3s;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: ${GUTTER};
    right: ${GUTTER};

    border-bottom: ${BORDER_WIDTH} solid ${rgba(COLORS.BROTHER_BLUE, 0.4)};
  }

  > * + * {
    margin-left: ${TITLE_MARGIN};
  }

  ${mq.from.tablet`
    transform: translateX(${({ currentIndex }) =>
      // prettier-ignore
      `calc(${currentIndex - 1} * -${TITLE_TABLET_SIZE} - ${currentIndex} * ${TITLE_MARGIN})`});
  `}

  ${mq.from.tv`
    transform: none;

    ${maxWidthStyle}
  `}
`

const Features = () => {
  const [swiper, setSwiper] = React.useState(null)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const matches = useMedia()

  const updateIndex = React.useCallback(
    () => setCurrentIndex(swiper.realIndex),
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

  const handleSlideTo = (index) => {
    if (swiper !== null) {
      swiper.slideTo(index)
    }
  }

  const handlePrevClick = () => {
    if (swiper !== null) {
      swiper.slidePrev()
    }
  }

  const handleNextClick = () => {
    if (swiper !== null) {
      swiper.slideNext()
    }
  }

  return (
    <>
      <H2 textAlign="center" py={{ mobile: 'l', tablet: 'xl' }}>
        Features tailored for team travel
      </H2>
      <Box css={fullWidthStyle}>
        {!matches.mobile && (
          <Pagination currentIndex={currentIndex}>
            {features.map(({ title }, i) => (
              <Title
                key={i}
                onClick={() => {
                  handleSlideTo(i)
                }}
                isActive={currentIndex === i}
                tabletSize={TITLE_TABLET_SIZE}
              >
                {title}
              </Title>
            ))}
          </Pagination>
        )}
        <Box alignItems="center" position="relative">
          <Swiper getSwiper={setSwiper} grabCursor observerUpdate>
            {features.map((slideData, i) => (
              <div key={i}>
                <Slide {...slideData} />
              </div>
            ))}
          </Swiper>
          {!matches.tv && (
            <>
              <NavButton
                onClick={() => {
                  handlePrevClick()
                }}
                direction="LEFT"
                isAbsolute
                top="33.333%"
              />
              <NavButton
                onClick={() => {
                  handleNextClick()
                }}
                direction="RIGHT"
                isAbsolute
                top="33.333%"
              />
            </>
          )}
        </Box>
      </Box>
    </>
  )
}

export default Features
