import React from 'react'
import styled from 'styled-components'
import { rem, rgba } from 'polished'
import { space, BORDER_WIDTH, COLORS } from 'Theme'
import SEO from 'components/SEO'
import { useModal } from 'components/Modal'
import GenericPage from 'components/GenericPage'
import { Box } from 'components/Layout'
import { H1, H2, Text } from 'components/Typography'
import { fullWidthStyle, maxWidthStyle } from 'components/mixins'
import CallToAction from 'routes/components/CallToAction'
import FaqList from 'routes/components/FaqList'
import Hero from 'routes/components/Hero'
import callToActionAppPreview from 'images/call-to-action-app-preview.png'
import Features from './Features'
import Steps from './Steps'

const FeaturesWrapper = styled('div')`
  padding: ${space.m};

  border-top: ${BORDER_WIDTH} solid ${rgba(COLORS.BROTHER_BLUE, 0.4)};
  background-image: linear-gradient(
      to right,
      ${COLORS.WHITE},
      ${rgba(COLORS.WHITE, 0)} 50%,
      ${COLORS.WHITE}
    ),
    linear-gradient(${COLORS.COTTON_BALL}, ${rgba(COLORS.IRRADIANT_IRIS, 0)});
`

const StyledCallToAction = styled(CallToAction)`
  background-image: linear-gradient(
    ${rgba(COLORS.LYNX_WHITE, 0)},
    ${COLORS.LYNX_WHITE} 50%
  );

  > * {
    ${maxWidthStyle}
  }

  ${fullWidthStyle}
`

const CTAImage = styled('img')`
  display: block;

  padding: 0 ${space.m};
  margin-top: ${space.m};
  width: 100%;
  max-height: ${rem('150px')};
`

const HowItWorks = () => {
  const { isOpen, openModal, closeModal } = useModal()
  return (
    <GenericPage
      isModalOpen={isOpen}
      openModal={openModal}
      closeModal={closeModal}
      headerBgColor={COLORS.WHITE}
    >
      <SEO
        title="Research, Plan & Book Team Travel | Here is How It Works"
        description="How NextRetreat works"
      />
      <Hero bgColor="transparent">
        <Box mt={{ mobile: 'xl', tablet: 'xxl' }} mb={{ tablet: 'xl' }}>
          <H1 fontWeight="normal" textAlign="center" mb="m">
            How <Text fontWeight="bold">NextRetreat</Text> works
          </H1>
          <Text
            color={COLORS.DEEP_RESERVOIR}
            as="p"
            fontSize="l"
            textAlign="center"
            maxWidth={rem('440px')}
            mx="auto"
          >
            We’ve built NextRetreat for our clients based on years of experience
            organising travel for teams, automating the time-consuming parts and
            focusing on what matters most.
          </Text>
        </Box>
      </Hero>
      <Steps />
      <FeaturesWrapper>
        <Features />
      </FeaturesWrapper>
      <Box mb="xl">
        <H2 mb="l">FAQs</H2>
        <FaqList
          questions={[
            'what-is-nr',
            'what-does-nr-offer',
            'what-makes-nr-different',
          ]}
        />
      </Box>
      <StyledCallToAction
        message="Ready to bring your team together?"
        buttonLabel="Let’s start"
        onClick={openModal}
      >
        <div>
          <CTAImage src={callToActionAppPreview} alt="" />
        </div>
      </StyledCallToAction>
    </GenericPage>
  )
}

export default HowItWorks
