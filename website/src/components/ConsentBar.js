import React from 'react'
import PropTypes from 'prop-types'
import { rem } from 'polished'
import styled from 'styled-components'
import CookieConsent from 'react-cookie-consent'
import {
  fontSizes,
  fontWeights,
  mq,
  radius,
  space,
  BOXSHADOWS,
  COLORS,
  MAX_CONTENT_WIDTH,
} from 'Theme'
import Link from 'components/RouterLink'
import { SMALL_GUTTER, GUTTER } from 'components/mixins'

const PADDING = `calc((100vw - ${MAX_CONTENT_WIDTH}) / 2) !important`

const CookieConsentWrapper = styled('div')`
  .CookieConsent {
    align-items: center !important;

    min-height: ${rem('69px')} !important;
    padding-top: ${space.m} !important;
    padding-bottom: ${space.m} !important;
    padding-left: ${SMALL_GUTTER} !important;
    padding-right: ${SMALL_GUTTER} !important;

    font-size: ${fontSizes.s};

    color: ${COLORS.SPACE_CADET} !important;
    box-shadow: ${BOXSHADOWS.LIGHT};
    background-color: ${COLORS.LYNX_WHITE} !important;

    ${mq.from.tablet`
      padding-left: ${GUTTER} !important;
      padding-right: ${space.xxl} !important;
    `}

    ${mq.from.desktop`
      padding-left: ${PADDING};
    `}

    ${mq.from.tv`
      padding-right: ${PADDING};
    `}
  }

  .CookieConsentContent {
    margin: 0 !important;
  }

  .CookieConsentButtonWrapper {
    ${mq.to.tablet`
      display: flex;

      width: 100%;
      margin-top: ${space.m};

      > * {
        flex: 1 !important;
      }
    `}
  }

  #rcc-decline-button,
  #rcc-confirm-button {
    margin: 0 !important;
    height: ${rem('40px')};
    min-width: ${rem('100px')};

    font-size: ${fontSizes.m} !important;
    font-weight: ${fontWeights.semi_bold} !important;

    border-radius: ${radius.m} !important;
  }

  #rcc-decline-button {
    color: ${COLORS.CHUN_LI_BLUE} !important;
    background-color: transparent !important;
  }

  #rcc-confirm-button {
    margin-left: ${space.m} !important;

    color: ${COLORS.WHITE} !important;
    background-color: ${COLORS.CHUN_LI_BLUE} !important;
  }
`

const StyledLink = styled(Link)`
  text-decoration: underline;

  color: ${COLORS.CHUN_LI_BLUE};
`

const ConsentBar = ({ cookieName, onAccept }) => (
  <CookieConsentWrapper>
    <CookieConsent
      buttonText="Accept"
      enableDeclineButton
      onAccept={onAccept}
      cookieName={cookieName}
      declineButtonText="Decline"
      contentClasses="CookieConsentContent"
      buttonWrapperClasses="CookieConsentButtonWrapper"
      extraCookieOptions={{ domain: process.env.GATSBY_COOKIE_CONSENT_DOMAIN }}
    >
      We use cookies to ensure that we give you the best experience on our
      website. <StyledLink to="/privacy">Click here</StyledLink> for more
      information.
    </CookieConsent>
  </CookieConsentWrapper>
)

ConsentBar.propTypes = {
  onAccept: PropTypes.func.isRequired,
  cookieName: PropTypes.string.isRequired,
}

export default ConsentBar
