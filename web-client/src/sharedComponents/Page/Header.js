import React from 'react'
import styled from 'styled-components/macro'
import PropTypes from 'prop-types'
import { rgba, rem } from 'polished'
import OutsideClickHandler from 'react-outside-click-handler'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import ContentLoader from 'react-content-loader'
import { mq, radius, space, BOXSHADOWS, COLORS } from 'Theme'
import { useAuth } from 'AuthProvider'
import Button from 'components/atoms/Button'
import { Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Media, { queries } from 'components/Media'
import Topbar from 'components/Topbar'
import { TOPBAR_HEIGHT } from 'constants/style'
import { ReactComponent as ArrowheadIcon } from 'assets/images/svg/arrowhead.svg'
import nextRetreatLogo from 'assets/images/svg/logo-next-retreat.svg'
import customerSupportIcon from 'assets/images/svg/customer-support.svg'
import userIcon from 'assets/images/svg/user.svg'
import Filter from 'sharedComponents/Filter'
import RouterLink from 'sharedComponents/RouterLink'
import Currency from './Currency'
import Trips from './Trips'
import SupportMenu from './SupportMenu'
import UserSignedMenu from './UserSignedMenu'
import TouchMenuButton from './TouchMenuButton'
import UserModal from './UserModal'

export const Loader = () => (
  <Flex width="100%">
    <ContentLoader
      speed="2"
      width="300"
      height="50"
      viewBox="0 0 300 50"
      backgroundColor={COLORS.IRRADIANT_IRIS}
      foregroundColor={COLORS.SUPER_SILVER}
    >
      <rect x="80" y="15" rx="3" ry="3" width="200" height="20" />
      <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
      <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
      <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
      <circle cx="40" cy="25" r="25" />
    </ContentLoader>
  </Flex>
)

const CONSISTENT_PADDING = space.m

const StyledArrowheadIcon = styled(ArrowheadIcon)`
  width: ${rem('12px')};
  margin-left: ${space.xs};

  color: ${COLORS.BROTHER_BLUE};
`

const StickyWrapper = styled('div')`
  z-index: 1;
  position: sticky;
  top: 0;
`

const Logo = styled('img')`
  width: ${rem('165px')};
  height: ${TOPBAR_HEIGHT};
  margin: 0 ${CONSISTENT_PADDING};
  flex: none;
`

const EndContent = styled('div')`
  padding-right: ${CONSISTENT_PADDING};

  white-space: nowrap;
  ${mq.from.tablet`
      margin-left: auto;
  `}

  > * {
    vertical-align: middle;
  }

  > :not(:first-child) {
    ${mq.from.tablet`
      margin-left: auto;
      padding: 0 ${CONSISTENT_PADDING};
    `}
  }
`

const MenuOverlay = styled('div')`
  z-index: -1;
  position: absolute;
  left: 0;
  right: 0;

  height: var(--nr-100vh, 100vh);

  background-color: ${rgba(COLORS.WHITE, 0.8)};
`

const Menu = styled('nav')`
  border-radius: 0 ${radius.m} ${radius.m} 0;
  background-color: ${COLORS.WHITE};
  box-shadow: ${BOXSHADOWS.CARD};

  > * {
    width: 100%;
  }

  > * + * {
    margin-top: ${space.s};
  }
`

const StyledSupportButton = styled('button')`
  height: ${TOPBAR_HEIGHT};
`

const customButtonStyles = `
  cursor: pointer;
  text-decoration: none;
`

const StyledPrimaryButton = styled(Button.Primary)`
  ${customButtonStyles}
`

const StyledSecondaryButton = styled(Button.Secondary)`
  ${customButtonStyles}
`

const RequestButton = ({ isBlock }) => (
  <StyledPrimaryButton
    href={process.env.REACT_APP_REQUEST_RETREAT_URL}
    isBlock={isBlock}
  >
    Request retreat
  </StyledPrimaryButton>
)

RequestButton.propTypes = {
  isBlock: PropTypes.bool,
}

const SupportButton = React.forwardRef((props, ref) => (
  <StyledSupportButton type="button" {...props} ref={ref}>
    <img src={customerSupportIcon} alt="" />
    <Text color={COLORS.SPACE_CADET} mx="s">
      Support
    </Text>
    <StyledArrowheadIcon />
  </StyledSupportButton>
))

const UserButton = React.forwardRef((props, ref) => {
  const { user } = useAuth()
  return (
    <StyledSupportButton type="button" {...props} ref={ref}>
      <img src={userIcon} alt="userIcon" />
      <Text color={COLORS.SPACE_CADET} mx="s">
        {user ? user.email : 'Account'}
      </Text>
      {user && <StyledArrowheadIcon />}
    </StyledSupportButton>
  )
})

const Header = ({ loginRequired = true ,goToPlan = false}) => {
  const { isSignedIn, signOut, user, isSigningIn } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [ isUserModalOpen, setIsUserModalOpen] = React.useState(false)
  const menuButtonRef = React.useRef(null)

  React.useEffect(() => {
    if (isMenuOpen) {
      disableBodyScroll(document.querySelector('#root'))
    } else {
      clearAllBodyScrollLocks()
    }
  }, [isMenuOpen])

  return (
    <Media queries={queries}>
      {(matches) => (
        <StickyWrapper>
          <Topbar>
            <Flex flex="1">
              <Flex alignItems="center">
                <RouterLink to="">
                  <Logo src={nextRetreatLogo} alt="Next retreat logo" />
                </RouterLink>
              </Flex>
              <Flex
                ml={{ tablet: 'm' }}
                flex="1"
                justifyContent="center"
                alignItems="center"
              >
                {!matches.mobile && (
                  <Filter
                    label=""
                    targetComp={SupportButton}
                    hasFooter={false}
                    hasPadding={false}
                  >
                    <SupportMenu />
                  </Filter>
                )}
                <Currency innerLabel="Choose a currency" />
                <EndContent>
                  {goToPlan && !matches.mobile && !matches.tablet && (<RouterLink to="/plan">
                      <Button.Primary>
                        Go to Planner
                      </Button.Primary>
                    </RouterLink>
                  )}
                  {isSignedIn && <Trips />}
                  {!matches.mobile && isSigningIn && <Loader />}
                  {!matches.mobile && !isSigningIn && isSignedIn && (
                    <Filter
                      label=""
                      targetComp={UserButton}
                      hasFooter={false}
                      hasPadding={false}
                    >
                      <UserSignedMenu />
                    </Filter>
                  )}
                  {!matches.mobile && !isSigningIn && !isSignedIn && (
                    <UserButton onClick={() => setIsUserModalOpen(true)} />
                  )}
                  {matches.mobile && (
                    <TouchMenuButton
                      ref={menuButtonRef}
                      onClick={() => {
                        setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen)
                      }}
                    />
                  )}
                </EndContent>
              </Flex>
            </Flex>
          </Topbar>
          {(isUserModalOpen || (loginRequired && !isSignedIn)) && (
            <UserModal
            isOpen = {(loginRequired && !isSignedIn) || isUserModalOpen}
            isSigningIn = {isSigningIn}
            closeModal={() => setIsUserModalOpen(false)}
            hasCloseButton={!loginRequired}
            />
          )}
          {matches.mobile && isMenuOpen && (
            <MenuOverlay>
              <OutsideClickHandler
                disabled={!isMenuOpen}
                onOutsideClick={(e) => {
                  if (!menuButtonRef.current.contains(e.target)) {
                    setIsMenuOpen(false)
                  }
                }}
              >
                <Menu>
                  <SupportMenu
                    requestButtonComp={<RequestButton isBlock />}
                    accountButtonComp={
                      <>
                        <StyledSecondaryButton
                          disabled={isSigningIn}
                          isBlock
                          onClick={() => {
                            if (isSignedIn) {
                              signOut()
                            } else {
                              setIsUserModalOpen(true)
                            }
                          }}
                        >
                          {isSignedIn ? 'Logout' : 'Access My Account'}
                        </StyledSecondaryButton>
                        {isSignedIn && (
                          <>
                            <Text
                              as="p"
                              mt="m"
                              mb="xs"
                              fontSize="s"
                              color={COLORS.DEEP_RESERVOIR}
                            >
                              Logged in as
                            </Text>
                            <Text as="p" color={COLORS.SPACE_CADET}>
                              {user.email}
                            </Text>
                          </>
                        )}
                      </>
                    }
                  />
                </Menu>
              </OutsideClickHandler>
            </MenuOverlay>
          )}
        </StickyWrapper>
      )}
    </Media>
  )
}

Header.propTypes = {
  loginRequired: PropTypes.bool,
}

export default Header
