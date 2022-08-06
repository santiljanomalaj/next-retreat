import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import { fontSizes, mq, space, BORDER_WIDTH, COLORS } from 'Theme'
import { Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Link from 'components/Link'
import logoIcon from 'assets/images/svg/logo-next-retreat-icon.svg'
import facebook from 'assets/images/svg/facebook.svg'
import instagram from 'assets/images/svg/instagram.svg'
import linkedin from 'assets/images/svg/linkedin.svg'

const PADDING_X = space.m
const footerMQ = mq.to.tablet

const StyledFooter = styled('footer')`
  display: flex;
  align-items: center;

  min-height: ${rem('70px')};

  border-top: ${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS};
`

const Content = styled('div')`
  display: flex;
  justify-content: space-between;

  width: 100%;
  max-width: calc(2 * ${PADDING_X} + ${rem('1120px')});
  margin: 0 auto;

  > * {
    padding: ${space.xs} ${PADDING_X};
  }

  ${footerMQ`
    align-items: center;
    flex-direction: column;

    padding: ${space.s} 0;

    > :last-child {
      order: -1;
    }
  `}
`

const StyledLink = styled(Link)`
  font-size: ${fontSizes.s};
  white-space: nowrap;
`

StyledLink.defaultProps = {
  as: 'a',
  target: '_blank',
  rel: 'noreferrer noopener',
}

const SocialLink = styled('a')`
  display: inline-flex;

  padding: ${space.s};
`

SocialLink.defaultProps = {
  target: '_blank',
}

const Logo = styled('img')`
  width: ${rem('30px')};
  margin-right: ${space.m};

  ${footerMQ`
    margin: 0;
  `}
`

const StartContent = styled('div')`
  display: flex;
  align-items: center;

  ${footerMQ`
    flex-direction: column;
  `}
`

const BR = styled('br')`
  display: none;

  ${footerMQ`
    display: initial;
  `}
`

const Footer = () => (
  <StyledFooter>
    <Content>
      <StartContent>
        <Logo src={logoIcon} alt="" />
        <Text fontSize="s" textAlign="center" color={COLORS.DEEP_RESERVOIR}>
          © {new Date().getFullYear()} NextRetreat. <BR />
          All rights reserved.
        </Text>
      </StartContent>
      <Flex alignItems="center">
        <StyledLink href={process.env.REACT_APP_WEBSITE_URL}>Home</StyledLink>
        <Text color={COLORS.BROTHER_BLUE}>•</Text>
        <StyledLink href={`https://www.nextretreat.com/terms`}>
          Terms
        </StyledLink>
        <Text color={COLORS.BROTHER_BLUE}>•</Text>
        <StyledLink href={`https://www.nextretreat.com/contact`}>
          Contact
        </StyledLink>
        <SocialLink href="https://www.facebook.com/nextretreat">
          <img src={facebook} alt="Facebook page" />
        </SocialLink>
        <SocialLink href="https://instagram.com/nextretreat_com">
          <img src={instagram} alt="Instagram page" />
        </SocialLink>
        <SocialLink href="https://www.linkedin.com/company/nextretreat">
          <img src={linkedin} alt="LinkedIn page" />
        </SocialLink>
      </Flex>
    </Content>
  </StyledFooter>
)

export default Footer
