import React from 'react'
import { Helmet } from 'react-helmet'
import { rem } from 'polished'
import { Formik, Field } from 'formik'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import Page from 'sharedComponents/Page'
import DomesticTravelProvider from 'DomesticTravelProvider'
import { useAuth } from 'AuthProvider'
import { COLORS } from 'Theme'
import Modal from 'components/Modal'
import Input from 'components/Input'
import Button from 'components/atoms/Button'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import {
  useCreateTrip,
  FORM_FIELD_NAMES,
  validationSchema,
} from 'hooks/trip/useCreateTrip'
import tentIcon from 'assets/images/svg/tent.svg'
import VenueDetail from './components/VenueDetail'
import Venues from './components/Venues'
import Destinations from './components/Destinations'
import OriginLocations from './components/OriginLocations'
import Summary from './components/Summary'
import { STEP_NAMES } from './constants'
import { useSteps } from './useSteps'

const StyledForm = styled.form`
  width: 100%;
`

const getCurrentStep = (searchKeys) => {
  const areKeysInURL = (keys) => searchKeys.every((item) => keys.includes(item))

  switch (true) {
    case areKeysInURL([STEP_NAMES.originLocations]):
    default:
      return STEP_NAMES.originLocations
    case areKeysInURL([STEP_NAMES.originLocations, STEP_NAMES.destination]):
      return STEP_NAMES.destination
    case areKeysInURL([
      STEP_NAMES.originLocations,
      STEP_NAMES.destination,
      STEP_NAMES.venue,
    ]):
      return STEP_NAMES.venue
    case areKeysInURL([
      STEP_NAMES.originLocations,
      STEP_NAMES.destination,
      STEP_NAMES.venue,
      STEP_NAMES.detail,
    ]):
      return STEP_NAMES.detail
    case areKeysInURL([
      STEP_NAMES.originLocations,
      STEP_NAMES.destination,
      STEP_NAMES.venue,
      STEP_NAMES.detail,
      STEP_NAMES.summary,
    ]):
      return STEP_NAMES.summary
  }
}

const getStepComponent = (stepName) => {
  switch (stepName) {
    case STEP_NAMES.originLocations:
    default:
      return OriginLocations
    case STEP_NAMES.destination:
      return Destinations
    case STEP_NAMES.venue:
      return Venues
    case STEP_NAMES.detail:
      return VenueDetail
    case STEP_NAMES.summary:
      return Summary
  }
}

const getHotjarTrigger = (stepName, bookingId) => {
  switch (stepName) {
    case STEP_NAMES.originLocations:
      return 'origin_locations'
    case STEP_NAMES.destination:
      return 'destination_selection'
    case STEP_NAMES.venue:
      return 'venue_list'
    case STEP_NAMES.detail:
      return 'venue_detail'
    case STEP_NAMES.summary:
      return bookingId ? 'request_form_submitted' : 'request_form'
    default:
      return null
  }
}

const getMetaTitle = ({ currentStep, destinationName, venueName }) => {
  switch (currentStep) {
    case STEP_NAMES.originLocations:
      return 'Add Team Locations'
    case STEP_NAMES.destination:
      return 'Destination Selection'
    case STEP_NAMES.venue:
      return destinationName
        ? `${destinationName} - Venue Selection`
        : 'Venue Selection'
    case STEP_NAMES.detail:
      return venueName
    case STEP_NAMES.summary:
      return 'Booking Request'
    default:
      return null
  }
}

const Plan = () => {
  const {
    isFirstTripModalOpened,
    setIsFirstTripModalOpened,
    refetchData,
  } = useAuth()
  const [createTrip] = useCreateTrip()
  const [destinationName, setDestinationName] = React.useState('')
  const [venueName, setVenueName] = React.useState('')
  const [metaTitle, setMetaTitle] = React.useState('')

  const { stepData, updateStepData, getNextUrl } = useSteps()
  const bookingId = stepData?.summary?.bookingId
  const currentStep = getCurrentStep(Object.keys(stepData))
  const StepComponent = getStepComponent(currentStep)

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep, bookingId])

  React.useEffect(() => {
    const hotjarTrigger = getHotjarTrigger(currentStep, bookingId)

    if (window.hj && hotjarTrigger) {
      window.hj('trigger', hotjarTrigger)
    }
  }, [currentStep, bookingId])

  const handleDestinationNameChange = (name) => {
    setDestinationName(name)
  }

  const handleVenueNameChange = (name) => {
    setVenueName(name)
  }

  React.useEffect(() => {
    if (![STEP_NAMES.venue, STEP_NAMES.detail].includes(currentStep)) {
      setDestinationName('')
      setVenueName('')
    }
    setMetaTitle(getMetaTitle({ currentStep, destinationName, venueName }))
  }, [currentStep, destinationName, venueName])

  return (
    <DomesticTravelProvider>
      <Helmet titleTemplate="NextRetreat | %s" title={metaTitle} />
      <Page>
        <StepComponent
          stepData={stepData}
          updateStepData={updateStepData}
          getNextUrl={getNextUrl}
          setDestinationName={
            currentStep === STEP_NAMES.venue ? setDestinationName : undefined
          }
          setVenueName={
            currentStep === STEP_NAMES.detail ? setVenueName : undefined
          }
          onDestinationNameChange={handleDestinationNameChange}
          onVenueNameChange={handleVenueNameChange}
        />
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
            <img src={tentIcon} alt="" />
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
                  variables: { input: values },
                })
                await refetchData()
                toast('Trip created')
                setIsFirstTripModalOpened(false)
              } catch {
                // do nothing
              }
            }}
          >
            {({ handleSubmit, isValid, isSubmitting }) => (
              <StyledForm onSubmit={handleSubmit}>
                <Field name={FORM_FIELD_NAMES.NAME}>
                  {({ field, meta }) => (
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
    </DomesticTravelProvider>
  )
}

export default Plan
