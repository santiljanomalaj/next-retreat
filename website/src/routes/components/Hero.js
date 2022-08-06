import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { mq, COLORS } from 'Theme'
import { fullWidthStyle, maxWidthStyle } from 'components/mixins'
import Wave from 'images/svg/wave-white.inline.svg'

const WAVE_HEIGHT = rem('60px')
const WAVE_HEIGHT_MOBILE = rem('30px')

const StyledWave = styled(Wave)`
  position: absolute;
  bottom: -1px;

  display: block;

  width: 100%;
  height: ${WAVE_HEIGHT};

  ${mq.to.tablet`
    height: ${WAVE_HEIGHT_MOBILE};
  `}
`

const StyledHero = styled('div')`
  ${fullWidthStyle}

  padding-bottom: ${WAVE_HEIGHT};

  background: center no-repeat;
  background-color: ${({ bgColor }) => bgColor || COLORS.LYNX_WHITE};

  > :not(${StyledWave}) {
    position: relative;
  }

  ${mq.to.tablet`
    padding-bottom: ${WAVE_HEIGHT_MOBILE};
  `}
`

const Content = styled('div')`
  ${maxWidthStyle}

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;

  min-height: ${rem('130px')};

  ${mq.from.tablet`
    min-height: ${rem('156px')};
  `}

  ${mq.from.desktop`
    min-height: ${rem('260px')};
  `}
`

const Hero = React.forwardRef(({ bgColor, className, children }, ref) => (
  <StyledHero className={className} bgColor={bgColor} ref={ref}>
    <StyledWave />
    <Content>{children}</Content>
  </StyledHero>
))

Hero.propTypes = {
  children: PropTypes.node,
  bgColor: PropTypes.string,
  className: PropTypes.string,
}

export default Hero
