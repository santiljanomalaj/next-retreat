import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { rgba, rem } from 'polished'
import OutsideClickHandler from 'react-outside-click-handler'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { radius, space, BORDER_WIDTH, BOXSHADOWS, COLORS } from 'Theme'
import { useMedia } from 'useMedia'
import Button from 'components/Button'
import { Flex } from 'components/Layout'
import Popover from 'components/Popover'
import Link from 'components/RouterLink'
import { Text } from 'components/Typography'
import { getDisableBodyScrollDefaultSelector } from 'constants/constants'
import nextRetreatLogo from 'images/svg/logo-next-retreat.svg'
import nextRetreatLogoWhite from 'images/svg/logo-next-retreat-white.svg'
import starIcon from 'images/svg/star.svg'
import ArrowheadIcon from 'images/svg/arrowhead.inline.svg'
import SupportMenu from './SupportMenu'
import TouchMenuButton from './TouchMenuButton'

const WHITE_BORDER_COLOR = rgba(COLORS.WHITE, 0.3)
const CONSISTENT_PADDING = space.m
const TOPBAR_HEIGHT = rem('60px')

const StickyWrapper = styled('div')`
  z-index: 1;
  position: sticky;
  top: 0;
`

const Topbar = styled('header')`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: ${TOPBAR_HEIGHT};

  background-color: ${({ bgColor }) => bgColor || COLORS.LYNX_WHITE};
  border-bottom: ${BORDER_WIDTH} solid
    ${({ contentColor }) =>
    contentColor === COLORS.WHITE
      ? WHITE_BORDER_COLOR
      : COLORS.IRRADIANT_IRIS};

  transition: background-color 0.2s;

  ${({ contentColor }) => contentColor && `color: ${contentColor};`}
`

const Logo = styled('img')`
  width: ${rem('165px')};
  height: ${TOPBAR_HEIGHT};
  margin: 0 ${CONSISTENT_PADDING};
  flex: none;
`

const Review = styled('div')`
  position: relative;
  display: inline-flex;
  align-items: center;

  padding-right: ${CONSISTENT_PADDING};

  line-height: 1.1;

  a {
    text-decoration: underline;
  }
`

const EndContent = styled('div')`
  display: flex;
  align-items: center;

  padding: 0 ${CONSISTENT_PADDING};

  white-space: nowrap;
`

const MenuOverlay = styled('div')`
  z-index: -1;
  position: absolute;
  left: 0;
  right: 0;

  height: 100vh;

  background-color: ${rgba(COLORS.WHITE, 0.8)};
`

const MenuWrapper = styled('div')`
  border-radius: 0 ${radius.m} ${radius.m} 0;
  background-color: ${COLORS.WHITE};
  box-shadow: ${BOXSHADOWS.CARD};
`

const StyledSupportButton = styled('button')`
  position: relative;

  height: ${TOPBAR_HEIGHT};
  padding: 0 ${CONSISTENT_PADDING};

  white-space: nowrap;

  color: inherit;

  &::before {
    content: '';
    position: absolute;
    left: 0;

    width: 1px;
    height: ${rem('26px')};

    background-color: ${({ contentColor }) =>
    contentColor === COLORS.WHITE ? WHITE_BORDER_COLOR : COLORS.BROTHER_BLUE};
  }
`

const StyledArrowheadIcon = styled(ArrowheadIcon)`
  width: ${rem('12px')};

  color: ${COLORS.BROTHER_BLUE};
`

const SupportButton = React.forwardRef((props, ref) => (
  <StyledSupportButton type="button" {...props} ref={ref}>
    <Text mx="s">Resources</Text>
    <StyledArrowheadIcon />
  </StyledSupportButton>
))

const RequestButton = styled(Button.Secondary)`
  min-width: 0;

  ${({ $contentColor }) =>
    $contentColor === COLORS.WHITE &&
    `
      &,
      &:hover,
      &:active {
        background-color: transparent;
        color: ${COLORS.WHITE};
        border-width: 1px;
      }
    `}
`

const Header = ({ bgColor, contentColor, openModal }) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const menuButtonRef = React.useRef(null)
  const matches = useMedia()
  const isMobileView = matches.mobile || matches.tablet
  const isDesktopView = !matches.mobile && !matches.tablet

  React.useEffect(() => {
    if (isMenuOpen) {
      disableBodyScroll(getDisableBodyScrollDefaultSelector())
    } else {
      clearAllBodyScrollLocks()
    }
  }, [isMenuOpen])

  React.useEffect(() => {
    if (isDesktopView) {
      setIsMenuOpen(false)
    }
  }, [isDesktopView])

  const renderRequestButton = ($contentColor) => (
    <RequestButton
      as="a"
      href={process.env.GATSBY_REQUEST_RETREAT_URL}
      $contentColor={$contentColor}
    >
      Request retreat
    </RequestButton>
  )

  const planButton = (
    <Button.Inline as="a" onClick={openModal}>
      Build your retreat
    </Button.Inline>
  )

  return (
    <StickyWrapper>
      <Topbar bgColor={bgColor} contentColor={contentColor}>
        <Flex alignItems="center" flex="none">
          <Link to="/">
            <Logo
              src={
                contentColor === COLORS.WHITE
                  ? nextRetreatLogoWhite
                  : nextRetreatLogo
              }
              alt="Next retreat logo"
            />
          </Link>
          {!matches.mobile && (
            <>
              <Popover
                isOpen={isPopoverOpen}
                onClose={() => {
                  setIsPopoverOpen(false)
                }}
                onToggle={() => {
                  setIsPopoverOpen((prevIsPopoverOpen) => !prevIsPopoverOpen)
                }}
                referenceComp={<SupportButton contentColor={contentColor} />}
              >
                <SupportMenu />
              </Popover>
              <Link to="https://trip.nextretreat.com/why-next-retreat/" target="_self">
                <span css={`font-size:1rem`}>Why NextRetreat</span>
              </Link>
            </>
          )}

        </Flex>
        <a href="https://www.producthunt.com/posts/nextretreat?utm_source=badge-review&utm_medium=badge&utm_souce=badge-nextretreat#discussion-body" target="_blank">
          <img src="https://api.producthunt.com/widgets/embed-image/v1/review.svg?post_id=308059&theme=light" 
          alt="NextRetreat - All-in-one solution for organising team retreats & offsites | Product Hunt" 
          style={{
            width: 250 + 'px',
            height: 42 + 'px'
          }} width="250" height="42" />
          </a>
        <EndContent>
          {isDesktopView && (
            <>
              <Review contentColor={contentColor}>
                <img
                  src={starIcon}
                  alt=""
                  css={`
                    flex: none;
                  `}
                />
                <Text fontSize="s" ml="s">
                  <Text fontWeight="semi_bold">99.5%</Text> satisfaction rating
                  by our <Link to="/testimonials">customers</Link>
                </Text>
              </Review>
              {renderRequestButton(contentColor)}
              <Text mx="m">or</Text>
              {planButton}
            </>
          )}
          {isMobileView && (
            <TouchMenuButton
              ref={menuButtonRef}
              onClick={() => {
                setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen)
              }}
              contentColor={contentColor}
            />
          )}
        </EndContent>
      </Topbar>
      {isMobileView && isMenuOpen && (
        <MenuOverlay>
          <OutsideClickHandler
            disabled={!isMenuOpen}
            onOutsideClick={(e) => {
              if (!menuButtonRef.current.contains(e.target)) {
                setIsMenuOpen(false)
              }
            }}
          >
            <MenuWrapper>
              <SupportMenu
                requestButtonComp={renderRequestButton()}
                planButtonComp={planButton}
                isMobileView={isMobileView}
              />
            </MenuWrapper>
          </OutsideClickHandler>
        </MenuOverlay>
      )}
    </StickyWrapper>
  )
}

Header.propTypes = {
  bgColor: PropTypes.string,
  contentColor: PropTypes.string,
  openModal: PropTypes.func.isRequired,
}

export default Header
