import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import { mq, space, COLORS, fontSizes, fontWeights } from 'Theme'
import { H1 } from 'components/Typography'
import { Box, Flex, Grid } from 'components/Layout'
import SEO from 'components/SEO'
import GenericPage from 'components/GenericPage'
import Hero from 'routes/components/Hero'
import supportTeamHeroImage from 'images/support-team-hero.png'
import questionIcon from 'images/svg/question-icon.svg'
import planeIcon from 'images/svg/paperplane-icon.svg'
import doughnutIcon from 'images/svg/doughnut-icon.svg'
import phoneIcon from 'images/svg/phone-icon.svg'
import termsIcon from 'images/svg/faq/notes-icon.svg'
import ContactForm from './ContactForm'
import IconText from './IconText'
import SuccessMessage from './SuccessMessage'
import Team from './Team'

const LINE_HEIGHT = rem(28)
const COLUMN_HEIGHT = rem(390)

const textStyles = `
  text-align: center;
  line-height: ${LINE_HEIGHT};
  font-size: ${fontSizes.l};
`

const StyledText = styled('p')`
  ${textStyles}
  color: ${COLORS.DEEP_RESERVOIR};
`

const HeadingText = styled('p')`
  ${textStyles}
  font-weight: ${fontWeights.semi_bold};
  color: ${COLORS.SPACE_CADET};
  margin-bottom: ${space.s};
`

const StyledGrid = styled(Grid)`
  ${mq.from.tablet`
    > :last-child {
      grid-column: span 2;
    }
  `}
`

const HeroContent = styled('div')`
  display: flex;
  align-items: center;

  padding: ${space.m} 0;

  > * {
    flex: 1;
    padding: ${space.m} ${space.s};
  }

  ${mq.to.tablet`
    flex-direction: column;
  `}
`

const HeroImage = styled('img')`
  display: block;

  margin: auto;
  width: ${rem('337px')};
`

const Subtitle = styled('p')`
  max-width: ${rem('520px')};

  font-size: ${fontSizes.l};

  color: ${COLORS.DEEP_RESERVOIR};

  & + & {
    margin-top: ${space.m};
  }

  ${mq.to.tablet`
    text-align: center;
  `}
`

const MailTo = styled('a')`
  display: block;

  text-align: center;
  line-height: ${LINE_HEIGHT};
  text-decoration: none;

  color: ${COLORS.CHUN_LI_BLUE};
`

const Contact = () => {
  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false)
  return (
    <GenericPage hasFooterBorder={false}>
      <SEO title="Contact | NextRetreat" description="We are here to help!" />
      <Hero>
        <HeroContent>
          <div>
            <HeroImage
              src={supportTeamHeroImage}
              alt="Inna, Snezana & Petra from NextRetreat"
            />
          </div>
          <div>
            <H1
              mb={{ mobile: 'm', tablet: 'l' }}
              textAlign={{ mobile: 'center', tablet: 'initial' }}
            >
              We are here to help!
            </H1>
            <Subtitle>
              We look forward to helping you organise a memorable team trip and
              are available to answer any questions. We invite you to leave a
              message via the contact form below, use the webchat or give us a
              call. A NextRetreat team member will be in touch with you shortly.
            </Subtitle>
            <Subtitle>
              You might also find some answers by visiting our FAQ page.
            </Subtitle>
          </div>
        </HeroContent>
      </Hero>
      <Box mt="l" mb="xxl">
        <Flex flexDirection={{ mobile: 'column', desktop: 'row' }} mt="l">
          <Box
            flex="1"
            mr={{ mobile: 0, desktop: 'm' }}
            mb={{ mobile: 'l', desktop: 0 }}
          >
            {isFormSubmitted ? (
              <SuccessMessage />
            ) : (
              <ContactForm onSubmitForm={setIsFormSubmitted} />
            )}
          </Box>
          <StyledGrid
            flex="1"
            gridGap="m"
            justifyContent="center"
            gridTemplateColumns={{ mobile: '1fr', tablet: '1fr 1fr' }}
            minHeight={COLUMN_HEIGHT}
          >
            <IconText
              src={questionIcon}
              label="How it works"
              linkTo="/how-it-works"
            />
            <IconText src={doughnutIcon} label="FAQ" linkTo="/faq" />
            <IconText
              src={planeIcon}
              label="support@nextretreat.com"
              linkTo="mailto:support@nextretreat.com"
            />
            <IconText
              src={termsIcon}
              label="Terms of use"
              linkTo="/terms"
              // onClick={() => {
              //   if (window.Intercom) {
              //     window.Intercom('show')
              //   }
              // }}
            />
            <IconText
              src={phoneIcon}
              label="+44 330 818 0703"
              linkTo="tel:+443308180703"
            />
          </StyledGrid>
        </Flex>
        <Box bg={COLORS.IRRADIANT_IRIS} width="100%" height="1px" my="xl" />
        <Flex
          flexDirection={{ mobile: 'column', desktop: 'row' }}
          justifyContent="space-around"
        >
          <Box mb={{ mobile: 'l', desktop: 0 }}>
            <HeadingText>Company address:</HeadingText>
            <StyledText>DUETT Business Residence</StyledText>
            <StyledText>Namestie osloboditelov 3/A</StyledText>
            <StyledText>040 01 Kosice, Slovakia</StyledText>
          </Box>
          <div>
            <HeadingText>Contact our team:</HeadingText>
            <MailTo href="mailto:team@nextretreat.com">
              team@nextretreat.com
            </MailTo>
          </div>
        </Flex>
      </Box>
      <Team />
    </GenericPage>
  )
}

export default Contact
