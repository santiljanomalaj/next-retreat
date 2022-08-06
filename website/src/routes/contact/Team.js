import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { math, rem } from 'polished'
import { mq, radius, space, BORDER_WIDTH, BOXSHADOWS, COLORS } from 'Theme'
import { fullWidthStyle, maxWidthStyle } from 'components/mixins'
import Link from 'components/RouterLink'
import { H2, Text } from 'components/Typography'
import innaDemianko from 'images/contact/inna-demianko.jpg'
import janKoscelansky from 'images/contact/jan-koscelansky.jpg'
import martinStudencan from 'images/contact/martin-studencan.jpg'
import peterKulcsar from 'images/contact/peter-kulcsar.jpg'
import petraEskutova from 'images/contact/petra-eskutova.jpg'
import stanleyMacha from 'images/contact/stanley-macha.jpg'
import amandaSapio from 'images/contact/amanda-sapio.jpg'
import kiriNowak from 'images/contact/kiri-nowak.jpg'
import ondrejGajdosech from 'images/contact/ondrej-gajdosech.jpg'
import richardRosko from 'images/contact/richard-rosko.jpg'
import silviaPodolakova from 'images/contact/silvia-podolakova.jpg'
import LinkedInIcon from 'images/svg/linkedin.inline.svg'
import marosZelenak from 'images/contact/maros-zelenak.png'

const PHOTO_SIZE = rem('167px')

const Background = styled('div')`
  position: absolute;
  z-index: -1;
  top: ${math(`${PHOTO_SIZE} / 2`)};
  bottom: 0;
  left: 0;
  right: 0;

  background-color: ${COLORS.WHITE};
`

const StyledMember = styled(Link)`
  position: relative;
  z-index: 0;

  padding: 0 ${space.m} ${space.m};

  line-height: 1.2;
  text-align: center;

  ${({ to }) =>
    to &&
    `
      cursor: pointer;

      &:hover ${Background} {
        box-shadow: ${BOXSHADOWS.CARD};
      }
    `}
`

const Photo = styled('img')`
  display: block;

  margin: 0 auto ${space.m};
  width: ${PHOTO_SIZE};
  height: ${PHOTO_SIZE};

  border-radius: ${radius.circle};
  object-fit: cover;
  object-position: top;
`

const StyledLinkedInIcon = styled(LinkedInIcon)`
  color: ${COLORS.BLUEBERRY_SODA};

  margin: 0 auto;
`

const Member = ({ photoUrl, name, position, linkedinUrl }) => (
  <StyledMember to={linkedinUrl} as={!linkedinUrl ? 'div' : undefined}>
    <Background />
    <Photo src={photoUrl} alt={name} />
    <Text display="block" my="xs" fontSize="xxl" fontWeight="semi_bold">
      {name}
    </Text>
    <Text display="block" mb="s" fontSize="l" color={COLORS.DEEP_RESERVOIR}>
      {position}
    </Text>
    {linkedinUrl && <StyledLinkedInIcon />}
  </StyledMember>
)

Member.propTypes = {
  photoUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  linkedinUrl: PropTypes.string,
}

const Wrapper = styled('div')`
  padding: ${space.xl} 0;

  background-color: ${COLORS.LYNX_WHITE};
  border: solid ${COLORS.BROTHER_BLUE};
  border-width: ${BORDER_WIDTH} 0;

  ${fullWidthStyle}
`

const Members = styled('div')`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: ${space.l};

  ${mq.from.tablet`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${mq.from.desktop`
    grid-template-columns: repeat(3, 1fr);
  `}
`

const Team = () => (
  <Wrapper>
    <div css={maxWidthStyle}>
      <H2 mb="xl">NextRetreat Team</H2>
      <Members>
        <Member
          photoUrl={martinStudencan}
          name="Martin Studenčan"
          position="CEO"
          linkedinUrl="https://www.linkedin.com/in/studencan/"
        />
        <Member
          photoUrl={peterKulcsar}
          name="Peter Kulcsár Szabó"
          position="CTO"
          linkedinUrl="https://www.linkedin.com/in/peter-kulcsár-szabó-674245160/"
        />
        <Member
          photoUrl={innaDemianko}
          name="Inna Demianko"
          position="Retreat Specialist"
          linkedinUrl="https://www.linkedin.com/in/inna-demianko-807100ba/"
        />
        <Member
          photoUrl={marosZelenak}
          name="Maroš Zeleňák"
          position="Product Designer"
          linkedinUrl="https://www.linkedin.com/in/maroszelenak/"
        />
        <Member
          photoUrl={janKoscelansky}
          name="Ján Koscelanský"
          position="CPO"
          linkedinUrl="https://www.linkedin.com/in/jankoscelansky/"
        />
        <Member
          photoUrl={petraEskutova}
          name="Petra Eškutová"
          position="COO"
          linkedinUrl="https://www.linkedin.com/in/petra-eskutova-40124b149/"
        />
        <Member
          photoUrl={silviaPodolakova}
          name="Silvia Podoláková"
          position="Product Designer"
          linkedinUrl="https://www.linkedin.com/in/silviapodolakova/"
        />
        <Member
          photoUrl={ondrejGajdosech}
          name="Ondrej Gajdošech"
          position="CLO"
          linkedinUrl=""
        />
        <Member
          photoUrl={richardRosko}
          name="Richard Roško"
          position="SW Developer"
          linkedinUrl="https://www.linkedin.com/in/richard-rosko-82ab806a/"
        />
        <Member
          photoUrl={amandaSapio}
          name="Amanda Sapio"
          position="Copywriter"
          linkedinUrl="https://www.linkedin.com/in/amandasapio"
        />
        <Member
          photoUrl={kiriNowak}
          name="Kiri Nowak"
          position="Content Lead"
          linkedinUrl="https://www.linkedin.com/in/kiri-nowak-5443411b/"
        />
        <Member
          photoUrl={stanleyMacha}
          name="Stanley Mácha"
          position="UX/UI Advisor"
          linkedinUrl="https://www.linkedin.com/in/stanleymacha/"
        />
      </Members>
    </div>
  </Wrapper>
)

export default Team
