import React from 'react'
import styled from 'styled-components'
import { rem, rgba } from 'polished'
import { mq, space, COLORS } from 'Theme'
import { useScroll } from 'useScroll'
import { useMedia } from 'useMedia'
import SEO from 'components/SEO'
import GenericPage from 'components/GenericPage'
import { Box } from 'components/Layout'
import { H2 } from 'components/Typography'
import { useModal } from 'components/Modal'
import { fullWidthStyle, maxWidthStyle } from 'components/mixins'
import CallToAction from 'routes/components/CallToAction'
import Hero from 'routes/components/Hero'
import LogoGrid from 'routes/components/LogoGrid'
import hexamap from 'images/svg/hexamap.svg'
import customersPhotoGrid from 'images/testimonials.png'
import WaveSVG from 'images/svg/wave-slider.inline.svg'
import WaveMobileSVG from 'images/svg/wave-slider-mobile.inline.svg'
import ReviewsSlider from './ReviewsSlider'
import DestinationSlider from './DestinationSlider'
import Form, { FORM_OFFSET } from './Form'
import Features from './Features'
import Support from './Support'
import ToldAboutUs from './ToldAboutUs'

const heroMQ = mq.to.tablet

const WAVE_STYLES = `
  display: block;
  position: absolute;
  bottom: -1px;
  left: -1%;
  right -1%;
  width: 110vw;
`

const StyledWaveSVG = styled(WaveSVG)`
  ${WAVE_STYLES}
`

const StyledWaveMobileSVG = styled(WaveMobileSVG)`
  ${WAVE_STYLES}
`

const HeroContent = styled('div')`
  display: flex;

  ${heroMQ`
    margin: auto;
    margin-top: ${space.xxl};
  `}
`

const StyledHero = styled(Hero)`
  margin-bottom: ${FORM_OFFSET};
  padding-top: ${space.l};

  background-origin: content-box;
  background-repeat: no-repeat;
  background-image: url("${hexamap}");
  background-position: right calc(50% - ${rem('290px')}) center;
  background-size: 90% 90%;

  ${heroMQ`
    background-position: top center;
    background-size: 110%;
  `}
`

const StyledCallToAction = styled(CallToAction)`
  padding: ${space.l} 0;

  background: no-repeat bottom center;
  background-size: contain;
  background-image: linear-gradient(
    to top,
    ${COLORS.WHITE},
    ${rgba(COLORS.COTTON_BALL, 0)}
  ), url("${customersPhotoGrid}");

  > * {
    ${maxWidthStyle}
  }

  ${fullWidthStyle}

  ${mq.to.tv`
    background-size: cover;
  `}
`

const Home = () => {
  const matches = useMedia()
  const scrollPosition = useScroll()
  const heroRef = React.useRef(null)
  const { isOpen, openModal, closeModal } = useModal()
  const isAboveFold =
    (heroRef?.current?.clientHeight ?? scrollPosition) >= scrollPosition

  return (
    <GenericPage
      isModalOpen={isOpen}
      openModal={openModal}
      closeModal={closeModal}
      headerContentColor={isAboveFold ? COLORS.WHITE : undefined}
      headerBgColor={isAboveFold ? COLORS.SOULSTONE_BLUE : COLORS.WHITE}
    >
      <SEO
        title="NextRetreat | Bring Your Team Together – Team Retreats & Offsites"
        description="NextRetreat is streamlining the process of organising team travel. Find the right destination, book the perfect venue and get our help with everything else."
      />
      <StyledHero bgColor={COLORS.SOULSTONE_BLUE} ref={heroRef}>
        <HeroContent>
          <Form onSubmit={openModal} />
        </HeroContent>
      </StyledHero>
      <Features />
      <Box mb={{ mobile: 'xl', tablet: 'xxl' }} mt="xl">
        <Support />
      </Box>
      <Box mt="m" mb="xl">
        <DestinationSlider />
      </Box>
      <ToldAboutUs />
      <Box mb="xl">
        <ReviewsSlider />
        <Box css={fullWidthStyle}>
          {matches.mobile ? <StyledWaveMobileSVG /> : <StyledWaveSVG />}
        </Box>
      </Box>
      <Box pt="l" pb="xl">
        <H2 mb="xl" textAlign="center">
          Trusted by awesome companies
        </H2>
        <LogoGrid />
      </Box>
      <StyledCallToAction
        message="Say hello to your happy, more productive team"
        buttonLabel="Let’s start planning"
        onClick={openModal}
      />
    </GenericPage>
  )
}

export default Home
