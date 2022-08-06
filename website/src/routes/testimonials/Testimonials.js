import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import { mq, COLORS } from 'Theme'
import SEO from 'components/SEO'
import { Box } from 'components/Layout'
import { useModal } from 'components/Modal'
import GenericPage from 'components/GenericPage'
import { H1, Text } from 'components/Typography'
import CallToAction from 'routes/components/CallToAction'
import Hero from 'routes/components/Hero'
import LogoGrid from 'routes/components/LogoGrid'
import heroCustomers from 'images/hero-customers.jpg'
import logoM from 'images/logo-m.png'
import logoMob from 'images/logo-mob.png'
import logoPie from 'images/logo-pie.png'
import logoStemi from 'images/logo-stemi.png'
import logoThrive from 'images/logo-thrive.png'
import CaseStudySection from './CaseStudySection'
import Blog from './Blog'
import Slider from './Slider'
import { data as sliderData } from './Slider/data'
import Videos from './Videos'

const StyledHero = styled(Hero)`
  background: no-repeat bottom right / cover url("${heroCustomers}");

  ${mq.to.tablet`
    background-size: auto 110%;
  `}
`

const Testimonials = () => {
  const { isOpen, openModal, closeModal } = useModal()
  return (
    <GenericPage
      isModalOpen={isOpen}
      openModal={openModal}
      closeModal={closeModal}
      headerBgColor={COLORS.WHITE}
    >
      <SEO
        title="NextRetreat Stories | What Our Customers Say"
        description="NextRetreat Stories"
      />
      <StyledHero />
      <Box py="xl">
        <H1 textAlign="center" mb="m">
          NextRetreat Stories
        </H1>
        <Text
          as="p"
          fontSize="l"
          textAlign="center"
          maxWidth={rem('524px')}
          mx="auto"
          mb="xl"
          color={COLORS.DEEP_RESERVOIR}
        >
          NextRetreat has played an important role in helping companies organise
          unforgettable team trips. But don’t take it from us – read what our
          customers say about their experience.
        </Text>
        <LogoGrid>
          <LogoGrid.Image src={logoStemi} height="74px" alt="Stemi logo" />
          <LogoGrid.Image
            src={logoMob}
            height="64px"
            isTransparent
            alt="Mob logo"
          />
          <LogoGrid.Image
            src={logoM}
            height="58px"
            isTransparent
            alt="M logo"
          />
          <LogoGrid.Image src={logoPie} height="60px" alt="Pie logo" />
          <LogoGrid.Image
            src={logoThrive}
            height="74px"
            isTransparent
            alt="Thrive logo"
          />
        </LogoGrid>
      </Box>
      {sliderData.slice(0, 2).map(({ slides, ...props }, i) => (
        <Box key={i} my="xl">
          <Slider
            slides={slides}
            cardData={props}
            align={i % 2 === 0 ? 'left' : 'right'}
          />
        </Box>
      ))}
      <Videos />
      {sliderData.slice(2, 4).map(({ slides, ...props }, i) => (
        <Box key={i} my="xl">
          <Slider
            slides={slides}
            cardData={props}
            align={i % 2 === 0 ? 'left' : 'right'}
          />
        </Box>
      ))}
      <Box mt="xxl" mb="xl">
        <CaseStudySection />
      </Box>
      <Blog />
      <CallToAction
        layout="row"
        buttonLabel="Let’s start planning"
        message="Ready to #BringYourTeamTogether?"
        onClick={openModal}
      />
    </GenericPage>
  )
}

export default Testimonials
