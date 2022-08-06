import React, {useEffect} from 'react'
import {Helmet} from 'react-helmet'
import {rem} from 'polished'
import {Formik, Field} from 'formik'
import styled from 'styled-components'
import {toast} from 'react-toastify'
import Page from 'sharedComponents/Page'
import {useAuth} from 'AuthProvider'
import {
  space,
  mq,
  COLORS,
  fontSizes,
  fontWeights,
} from 'Theme'
import Modal from 'components/Modal'
import Input from 'components/Input'
import Button from 'components/atoms/Button'
import {Flex, Box} from 'components/atoms/Layout'
import {Text, H1, H5, H6} from 'components/atoms/Typography'
import userIcon from 'assets/images/svg/user.svg'
import {
  useCreateTrip,
  FORM_FIELD_NAMES,
  validationSchema,
} from 'hooks/trip/useCreateTrip'
import tentIcon from 'assets/images/svg/tent.svg'
import addTripIcon from 'assets/images/svg/add-trip.svg'
import {useTripManagement, MODAL_TYPES} from 'TripManagementProvider'
import TripCard from './TripCard'
import Pagination from 'components/organisms/Pagination'
import SignPostImg from 'assets/images/signpost.png'

const StyledForm = styled.form`
  width: 100%;
`
const customButtonStyles = `
  cursor: pointer;
  text-decoration: none;
  border-style:none;
`

const StyledSecondaryButton = styled("button")`
  ${customButtonStyles}
`

const CreateCard = styled(Box)`
    height:229px;
    border-radius: 5px;
    cursor:pointer;
    text-align-last: center;
    box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
    border-radius: 8px;
`

const P = styled('p')`
    font-weight: ${fontWeights.normal};
    font-size: ${fontSizes.l};
    line-height: ${rem(21)};
    margin-top: ${rem(20)};
    color: ${COLORS.SPACE_CADET};
`
const LogText = styled('p')`
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 20px;
    display: flex;
    align-items: center;
    margin-bottom: ${rem(47)};
`
const TripType = styled('p')`
    font-weight: ${fontWeights.semi_bold};
    font-size: ${fontSizes.xxl};
    line-height: ${rem(29)};
    margin-top: ${rem(47)};
`
const StyledImage = styled.img`
    width: ${rem('50px')};
    height: ${rem('50px')};
    border-radius: 50%;
`
const SearchBox = styled(Box)`
    margin-top: ${space.l};
    ${mq.from.desktop`
      width: 23%;
      float: right;
      margin: -3% 0;    
    `}
`
const Hr = styled("div")`
    width: 100%;
    height: 1px;
    margin-left: 0px;
    margin-bottom: 37px;
    margin:46px 0 37px 0;
    background: rgb(13 64 128 / 19%);
`
const AccountBox = styled(Box)`
    margin: ${space.m}; 
    ${mq.from.desktop`
      margin: 75px 135px 0 160px;    
    `}
    
`
const TripFlex = styled(Flex)`
    display: grid;
    grid-template-columns: auto;
    ${mq.from.tablet`
      grid-template-columns: auto auto;    
    `}
    ${mq.from.desktop`
      grid-template-columns: auto auto auto auto;    
    `}
    grid-gap: ${rem(24)};
    margin-top: ${space.l};
`
const CustomPagination = styled(Pagination)`
    margin: 46px 0 46px 0;
    width:97%;
`

const getPaginationInfo = ({
                             limit,
                             currentPage,
                             totalCount,
                             currentCount,
                           }) => {
  const base = limit * (currentPage - 1)
  const from = base + 1
  const to = base + Math.min(limit, currentCount)
  const total = totalCount > 500 ? '500+' : totalCount

  return `${from}-${to} of ${total} retreat trips`
}

const Account = () => {

  const {
    isFirstTripModalOpened,
    setIsFirstTripModalOpened,
    refetchData,
    signOut,
    isSignedIn,
    user,
    data
  } = useAuth();
  const [createTrip] = useCreateTrip();
  const metaTitle = 'My account page';
  const {openModal} = useTripManagement();

  // initialize Trips data and panigation
  const [userTripsData, setUserTripsData] = React.useState([])
  const [userTripLists, setUserTripLists] = React.useState()
  const [searchFlag, setSearchFlag] = React.useState(false)
  const [pagination, setPagination] = React.useState({
    firstPage: 0,
    lastPage: 0,
    previousPage: 0,
    nextPage: 0,
    currentPage: 0,
    totalCount: 0,
    currentCount: 0
  })

  useEffect(() => {
    if (data.userMe) {
      const tripNumber = data?.userMe?.trips.length
      setUserTripsData([{name: '', id: 'create'}, ...data?.userMe?.trips])
      setPagination({
        firstPage: 1,
        lastPage: tripNumber % 8 === 0 ? Math.ceil(tripNumber / 8) + 1 : Math.ceil(tripNumber / 8),
        previousPage: null,
        nextPage: tripNumber / 8 >= 1 ? 2 : null,
        currentPage: 1,
        totalCount: tripNumber + 1,
        currentCount: (tripNumber + 1) > 7 ? 8 : tripNumber
      })
    }
  }, [data])

  // activate the panigation
  const setActivePage = (page) => {
    setPagination({
      ...pagination,
      previousPage: page - 1 > 0 ? page - 1 : null,
      currentPage: page,
      nextPage: page + 1 > pagination.lastPage ? null : page + 1,
      currentCount: page < pagination.lastPage ? 8 : (pagination.totalCount % 8)
    })
  }

  // render UserTripLists
  const tripLists = userTripsData.map((userTrip, index) =>
    (index >= (pagination.currentPage - 1) * 8 && index < pagination.currentPage * 8) && (
      !(userTrip.name) ?
        (<CreateCard
          key={userTrip.id}
          onClick={() => {
            openModal({
              type: MODAL_TYPES.CREATE_MODAL,
            })
          }}
        >
          <Box position="relative" top="30%">
            <StyledImage src={addTripIcon} alt="" />
            <H6
              mt={rem(12)}
              fontWeight={fontWeights.semi_bold}
              lineHeight={rem(20)}
              letterSpacing={rem(-0.3)}
            >
              Create New Trip
            </H6>
          </Box>
        </CreateCard>) :
        (<TripCard userTrip={userTrip} key={userTrip.id} />))
  )
  // Search trips
  const searchTrips = (e) => {
    let dataLists = userTripsData.map((userTrip) =>
      userTrip.name.toLowerCase().includes(e.target.value) && (
        <TripCard userTrip={userTrip} key={userTrip.id}/>
      )
    )
    let checkerResult = arr => arr.every(v => v === false);
    if (checkerResult(dataLists)) {
      dataLists = <Box m={'auto'} padding={'10%'}>
        <StyledImage style={{marginLeft: "38%"}} src={SignPostImg}/>
        <H5>There are no results for "{e.target.value}"</H5>
      </Box>
      setUserTripLists(dataLists)
    } else {
      setUserTripLists(dataLists)
    }
    if (e.target.value !== '') {
      setSearchFlag(true)
    } else {
      setSearchFlag(false)
    }
  }
  // get sharedTripData
  const sharedTripsData = data?.userMe?.sharedTrips || []
  const sharedTripsLists = sharedTripsData.map((userTrip) => <TripCard userTrip={userTrip.trips[0]} flag={1}
                                                                       key={userTrip.id}/>)
  return (
    <>
      <Helmet titleTemplate="NextRetreat | %s" title={metaTitle}/>
      <Page goToPlan={true}>
        {isSignedIn &&
        (<AccountBox>
          <H1
            letterSpacing="-0.075rem"
          >
            My Account
          </H1>
          <Text
            color={COLORS.SPACE_CADET}
            mr="s"
          >
            You are logged in as
          </Text>
          <img
            src={userIcon}
            alt="userIcon"
          />
          <Text
            color={COLORS.SPACE_CADET}
            fontWeight="semi_bold"
            mx="s"
          >
            {user ? user.email : 'Account'}
          </Text>
          <StyledSecondaryButton
            onClick={signOut}
          >
            <Text
              color={COLORS.SPACE_CADET}
            >
              (Logout)
            </Text>
          </StyledSecondaryButton>
          <TripType>Saved trips</TripType>
          <P>
            Here you can find the list of your saved trips
          </P>
          {userTripsData.length > 1 &&
            (<SearchBox>
              <Input.Search
                onChange={searchTrips}
                placeholder="Search Trips"
              />
            </SearchBox>)
          }
          <TripFlex>
            {searchFlag ? userTripLists : tripLists}
          </TripFlex>
          {pagination.totalCount > 8 && !searchFlag && (<CustomPagination
            firstPage={pagination.firstPage}
            lastPage={pagination.lastPage}
            currentPage={pagination.currentPage}
            previousPage={pagination.previousPage}
            nextPage={pagination.nextPage}
            onNextClick={setActivePage}
            onPrevClick={setActivePage}
            onPageClick={setActivePage}

            info={getPaginationInfo({
              limit: 8,
              currentPage: pagination.currentPage,
              totalCount: pagination.totalCount,
              currentCount: pagination.currentCount,
            })}
          />)}
          {sharedTripsData.length > 0 && (
            <>
              <Hr/>

              <TripType mt="3rem">Shared with me</TripType>
              <P>Trips created by others, shared with you</P>
              <TripFlex mb="3rem">
                {sharedTripsLists}
              </TripFlex>
            </>
          )}
        </AccountBox>)
        }
      </Page>
      <Modal
        isOpen={isFirstTripModalOpened}
        closeModal={() => setIsFirstTripModalOpened(false)}
        ariaLabel="Create first trip modal"
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          maxWidth={rem(420)}
          alignSelf="center"
          m="auto"
          py="s"
        >
          <Box mb="m">
            <img src={tentIcon} alt=""/>
          </Box>
          <Flex flexDirection="column" px="m" mb="m">
            <Text
              textAlign="center"
              fontSize="xxxl"
              fontWeight="semi_bold"
              color={COLORS.SPACE_CADET}
              mb="s"
            >
              How would you like to name your first team trip?
            </Text>
            <Text as="p" textAlign="center">
              Our past customers chose names like “Hotjar summer retreat”, or
              “Convers.io team trip”.
            </Text>
          </Flex>
          <Formik
            initialValues={{
              [FORM_FIELD_NAMES.NAME]: '',
            }}
            validationSchema={validationSchema}
            validateOnMount
            onSubmit={async (values) => {
              try {
                await createTrip({
                  variables: {input: values},
                })
                await refetchData()
                toast('Trip created')
                setIsFirstTripModalOpened(false)
              } catch {
                // do nothing
              }
            }}
          >
            {({handleSubmit, isValid, isSubmitting}) => (
              <StyledForm onSubmit={handleSubmit}>
                <Field name={FORM_FIELD_NAMES.NAME}>
                  {({field, meta}) => (
                    <Input
                      placeholder="Enter team trip name"
                      isInvalid={meta.touched && meta.error !== undefined}
                      required
                      mb="m"
                      {...field}
                    />
                  )}
                </Field>
                <Button.Primary
                  disabled={!isValid || isSubmitting}
                  isBlock
                  type="submit"
                >
                  Create Trip
                </Button.Primary>
              </StyledForm>
            )}
          </Formik>
        </Flex>
      </Modal>
    </>
  )
}

export default Account
