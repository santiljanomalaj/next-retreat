import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { mq, fontSizes, fontWeights, space, BORDER_WIDTH, COLORS } from 'Theme'
import { fullWidthStyle } from 'components/mixins'
import { Flex } from 'components/Layout'
import Link from 'components/RouterLink'
import logoIcon from 'images/svg/logo-next-retreat.svg'
import Facebook from 'images/svg/facebook.inline.svg'
import Instagram from 'images/svg/instagram.inline.svg'
import Linkedin from 'images/svg/linkedin.inline.svg'
import fundsLogo from 'images/eu-fund-en.png'
import ministryOfEconomyLogo from 'images/min-hosp-en.png'
import ministryOfTransportLogo from 'images/min-dav-en.png'

const footerMQ = mq.to.tablet
const PUBLIC_SERVICE_LOGO_SIZE = rem('26px')
const MINISTRY_OF_TRANSPORT_LOGO_SIZE = rem('34px')

const HR = styled('hr')`
  margin: unset;

  border: unset;
  border-top: ${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS};

  ${footerMQ`
    ${fullWidthStyle}
  `}
`

const StyledFooter = styled('div')`
  display: flex;
  padding-top: ${space.l};
  font-size: ${fontSizes.s};

  > * {
    flex: 1;
  }

  ${footerMQ`
    flex-direction: column;
    padding-top: ${space.m};
  `}
`

const Info = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  ${footerMQ`
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: ${space.l};
  `}
`

const Menu = styled('div')`
  display: flex;

  > * {
    flex: 1;
    padding-bottom: ${space.l};
  }

  ${footerMQ`
    flex-wrap: wrap;
    order: -1;

    > * {
      flex: 50%;
    }
  `}
`

const MenuColumn = styled('div')``

const MenuTitle = styled('div')`
  padding-bottom: ${space.m};

  font-weight: ${fontWeights.semi_bold};
`

const MenuItem = styled(Link)`
  display: block;

  width: fit-content;
  padding-bottom: ${space.s};

  color: ${COLORS.DEEP_RESERVOIR};

  &:hover {
    text-decoration: underline;
  }
`

const Social = styled('div')`
  margin-left: -${space.s};

  white-space: nowrap;
`

const SocialLink = styled('a')`
  display: inline-flex;

  padding: ${space.s};

  color: ${COLORS.BLUEBERRY_SODA};
`

SocialLink.defaultProps = {
  target: '_blank',
  rel: 'noreferrer noopener',
}

const Logo = styled('img')`
  display: block;

  height: ${rem('16px')};
  margin: ${space.l} 0 ${space.s};

  ${footerMQ`
    order: -1;
    margin: 0;
  `}
`

const Copy = styled('span')`
  color: ${COLORS.DEEP_RESERVOIR};

  ${footerMQ`
    flex: 100%;
    margin-top: ${space.s};
  `}
`
const PublicService = styled('img')`
  display: block;

  height: ${({ height }) => height || PUBLIC_SERVICE_LOGO_SIZE};
  margin-right: ${space.l};

  ${footerMQ`
      margin-bottom: ${space.l};
  `}
`

const Footer = ({ hasBorder }) => (
  <>
    {hasBorder && <HR />}
    <StyledFooter>
      <Info>
        <Social>
          <SocialLink href="https://www.facebook.com/nextretreat">
            <Facebook />
          </SocialLink>
          <SocialLink href="https://instagram.com/nextretreat_com">
            <Instagram />
          </SocialLink>
          <SocialLink href="https://www.linkedin.com/company/nextretreat">
            <Linkedin />
          </SocialLink>
        </Social>
        <Logo src={logoIcon} alt="" />
        <Copy>
          © {new Date().getFullYear()} NextRetreat | All rights reserved.
        </Copy>
      </Info>
      <Menu>
        <MenuColumn>
          <MenuTitle>About</MenuTitle>
          <MenuItem to="https://trip.nextretreat.com/why-next-retreat/" target="_self">Why NextRetreat</MenuItem>
          <MenuItem to="/how-it-works">How it works</MenuItem>
          <MenuItem to="/faq">FAQ</MenuItem>
          <MenuItem to="/privacy">Privacy policy</MenuItem>
          <MenuItem to="/terms">Terms of use</MenuItem>
        </MenuColumn>
        <MenuColumn>
          <MenuTitle>Customers</MenuTitle>
          <MenuItem to="/testimonials">Testimonials</MenuItem>
          <MenuItem to={process.env.GATSBY_BLOG_URL}>Blog</MenuItem>
          <MenuItem to="/contact">Contact</MenuItem>
        </MenuColumn>
        {/* <MenuColumn>
          <MenuTitle>NextRetreat for</MenuTitle>
          <MenuItem to="https://trip.nextretreat.com/site/remote-teams/">Remote teams</MenuItem>
          <MenuItem to="https://trip.nextretreat.com/site/team-retreats/">Team retreats</MenuItem>
          <MenuItem to="https://trip.nextretreat.com/site/rent-wolfhouse-venues-hybrid-events/">Hybrid events</MenuItem>
          <MenuItem to="https://trip.nextretreat.com/site/dictionary/">Dictionary</MenuItem>
        </MenuColumn> */}
      </Menu>
    </StyledFooter>
    <Flex alignItems="flex-start" flexWrap="wrap" mb={{ tablet: space.l }}>
      <PublicService src={fundsLogo} alt="" />
      <PublicService
        src={ministryOfTransportLogo}
        alt=""
        height={MINISTRY_OF_TRANSPORT_LOGO_SIZE}
      />
      <PublicService src={ministryOfEconomyLogo} alt="" />
    </Flex>
  </>
)

Footer.defaultProps = {
  hasBorder: true,
}

Footer.propTypes = {
  hasBorder: PropTypes.bool,
}

export default Footer
