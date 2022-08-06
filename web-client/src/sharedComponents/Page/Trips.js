import React from 'react'
import { useHistory } from 'react-router-dom'
import queryString from 'query-string'
import styled, { css } from 'styled-components'
import { rem, cover, ellipsis } from 'polished'
import { useAuth } from 'AuthProvider'
import { useTripManagement, MODAL_TYPES } from 'TripManagementProvider'
import { space, COLORS, BOXSHADOWS, fontSizes } from 'Theme'
import Button from 'components/atoms/Button'
import { Text } from 'components/atoms/Typography'
import { Flex, Box } from 'components/atoms/Layout'
import Media, { queries } from 'components/Media'
import { ReactComponent as ArrowheadIcon } from 'assets/images/svg/arrowhead.svg'
import TripPopover from 'sharedComponents/TripManagement/TripPopover'
import TripItem from 'sharedComponents/TripManagement/TripItem'
import Filter from 'sharedComponents/Filter'
import { TOPBAR_HEIGHT } from 'constants/style'
// import ContentLoader from 'react-content-loader'
import ROUTES from 'constants/routes'
import { requireDynamicFlag } from 'utils/flags'
import heartFilledIcon from 'assets/images/svg/heart-filled.svg'
import tentCircleIcon from 'assets/images/svg/tent-circle.svg'
import addTripIcon from 'assets/images/svg/add-trip.svg'
import arrowRightIcon from 'assets/images/svg/arrow-right.svg'
import xMarkIcon from 'assets/images/svg/xmark.svg'
import threeDotsIcon from 'assets/images/svg/three-dots.svg'
import heartPointerIcon from 'assets/images/svg/heart-pointer.svg'

const Icon = styled(ArrowheadIcon)`
  width: ${rem('12px')};
  margin-left: ${space.xs};

  color: ${COLORS.BROTHER_BLUE};
`

const StyledButton = styled(Button.Tertiary)`
  justify-content: flex-end;

  min-width: ${rem('50px')};
  height: ${TOPBAR_HEIGHT};
`

const ContentWrapper = styled(Flex)`
  flex: 1;
  position: relative;
  overflow: hidden;
  height: 100%;
`

const LeftContent = styled(Flex)`
  ${({ isMainContentActive }) =>
    isMainContentActive &&
    css`
      ${cover()}
    `}
  flex-direction: column;
  flex: 1;
  transition: all 0.25s ease;
  transform: translateX(
    ${({ isMainContentActive }) => (isMainContentActive ? '-101%' : '0')}
  );
  padding: ${space.m} ${space.s};
  overflow: auto;
`

const RightContent = styled(Flex)`
  ${({ isMainContentActive }) =>
    !isMainContentActive &&
    css`
      ${cover()}
    `}
  flex-direction: column;
  align-items: center;
  overflow: auto;
  transition: all 0.25s ease;
  transform: translateX(
    ${({ isMainContentActive }) => (isMainContentActive ? '0' : '101%')}
  );
  flex: 4;
  height: 100%;
`

const StyledImage = styled.img`
  transform: rotate(180deg);
  cursor: pointer;
`

const HeaderWrapper = styled(Flex)`
  border-bottom: 1px solid ${COLORS.IRRADIANT_IRIS};
`

const HeaderTextWrapper = styled(Flex)`
  ${ellipsis()}
  flex-direction: column;
`

const HeaderActionWrapper = styled(Flex)`
  cursor: pointer;
`

const FooterWrapper = styled(Flex)`
  background-color: 1px solid ${COLORS.LYNX_WHITE};
  box-shadow: ${BOXSHADOWS.INNER};
  height: ${rem('56px')};
`

const HeaderAction = React.forwardRef((props, ref) => (
  <HeaderActionWrapper ml="auto" {...props} ref={ref}>
    <img src={threeDotsIcon} alt="" />
  </HeaderActionWrapper>
))

const StyledPopoverText = styled(Text)`
  cursor: pointer;
  font-size: ${fontSizes.m};
`

const StyledFlagImage = styled.img`
  height: ${rem(14)};
  margin-right: ${space.xs};
`

const Trips = () => {
  const { userTrips, areTripsLoading } = useAuth()
  const { openModal, setAddedVenueIds } = useTripManagement()
  const history = useHistory()
  const [preventOutsideClick, setPreventOutsideClick] = React.useState(false)
  const [activeTrip, setActiveTrip] = React.useState(null)
  return (
    <>
      {!areTripsLoading && (
        <>
          <Media queries={queries}>
            {(matches) => (
              <TripPopover
                preventOutsideClick={preventOutsideClick}
                targetComp={StyledButton}
                label={
                  <>
                    {/* TO DO: finish this */}
                    {/* {areTripsLoading && (
               <Flex width="100%">
              <ContentLoader
              speed="2"
              width="200"
              height="50"
              viewBox="0 0 200 50"
              backgroundColor={COLORS.IRRADIANT_IRIS}
              foregroundColor={COLORS.SUPER_SILVER}
            >
              <rect x="0" y="40" rx="3" ry="3" width="20" height="6" />
            </ContentLoader></Flex>
            )} */}
                    {!areTripsLoading && (
                      <>
                        <img src={heartFilledIcon} alt="heartFilled" />
                        <Text color={COLORS.SPACE_CADET} mx="s">
                          {!matches.mobile && 'Saved Trips '}(
                          {userTrips?.length})
                        </Text>
                        <Icon />
                      </>
                    )}
                  </>
                }
                modalLabel={
                  <>
                    <img src={heartFilledIcon} alt="heartFilled" />
                    <Text color={COLORS.SPACE_CADET} mx="s">
                      Saved Trips ({userTrips?.length})
                    </Text>
                    <Icon />
                  </>
                }
                onCancel={() => setActiveTrip(null)}
              >
                <ContentWrapper>
                  <LeftContent isMainContentActive={!!activeTrip}>
                    {userTrips.map((trip) => (
                      <TripItem
                        key={trip.id}
                        onClick={() => setActiveTrip(trip)}
                        primaryText={trip.name}
                        secondaryText={`${trip.tripVenues.length} venue${
                          trip.tripVenues.length !== 1 ? 's' : ''
                        }`}
                        imageSrc={
                          trip.tripVenues.find(
                            (tripVenue) => tripVenue.venue.thumbnailUrls.length
                          )?.venue.thumbnailUrls[0] || tentCircleIcon
                        }
                        actionIconSrc={arrowRightIcon}
                      />
                    ))}
                    <TripItem
                      onClick={() => {
                        openModal({
                          type: MODAL_TYPES.CREATE_MODAL,
                        })
                      }}
                      primaryText="Create New Trip"
                      imageSrc={addTripIcon}
                    />
                  </LeftContent>
                  <RightContent isMainContentActive={!!activeTrip}>
                    <Box width="100%">
                      {activeTrip && (
                        <>
                          <HeaderWrapper alignItems="center" p="m">
                            <StyledImage
                              src={arrowRightIcon}
                              alt=""
                              onClick={() => setActiveTrip(null)}
                            />
                            <HeaderTextWrapper flexDirection="column" ml="s">
                              <Text
                                fontSize="l"
                                fontWeight="semi_bold"
                                color={COLORS.SPACE_CADET}
                              >
                                {activeTrip.name}
                              </Text>
                            </HeaderTextWrapper>
                            <Filter
                              onOpen={() => setPreventOutsideClick(true)}
                              onCancel={() => setPreventOutsideClick(false)}
                              placement="right"
                              hasFooter={false}
                              hasPadding={false}
                              label={activeTrip.name}
                              targetComp={HeaderAction}
                              customMinWidth={rem(120)}
                            >
                              <Flex py="s" px="m" flexDirection="column">
                                <StyledPopoverText
                                  as="p"
                                  mb="xs"
                                  onClick={() =>
                                    openModal({
                                      type: MODAL_TYPES.UPDATE_MODAL,
                                      id: activeTrip.id,
                                      onSuccess: () => {
                                        setActiveTrip(null)
                                      },
                                    })
                                  }
                                >
                                  Rename
                                </StyledPopoverText>
                                <StyledPopoverText
                                  onClick={() =>
                                    openModal({
                                      type: MODAL_TYPES.DELETE_MODAL,
                                      id: activeTrip.id,
                                      onSuccess: () => {
                                        setActiveTrip(null)
                                      },
                                    })
                                  }
                                >
                                  Delete Trip
                                </StyledPopoverText>
                              </Flex>
                            </Filter>
                          </HeaderWrapper>
                          {activeTrip.tripVenues.length ? (
                            <Flex py="m" px="s" flexDirection="column">
                              {activeTrip.tripVenues.map((tripVenue) => (
                                <TripItem
                                  key={tripVenue.id}
                                  onClick={() => {
                                    history.push(
                                      `/${ROUTES.PLAN}/?${queryString.stringify(
                                        {
                                          venue: JSON.stringify({
                                            id: tripVenue.venue.id,
                                          }),
                                          detail: null,
                                        }
                                      )}`
                                    )
                                  }}
                                  onActionIconClick={(e) => {
                                    e.stopPropagation()
                                    openModal({
                                      type: MODAL_TYPES.REMOVE_VENUE_MODAL,
                                      id: tripVenue.id,
                                      onSuccess: () =>
                                        setAddedVenueIds((prevAddedVenueIds) =>
                                          prevAddedVenueIds.filter(
                                            (prevAddedVenueId) =>
                                              prevAddedVenueId !==
                                              tripVenue.venue.id
                                          )
                                        ),
                                    })
                                  }}
                                  primaryText={tripVenue.venue.title}
                                  imageSrc={
                                    tripVenue.venue.thumbnailUrls[0] ||
                                    tentCircleIcon
                                  }
                                  actionIconSrc={xMarkIcon}
                                  secondaryText={
                                    <>
                                      <Flex alignItems="center">
                                        <StyledFlagImage
                                          src={requireDynamicFlag(
                                            tripVenue.venue.countryCode
                                          )}
                                          alt={tripVenue.venue.countryCode}
                                        />
                                        {tripVenue.venue.destination}
                                      </Flex>
                                    </>
                                  }
                                />
                              ))}
                            </Flex>
                          ) : (
                            <Flex
                              py="l"
                              px="xl"
                              flexDirection="column"
                              alignItems="center"
                            >
                              <Text
                                fontSize="xl"
                                fontWeight="bold"
                                mb="s"
                                textAlign="center"
                              >
                                {activeTrip.name}
                              </Text>
                              <Text fontSize="m" as="p" textAlign="center">
                                Add your first venue by clicking the heart by
                                the venue detail
                              </Text>
                              <Flex mt="m" pl={rem('12px')}>
                                <img src={heartPointerIcon} alt="" />
                              </Flex>
                            </Flex>
                          )}
                          <FooterWrapper p="s" justifyContent="space-between">
                            <Flex flex="1" mr="m">
                              <Button.Primary
                                isBlock
                                disabled={!activeTrip.tripVenues.length}
                                onClick={() => {
                                  openModal({
                                    type: MODAL_TYPES.CHECK_AVAILABILITY_MODAL,
                                    tripId: activeTrip.id,
                                  })
                                }}
                              >
                                Check availability
                              </Button.Primary>
                            </Flex>
                            <Flex flex="1">
                              <Button.Secondary
                                isBlock
                                disabled={!activeTrip.tripVenues.length}
                                onClick={() => {
                                  history.push(
                                    `/${ROUTES.TRIP}/${activeTrip.id}`
                                  )
                                }}
                              >
                                Trip page
                              </Button.Secondary>
                            </Flex>
                          </FooterWrapper>
                        </>
                      )}
                    </Box>
                  </RightContent>
                </ContentWrapper>
              </TripPopover>
            )}
          </Media>
        </>
      )}
    </>
  )
}

export default Trips
