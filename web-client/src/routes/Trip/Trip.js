import React from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { rem, math, rgba } from 'polished'
import { toast } from 'react-toastify'
import CopyToClipboard from 'react-copy-to-clipboard'
import { space, COLORS, radius, mq, BOXSHADOWS } from 'Theme'
import { useAuth } from 'AuthProvider'
import { useTripManagement, MODAL_TYPES } from 'TripManagementProvider'
import Page from 'sharedComponents/Page'
import Modal, { useModal } from 'components/Modal'
import Media from 'components/Media'
import { Text } from 'components/atoms/Typography'
import Button from 'components/atoms/Button'
import { Flex, Box } from 'components/atoms/Layout'
import Input from 'components/Input'
import { TOPBAR_HEIGHT } from 'constants/style'
import ROUTES from 'constants/routes'
import { requireDynamicFlag } from 'utils/flags'
import tentCircleIcon from 'assets/images/svg/tent-circle.svg'
import xMarkIcon from 'assets/images/svg/xmark.svg'
import shareIcon from 'assets/images/svg/share.svg'
import editIcon from 'assets/images/svg/edit.svg'
import infoWhiteIcon from 'assets/images/svg/info-white.svg'
import TripVenue from './TripVenue'
import TripVenueDetail from './TripVenueDetail'
import Map from './Map'
import SkeletonLoader from './SkeletonLoader'
import VenueSlider, { SLIDE_HEIGHT } from './VenueSlider'
import { useGoogleTracking, GTM_EVENTS } from '../../hooks/useGoogleTracking'
import TripRequirements from './TripRequirements'
import VariationsModal from './Variations/VariationsModal'
import TripShareModal from './TripShareModal'

const LEFT_COLUMN_WIDTH = 366
const RIGHT_COLUMN_WIDTH = 744
const NUMBER_WIDTH = 20

const TRIP_LOGO_UPLOAD_MUTATION = gql`
  mutation ($file: Upload!, $tripId: Int!) {
    uploadTripLogo(file: $file, tripId: $tripId)
    }
`

const REMOVE_TRIP_LOGO_MUTATION = gql`
  mutation ($tripId: Int!) {
    removeTripLogo(tripId: $tripId)
    }
`

const StyledVenuesContainer = styled(Box)`
  position: sticky;
  top: ${TOPBAR_HEIGHT};
  border: 1px solid ${COLORS.IRRADIANT_IRIS};
  border-radius: ${radius.m};
`

const StyledFlagImage = styled.img`
  height: ${rem(14)};
  margin-right: ${space.xs};
`

const StyledHeaderContainer = styled(Flex)`
  border-bottom: 1px solid ${COLORS.IRRADIANT_IRIS};
`

const ShareTripWrapper = styled(Flex)`
  cursor: pointer;
  &:hover > ${Text} {
    color: ${COLORS.CHUN_LI_BLUE};
  }
`

const ShareTripIconWrapper = styled.img`
  width: ${rem(15)};
  height: ${rem(16)};
  margin-right: ${space.m};
`

const TripImage = styled('div')`
  height: ${rem(340)};
  width: 100%;
  cursor: default;
  position: relative;
  ${({ pictureUrl }) =>
    `background: linear-gradient(0deg, ${rgba(
      COLORS.BLACK,
      0.5
    )} 16.43%, ${rgba(
      COLORS.BLACK,
      0
    )} 57.36%), url("${pictureUrl}") center / cover no-repeat;`}
  ${mq.to.desktop`
    height: ${rem(200)}
    padding: ${space.m}
  `}
`

const TripHeaderBox = styled(Box)`
  ${mq.to.desktop`
      padding-left: 20px
  `}
`

const TripLogoContainer = styled('div')`
  display: inline;
  position: relative;
`
const TripLogoDelete = styled.img`
  position: absolute;
  right: -9px;
  background-color: white;
  top: -36px;
  border-radius: 50%;
  padding: 3px;
  height: 19px;
  width: 19px;
  border: 1px solid ${COLORS.IRRADIANT_IRIS};
  cursor: pointer;
`

const TripLogo = styled.img`
  height:64px;
  max-width: 120px;
  border-radius:4px;
  margin-bottom: 16px;
  padding: 2px;
  background-color: white;
`

const StyledEditIcon = styled.img`
  cursor: pointer;
  height: ${rem(20)};
`

const StyledInfoIcon = styled.img`
  height: ${rem(16)};
  width: ${rem(16)};
  margin-right: ${space.s};
`

const StyledModalFooter = styled(Flex)`
  background-color: ${COLORS.LYNX_WHITE};
  box-shadow: ${BOXSHADOWS.INNER};
`

const StyledDot = styled.span`
  height: ${rem(4)};
  width: ${rem(4)};
  background-color: ${COLORS.WHITE};
  border-radius: 50%;
  display: inline-block;
  margin: 0 ${space.m};
`

const Tab = styled.button`
  font-size: 1rem;
  padding: 12px 12px;
  cursor: pointer;
  opacity: 0.6;
  background: white;
  border: 0;
  outline: 0;
  ${({ active }) =>
    active &&
    `
    color: ${COLORS.CHUN_LI_BLUE};
    border-bottom: 1px solid ${COLORS.CHUN_LI_BLUE};
    opacity: 1;
  `}
`;
const ButtonGroup = styled.div`
  display: flex;
`;

const UploadButton = styled.button`
  border-radius: 4px;
  background-color: ${COLORS.LYNX_WHITE};
  padding: 6px;
`
const UploadButtonText = styled(Text)`
  border: 1px solid ${COLORS.CHUN_LI_BLUE};
  border-radius:4px;
  border-style: dashed;
`

const ProposalManagementBox = styled(Box)`
  background-color: ${COLORS.LYNX_WHITE};
  width: 100%;
  padding-top: 12px;
  padding-bottom:12px;
`

const ProposalManagementButton = styled(Button.Primary)`
  width:213px;
`

const EstimatedCostBox = styled(Box)`
  background-color: ${COLORS.CHUN_LI_BLUE};
  text-align:center;
  color: ${COLORS.WHITE};
  border-radius:4px;
  margin-bottom:20px;
`

const EstiamtedCostFlex = styled(Flex)`
  width: 100%;
  background-color: ${COLORS.CHUN_LI_BLUE};
  text-align:center;
  color: ${COLORS.WHITE};
`

const GET_TRIP_DETAIL = gql`
  query TripDetail($input: TripInput!) {
    trip(input: $input) {
      id
      name
      userId
      shareToken
      logoUrl
      heroUrl
      isProposal
      requirements
      variations{
        id
        from
        to
        pax
        prices {
          id
          price
          venueId
          isAvailable
        }
      }
      tripVenues {
        id
        venue {
          id
          thumbnailUrls
          title
          destination
          countryCode
          country
          hotelidPpn
          type
          rating
          coordinates {
            lat
            lon
          }
          nearestAirports {
            distanceInKilometers
            code
          }
          avgTemperaturesByMonth {
            month
            celsius
          }
          houseRules {
            checkIn
            checkOut
            cancellationDescription
            roomTypeAssignmentDescription
          }
          address
          amenities
          starRating
          description
          numberOfRooms
          isMeetingRoomIncluded
          capacity
        }
      }
    }
  }
`

const venueSortFunction = (tripVenue1, tripVenue2) => {
  const { venue: venue1 } = tripVenue1
  const { venue: venue2 } = tripVenue2
  if (venue1.countryCode === venue2.countryCode) {
    if (venue1.destination === venue2.destination) {
      return tripVenue1.id - tripVenue2.id
    }
    return venue1.destination > venue2.destination ? 1 : -1
  }
  return venue1.countryCode > venue2.countryCode ? 1 : -1
}

const getPriceRangeForProposal = (variations) => {
  if (variations == null || variations.length === 0) return {}

  let min = Infinity, max = 0

  for (let i = 0; i < variations.length; i++) {
    const variation = variations[i];

    if (variation.prices == null || variation.prices.length === 0) continue

    for (let j = 0; j < variation.prices.length; j++) {
      const variationPrice = variation.prices[j];

      if (variationPrice.isAvailable !== false && variationPrice.price < min) min = variationPrice.price
      if (variationPrice.isAvailable !== false && variationPrice.price > max) max = variationPrice.price
    }
  }

  return { minPrice: min, maxPrice: min === max ? null : max }
}

const Trip = () => {
  const { user, isSigningIn, isSignedIn } = useAuth()
  const { logGTMEvent } = useGoogleTracking()
  const history = useHistory()
  const params = useParams()
  const { openModal } = useTripManagement()
  const {
    openModal: openCopyModal,
    closeModal: closeCopyModal,
    isOpen: isCopyModalOpen,
  } = useModal()
  const {
    openModal: openVariationsModal,
    closeModal: closeVariationsModal,
    isOpen: isVariationsModalOpen,
  } = useModal()
  const {
    openModal: openTripShareModal,
    closeModal: closeTripShareModal,
    isOpen: isTripShareModalOpen,
  } = useModal()
  const [activeVenue, setActiveVenue] = React.useState(null)
  const [mobileInput, setMobileInput] = React.useState(null)

  const [minPrice, setMinPrice] = React.useState(null)
  const [maxPrice, setMaxPrice] = React.useState(null)

  const { shareToken } = params
  const id = Number(params.id)

  const { data, refetch, loading } = useQuery(GET_TRIP_DETAIL, {
    variables: { input: { id, shareToken } },
    onError: () => {
      history.push(``)
    },
    onCompleted: (resultData) => {
      if (resultData?.trip?.tripVenues.length) {
        setActiveVenue(
          [...resultData.trip.tripVenues].sort(venueSortFunction)[0].venue
        )
      }
      setTripLogoUrl(resultData?.trip?.logoUrl)

      if (resultData?.trip?.isProposal) {
        setTripVariations(resultData?.trip?.variations || [])
        const { minPrice, maxPrice } = getPriceRangeForProposal(resultData?.trip?.variations)
        setMinPrice(minPrice)
        setMaxPrice(maxPrice)
      }
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  })

  const trip = data?.trip
  const isTripAdmin = !!(user && trip && user.id === trip.userId)
  const tripShareToken = `${process.env.REACT_APP_WEBSITE_URL}/${ROUTES.TRIP_SHARED}/${trip?.shareToken}`
  const [tripLogoUrl, setTripLogoUrl] = React.useState(trip?.logoUrl)
  const [tripVariations, setTripVariations] = React.useState(trip?.variations)

  const sortedTripVenues = React.useMemo(
    () => [...(trip?.tripVenues || [])].sort(venueSortFunction),
    [trip]
  )

  const tripVenuesByDestination = React.useMemo(
    () =>
      sortedTripVenues.reduce((acc, item, index) => {
        const { venue } = item
        const venueDestinationKey = `${venue.countryCode}-${venue.destination}`
        return {
          ...acc,
          [venueDestinationKey]: {
            destination: venue.destination,
            countryCode: venue.countryCode,
            country: venue.country,
            tripVenues: [
              ...(acc?.[venueDestinationKey]?.tripVenues || []),
              { ...item, destinationMapKey: index + 1 },
            ],
          },
        }
      }, {}),
    [sortedTripVenues]
  )

  const openRemoveModal = React.useCallback(
    (tripVenueId) =>
      openModal({
        type: MODAL_TYPES.REMOVE_VENUE_MODAL,
        id: tripVenueId,
        onSuccess: async () => {
          if (tripVenueId === activeVenue?.id) {
            setActiveVenue(null)
          }
          await refetch()
        },
      }),
    [activeVenue, openModal, refetch]
  )

  React.useEffect(() => {
    if (trip && !trip.tripVenues.length) {
      history.push(``)
      toast.info(
        'Trip has no venues, please add venues to trip to visit trip page.'
      )
    }
  }, [history, trip])

  React.useEffect(() => {
    if (!isSignedIn && !isSigningIn) {
      history.push(``)
      toast.info('You have to be logged in to access this page.')
    }
  }, [history, isSignedIn, isSigningIn])

  React.useEffect(() => {
    if (isCopyModalOpen && mobileInput) {
      mobileInput.focus()
      mobileInput.select()
    }
  }, [isCopyModalOpen, mobileInput])

  const [tabs, setTabs] = React.useState(['Venue shortlist']);
  const [activeTab, setActiveTab] = React.useState(tabs[0]);

  React.useEffect(() => {
    if (trip && trip.isProposal) {
      setTabs(['Trip requirements', 'Venue shortlist'])
    } else {
      setTabs(['Venue shortlist'])
    }
  }, [trip, setActiveTab])

  React.useEffect(() => {
    setActiveTab(tabs[0])
  }, [tabs])


  const [uploadLogo, { loading: fileUploading }] = useMutation(TRIP_LOGO_UPLOAD_MUTATION);
  const [removeLogo] = useMutation(REMOVE_TRIP_LOGO_MUTATION);

  const hiddenFileInput = React.useRef(null);
  const handleFileUploadClick = (_) => {
    if (fileUploading) return
    hiddenFileInput.current.click();
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const response = await uploadLogo({ variables: { file, tripId: trip.id } })
    setTripLogoUrl(response.data.uploadTripLogo)
  };
  const removeTripLogo = async () => {
    setTripLogoUrl(null)
    await removeLogo({ variables: { tripId: trip.id } })
  }

  if (loading) {
    return <SkeletonLoader />
  }


  return (
    <Media>
      {(matches) => (
        <Page>
          <Helmet titleTemplate="NextRetreat | %s" title={trip?.name} />
          <TripImage
            pictureUrl={trip?.heroUrl ||
              sortedTripVenues?.find(
                (tripVenue) => tripVenue.venue.thumbnailUrls.length
              )?.venue.thumbnailUrls[0]
            }
          >
            <TripHeaderBox
              position="relative"
              maxWidth={{
                desktop: math(
                  `${rem(LEFT_COLUMN_WIDTH)} + ${rem(RIGHT_COLUMN_WIDTH)} + ${space.l
                  }`
                ),
              }}
              m="0 auto"
              width="100%"
              height="100%"
            >
              <Box
                position="absolute"
                bottom={{ mobile: 0, desktop: isTripAdmin ? 'l' : 'xl' }}
                width="100%"
              >
                {trip && trip.isProposal && (
                  <>
                    {trip && tripLogoUrl && (
                      <TripLogoContainer>
                        <TripLogo src={tripLogoUrl}></TripLogo>
                        {isTripAdmin && (<TripLogoDelete src={xMarkIcon} onClick={removeTripLogo}></TripLogoDelete>)}
                      </TripLogoContainer>
                    )}
                    {trip && !tripLogoUrl && isTripAdmin && (
                      <>
                        <UploadButton onClick={handleFileUploadClick}>
                          <UploadButtonText as="p" px="m" py="s">{fileUploading ? 'Uploading...' : 'Upload logo'}</UploadButtonText>
                        </UploadButton>
                        <input
                          type="file"
                          ref={hiddenFileInput}
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                      </>
                    )}
                    <Flex py="s" alignItems="center">
                      <Text
                        as="p"
                        color={COLORS.WHITE}
                        fontSize={{ mobile: 'xl', desktop: 'xxxxl' }}
                        fontWeight="bold"
                        mr="m"
                        maxWidth={{ mobile: '80%', desktop: 'initial' }}
                      >
                        {trip.name}
                      </Text>
                      {isTripAdmin && (
                        <StyledEditIcon
                          src={editIcon}
                          alt="edit"
                          onClick={() =>
                            openModal({
                              type: MODAL_TYPES.UPDATE_MODAL,
                              id: trip.id,
                              onSuccess: async () => {
                                await refetch()
                              },
                            })
                          }
                        />
                      )}
                    </Flex>
                    <Flex alignItems="center">
                      <Text
                        color={COLORS.WHITE}
                        fontSize="l"
                        fontWeight="semi_bold"
                      >
                        {`${Object.keys(tripVenuesByDestination).length
                          } destination${Object.keys(tripVenuesByDestination).length !== 1
                            ? 's'
                            : ''
                          }`}
                      </Text>
                      <StyledDot />
                      <Text color={COLORS.WHITE} fontSize="m">
                        {`${trip.tripVenues.length} venue${trip.tripVenues.length !== 1 ? 's' : ''
                          }`}
                      </Text>
                    </Flex>
                  </>
                )}
              </Box>
              {isTripAdmin && (
                <Box
                  position="absolute"
                  bottom={{ mobile: 'initial', desktop: 'l' }}
                  right={{ mobile: 'initial', desktop: 0 }}
                >
                  <StyledInfoIcon src={infoWhiteIcon} alt="info" />
                  <Text color={COLORS.WHITE} fontSize="m">
                    You are the creator of this trip
                  </Text>
                </Box>
              )}
            </TripHeaderBox>
          </TripImage>
          {!matches.mobile && !matches.tablet && trip && trip.isProposal && isTripAdmin && (
            <ProposalManagementBox>
              <Box
                maxWidth={{
                  desktop: math(
                    `${rem(LEFT_COLUMN_WIDTH)} + ${rem(RIGHT_COLUMN_WIDTH)} + ${space.l
                    }`
                  ),
                }}
                m="0 auto"
              >
                <Flex justifyContent="space-between">
                  <ProposalManagementButton onClick={openVariationsModal}>Add dates and prices</ProposalManagementButton>
                  <ProposalManagementButton onClick={openTripShareModal}>Share with user</ProposalManagementButton>
                </Flex>
              </Box>
            </ProposalManagementBox>
          )}
          <Box
            maxWidth={{
              desktop: math(
                `${rem(LEFT_COLUMN_WIDTH)} + ${rem(RIGHT_COLUMN_WIDTH)} + ${space.l
                }`
              ),
            }}
            m="0 auto"
          >
            <>
              {matches.mobile && trip && trip.isProposal && (
                <EstiamtedCostFlex flexDirection="column" p="m">
                  <Text as="p">Estimated cost</Text>
                  <Text
                    as="p"
                    fontSize="l"
                    fontWeight="semi_bold">{minPrice} € {maxPrice ? '- ' + maxPrice + '€' : ''}</Text>
                </EstiamtedCostFlex>
              )}
              <StyledHeaderContainer
                justifyContent="space-between"
                alignItems="baseline"
                ml={{ mobile: 'm', desktop: 's' }}
                mr={{ mobile: 'm', desktop: 0 }}
                mt="m"
              >
                <ButtonGroup>
                  {tabs.map(type => (
                    <Tab
                      key={type}
                      active={activeTab === type}
                      onClick={() => setActiveTab(type)}
                    >
                      {type}
                    </Tab>
                  ))}
                </ButtonGroup>
                <Box>
                  <Flex display={{ mobile: 'none', desktop: 'flex' }}>
                    <CopyToClipboard
                      text={tripShareToken}
                      onCopy={() => {
                        logGTMEvent({ event: GTM_EVENTS.shareTrip })
                        toast.success('Copied to clipboard')
                      }}
                    >
                      <ShareTripWrapper alignItems="center">
                        <ShareTripIconWrapper src={shareIcon} alt="share" />
                        <Text>Share trip with colleagues</Text>
                      </ShareTripWrapper>
                    </CopyToClipboard>
                    <Box width={rem(285)} ml="l">
                      <Input
                        name="shareToken"
                        value={tripShareToken}
                        readOnly
                      />
                    </Box>
                  </Flex>
                  <ShareTripWrapper
                    alignItems="center"
                    onClick={openCopyModal}
                    display={{ desktop: 'none' }}
                  >
                    <ShareTripIconWrapper src={shareIcon} alt="share" />
                    <Text>Share</Text>
                  </ShareTripWrapper>
                </Box>
              </StyledHeaderContainer>

              {matches.tablet && trip && trip.isProposal && (
                <EstiamtedCostFlex flexDirection="column" p="m">
                  <Text as="p">Estimated cost</Text>
                  <Text
                    as="p"
                    fontSize="l"
                    fontWeight="semi_bold">{minPrice} € {maxPrice ? '- ' + maxPrice + '€' : ''}</Text>
                </EstiamtedCostFlex>
              )}

              {activeTab === 'Trip requirements' && (
                <TripRequirements requirements={trip?.requirements}></TripRequirements>
              )}
              {activeTab === 'Venue shortlist' && (
                <>
                  <Box
                    height={{ mobile: rem(240), desktop: rem(320) }}
                    mt={{ mobile: 0, desktop: 'm' }}
                  >
                    <Map
                      venues={sortedTripVenues.map((tripVenue) => tripVenue.venue)}
                      activeVenueId={activeVenue?.id}
                      setActiveVenue={setActiveVenue}
                    />
                  </Box>
                  <Box
                    display={{ desktop: 'none' }}
                    ml="s"
                    mt={isTripAdmin ? `-${SLIDE_HEIGHT / 2}px` : space.l}
                  >
                    <VenueSlider
                      activeVenueId={activeVenue?.id}
                      setActiveVenue={setActiveVenue}
                      tripVenues={sortedTripVenues}
                      onRemoveButtonClick={openRemoveModal}
                    />
                  </Box>
                  {isTripAdmin && trip && !trip.isProposal && (
                    <Flex
                      flexDirection="column"
                      px="m"
                      my="l"
                      width="100%"
                      display={{ desktop: 'none' }}
                    >
                      <Text fontSize="m" color={COLORS.SPACE_CADET}>
                        Request pricing, availibity and other information for your
                        shortlisted venues.
                      </Text>
                      <Box mt="m">
                        <Button.Secondary
                          isBlock
                          onClick={() => {
                            openModal({
                              type: MODAL_TYPES.ASK_QUESTION_MODAL,
                              tripId: id,
                            })
                          }}
                        >
                          Ask a Question
                        </Button.Secondary>
                      </Box>
                      <Box mt="m">
                        <Button.Primary
                          isBlock
                          onClick={() => {
                            openModal({
                              type: MODAL_TYPES.CHECK_AVAILABILITY_MODAL,
                              tripId: id,
                            })
                          }}
                        >
                          Check availability
                        </Button.Primary>
                      </Box>
                    </Flex>
                  )}
                  <Flex my="l">
                    <Box
                      display={{ mobile: 'none', desktop: 'block' }}
                      maxWidth={{
                        desktop: rem(LEFT_COLUMN_WIDTH),
                      }}
                      width="100%"
                      mr="l"
                    >
                      {trip && trip.isProposal && (<EstimatedCostBox p="m">
                        <Text as="p">Estimated cost</Text>
                        <Text
                          as="p"
                          fontSize="l"
                          fontWeight="semi_bold">{minPrice} € {maxPrice ? '- ' + maxPrice + '€' : ''}</Text>
                      </EstimatedCostBox>)}
                      <StyledVenuesContainer pb="l">
                        {!isTripAdmin && (
                          <Text
                            as="p"
                            fontSize="l"
                            fontWeight="semi_bold"
                            mt="m"
                            mb="l"
                            ml={math(`${space.m} + ${rem(NUMBER_WIDTH / 2)}`)}
                          >
                            Venue shortlist
                          </Text>
                        )}
                        {Object.values(tripVenuesByDestination).map(
                          (tripVenueDestination) => (
                            <React.Fragment key={tripVenueDestination.countryCode}>
                              <Flex
                                alignItems="center"
                                m="m"
                                ml={math(`${space.m} + ${rem(NUMBER_WIDTH / 2)}`)}
                              >
                                <StyledFlagImage
                                  src={requireDynamicFlag(
                                    tripVenueDestination.countryCode
                                  )}
                                  alt={tripVenueDestination.countryCode}
                                />
                                <Text>{`${tripVenueDestination.destination}, ${tripVenueDestination.country}`}</Text>
                              </Flex>
                              {tripVenueDestination.tripVenues.map((tripVenue) => (
                                <TripVenue
                                  key={tripVenue.id}
                                  onClick={() => setActiveVenue(tripVenue.venue)}
                                  onActionIconClick={(e) => {
                                    e.stopPropagation()
                                    openRemoveModal(tripVenue.id)
                                  }}
                                  text={tripVenue.venue.title}
                                  imageSrc={
                                    tripVenue.venue.thumbnailUrls[0] || tentCircleIcon
                                  }
                                  actionIconSrc={isTripAdmin ? xMarkIcon : undefined}
                                  number={tripVenue.destinationMapKey}
                                  isActive={activeVenue?.id === tripVenue.venue.id}
                                  isTripAdmin={isTripAdmin}
                                  variations={tripVariations}
                                  venueId={tripVenue.venue.id}
                                />
                              ))}
                            </React.Fragment>
                          )
                        )}
                        {isTripAdmin && trip && !trip.isProposal && (
                          <Flex flexDirection="column" px="l" mt="l">
                            <Text fontSize="m" color={COLORS.SPACE_CADET}>
                              Request pricing, availibity and other information for
                              your shortlisted venues.
                            </Text>
                            <Box mt="m">
                              <Button.Secondary
                                isBlock
                                onClick={() => {
                                  openModal({
                                    type: MODAL_TYPES.ASK_QUESTION_MODAL,
                                    tripId: id,
                                  })
                                }}
                              >
                                Ask a Question
                              </Button.Secondary>
                            </Box>
                            <Box mt="m">
                              <Button.Primary
                                isBlock
                                onClick={() => {
                                  openModal({
                                    type: MODAL_TYPES.CHECK_AVAILABILITY_MODAL,
                                    tripId: id,
                                  })
                                }}
                              >
                                Check availability
                              </Button.Primary>
                            </Box>
                          </Flex>
                        )}
                      </StyledVenuesContainer>
                    </Box>
                    <Box
                      width="100%"
                      maxWidth={{
                        desktop: rem(RIGHT_COLUMN_WIDTH),
                      }}
                    >
                      {activeVenue && <TripVenueDetail venueData={activeVenue} isProposal={trip?.isProposal} variations={tripVariations} />}
                    </Box>
                  </Flex>

                </>
              )}
            </>


          </Box>

          <Modal
            isOpen={isVariationsModalOpen}
            closeModal={closeVariationsModal}
            ariaLabel="Add dates and prices"
            customPadding="1rem">
            <VariationsModal
              tripVariations={tripVariations}
              setTripVariations={setTripVariations}
              venues={trip?.tripVenues}
              tripId={trip?.id}>
            </VariationsModal>
          </Modal>

          <Modal
            isOpen={isTripShareModalOpen}
            closeModal={closeTripShareModal}
            ariaLabel="Share"
            customPadding="padding:1rem"
            contentWidth={rem('650px')}>
            <TripShareModal tripId={trip?.id} tripName={trip?.name}></TripShareModal>
          </Modal>

          {(matches.mobile || matches.tablet) && (
            <Modal
              isOpen={isCopyModalOpen}
              closeModal={closeCopyModal}
              ariaLabel="Share trip with colleagues"
            >
              <Flex
                height="100%"
                flexDirection="column"
                justifyContent="space-between"
              >
                <Box>
                  <Text as="p" fontSize="xl" mb="l">
                    Share trip with colleagues
                  </Text>
                  {trip && trip.isProposal && (<Text as="p" fontSize="m" mb="l">
                    Note: Prices won't be shown
                  </Text>)}
                  <Input
                    name="shareToken"
                    value={tripShareToken}
                    readOnly
                    ref={(ref) => setMobileInput(ref)}
                  />
                </Box>
                <StyledModalFooter
                  py="s"
                  px="m"
                  mx={`-${space.m}`}
                  mb={`-${space.m}`}
                >
                  <CopyToClipboard
                    text={tripShareToken}
                    onCopy={() => {
                      logGTMEvent({ event: GTM_EVENTS.shareTrip })
                      toast.success('Copied to clipboard')
                    }}
                  >
                    <Button.Primary isBlock>Copy to clipboard</Button.Primary>
                  </CopyToClipboard>
                </StyledModalFooter>
              </Flex>
            </Modal>
          )}
        </Page>
      )}
    </Media>
  )
}

export default Trip
