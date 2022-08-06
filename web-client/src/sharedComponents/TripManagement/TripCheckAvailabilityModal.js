import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Formik, Field } from 'formik'
import { format, formatISO, parseISO } from 'date-fns'
import { space, fontSizes, fontWeights, COLORS } from 'Theme'
import { useAuth } from 'AuthProvider'
import { useTripManagement, MODAL_TYPES } from 'TripManagementProvider'
import { Text } from 'components/atoms/Typography'
import { Flex, Box } from 'components/atoms/Layout'
import Input from 'components/Input'
import Button from 'components/atoms/Button'
import {
  useTripCheckAvailability,
  FORM_FIELD_NAMES,
  validationSchema,
  MAX_SELECTED_VENUES,
} from 'hooks/trip/useTripCheckAvailability'
import RadioGroup from 'components/RadioGroup'
import CheckboxGroup from 'components/CheckboxGroup'
import Checkbox from 'components/Checkbox'
import Modal, { useModal } from 'components/Modal'
import AvailabilityCalendar from 'sharedComponents/AvailabilityCalendar'
import CountFilter from './CountFilter'
import { useGoogleTracking, GTM_EVENTS} from '../../hooks/useGoogleTracking'

const StyledForm = styled.form`
  width: 100%;
`

const StyledLabel = styled(Text).attrs({ as: 'p' })`
  margin-bottom: ${space.s};
  font-size: ${fontSizes.s};
  font-weight: ${fontWeights.semi_bold};
  color: ${COLORS.SPACE_CADET};
`

const StyledModal = styled(Modal)`
  padding-bottom: 0;
`

const StyledFlex = styled(Flex)`
  flex-direction: column;
  border-bottom: 1px solid ${COLORS.IRRADIANT_IRIS};
  padding-bottom: ${space.l};
`

const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  flex-direction: column;

  & > :not(:last-child) {
    margin-bottom: ${space.s};
  }
`

const StyledPillsContainer = styled(Flex)`
  & > * {
    margin-left: ${space.s};
  }
`

const TripCheckAvailabilityModal = ({
  isOpen,
  closeModal,
  onSuccess,
  tripId,
}) => {
  const [tripCheckAvailability] = useTripCheckAvailability()
  const { openModal } = useTripManagement()
  const { user, userTrips } = useAuth()
  const { legGTMEvent } = useGoogleTracking()
  const {
    isOpen: isCalendarModalOpen,
    openModal: openCalendarModal,
    closeModal: closeCalendarModal,
  } = useModal()

  const renderAvailabilityCalendar = React.useCallback(
    ({ values, fieldName, setFieldValue }) => (
      <AvailabilityCalendar
        startDate={
          values[fieldName].from ? parseISO(values[fieldName].from) : undefined
        }
        endDate={
          values[fieldName].to ? parseISO(values[fieldName].to) : undefined
        }
        closeModal={closeCalendarModal}
        onApply={({ startDate, endDate }) =>
          setFieldValue([fieldName], {
            from: startDate && formatISO(startDate, { representation: 'date' }),
            to: endDate && formatISO(endDate, { representation: 'date' }),
          })
        }
        selectButtonText="Select dates"
      />
    ),
    [closeCalendarModal]
  )

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      ariaLabel="Check availability"
    >
      <Text fontWeight="bold" fontSize="xxl" as="p" mb="l">
        Check availability
      </Text>
      <Formik
        initialValues={{
          [FORM_FIELD_NAMES.EXACT_DATE]: true,
          [FORM_FIELD_NAMES.NIGHTS_COUNT]: 1,
          [FORM_FIELD_NAMES.EXACT_PEOPLE_COUNT]: 1,
          [FORM_FIELD_NAMES.APPROX_PEOPLE_COUNT]: 1,
          [FORM_FIELD_NAMES.EXACT_DATE_RANGE]: { from: '', to: '' },
          [FORM_FIELD_NAMES.APPROX_DATE_RANGE]: { from: '', to: '' },
          [FORM_FIELD_NAMES.VENUES]: [],
          [FORM_FIELD_NAMES.FULL_NAME]: '',
          [FORM_FIELD_NAMES.COMPANY_NAME]: '',
          [FORM_FIELD_NAMES.COMPANY_COUNTRY]: '',
          [FORM_FIELD_NAMES.EMAIL]: user ? user.email : '',
          [FORM_FIELD_NAMES.PHONE_NUMBER]: '',
        }}
        validationSchema={validationSchema}
        validateOnMount
        onSubmit={async ({
          venues,
          exactDate,
          nightsCount,
          exactPeopleCount,
          exactDateRange,
          approxPeopleCount,
          approxDateRange,
          ...values
        }) => {
          try {
            const response = await tripCheckAvailability({
              variables: {
                input: {
                  ...values,
                  venueIds: venues.map(Number),
                  exactDate,
                  peopleCount: exactDate ? exactPeopleCount : approxPeopleCount,
                  dateRange: exactDate ? exactDateRange : approxDateRange,
                  nightsCount: exactDate ? undefined : nightsCount,
                },
              },
            })
            if (onSuccess) {
              await onSuccess(response?.data?.tripAskQuestion)
            }
            legGTMEvent({event: GTM_EVENTS.legGTMEvent, type: MODAL_TYPES.CHECK_AVAILABILITY_MODAL})
            closeModal()
            openModal({
              type: MODAL_TYPES.SUCCESS_FORM_REQUEST_MODAL,
              title: 'Your Request for Quote has been sent!',
            })
          } catch {
            // do nothing
          }
        }}
      >
        {({ handleSubmit, isValid, isSubmitting, setFieldValue, values }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Flex mb="l" flexDirection="column">
              <StyledLabel>
                When would you like to travel and how big is your team?
              </StyledLabel>
              <StyledRadioGroup
                isUnstyled
                selectedValue={values[FORM_FIELD_NAMES.EXACT_DATE]}
                onSelect={(value) =>
                  setFieldValue(FORM_FIELD_NAMES.EXACT_DATE, value)
                }
              >
                <RadioGroup.CircleOption
                  value
                  label={
                    <Flex alignItems="center">
                      <Text>I know exact dates</Text>
                      <StyledPillsContainer>
                        <Button.Pill
                          disabled={!values[FORM_FIELD_NAMES.EXACT_DATE]}
                          isOutlined={
                            values[FORM_FIELD_NAMES.EXACT_DATE_RANGE].from &&
                            values[FORM_FIELD_NAMES.EXACT_DATE_RANGE].to
                          }
                          onClick={openCalendarModal}
                        >
                          {values[FORM_FIELD_NAMES.EXACT_DATE_RANGE].from &&
                          values[FORM_FIELD_NAMES.EXACT_DATE_RANGE].to
                            ? `${format(
                                parseISO(
                                  values[FORM_FIELD_NAMES.EXACT_DATE_RANGE].from
                                ),
                                'MMM d'
                              )} - ${format(
                                parseISO(
                                  values[FORM_FIELD_NAMES.EXACT_DATE_RANGE].to
                                ),
                                'MMM d'
                              )}`
                            : 'Select dates'}
                        </Button.Pill>
                        <CountFilter
                          isDisabled={!values[FORM_FIELD_NAMES.EXACT_DATE]}
                          count={values[FORM_FIELD_NAMES.EXACT_PEOPLE_COUNT]}
                          setCount={(count) => {
                            setFieldValue(
                              FORM_FIELD_NAMES.EXACT_PEOPLE_COUNT,
                              count
                            )
                          }}
                          label={`${
                            values[FORM_FIELD_NAMES.EXACT_PEOPLE_COUNT]
                          } people`}
                          text="Number of people"
                        />
                      </StyledPillsContainer>
                    </Flex>
                  }
                />
                <RadioGroup.CircleOption
                  value={false}
                  label={
                    <Flex>
                      <Text>I know approximate dates</Text>
                      <StyledPillsContainer>
                        <Button.Pill
                          disabled={values[FORM_FIELD_NAMES.EXACT_DATE]}
                          isOutlined={
                            values[FORM_FIELD_NAMES.APPROX_DATE_RANGE].from &&
                            values[FORM_FIELD_NAMES.APPROX_DATE_RANGE].to
                          }
                          onClick={openCalendarModal}
                        >
                          {values[FORM_FIELD_NAMES.APPROX_DATE_RANGE].from &&
                          values[FORM_FIELD_NAMES.APPROX_DATE_RANGE].to
                            ? `${format(
                                parseISO(
                                  values[FORM_FIELD_NAMES.APPROX_DATE_RANGE]
                                    .from
                                ),
                                'MMM d'
                              )} - ${format(
                                parseISO(
                                  values[FORM_FIELD_NAMES.APPROX_DATE_RANGE].to
                                ),
                                'MMM d'
                              )}`
                            : 'Select dates'}
                        </Button.Pill>
                        <CountFilter
                          isDisabled={values[FORM_FIELD_NAMES.EXACT_DATE]}
                          count={values[FORM_FIELD_NAMES.NIGHTS_COUNT]}
                          setCount={(count) => {
                            setFieldValue(FORM_FIELD_NAMES.NIGHTS_COUNT, count)
                          }}
                          label={`${
                            values[FORM_FIELD_NAMES.NIGHTS_COUNT]
                          } nights`}
                          text="Number of nights"
                        />
                        <CountFilter
                          isDisabled={values[FORM_FIELD_NAMES.EXACT_DATE]}
                          count={values[FORM_FIELD_NAMES.APPROX_PEOPLE_COUNT]}
                          setCount={(count) => {
                            setFieldValue(
                              FORM_FIELD_NAMES.APPROX_PEOPLE_COUNT,
                              count
                            )
                          }}
                          label={`${
                            values[FORM_FIELD_NAMES.APPROX_PEOPLE_COUNT]
                          } people`}
                          text="Number of people"
                        />
                      </StyledPillsContainer>
                    </Flex>
                  }
                />
              </StyledRadioGroup>
            </Flex>
            <StyledFlex>
              <StyledLabel>
                Request availability and pricing for these venues (max 3)
              </StyledLabel>
              <CheckboxGroup
                enabledItems={values[FORM_FIELD_NAMES.VENUES]}
                onChange={(checkboxValues) => {
                  if (checkboxValues.length <= MAX_SELECTED_VENUES) {
                    setFieldValue(FORM_FIELD_NAMES.VENUES, checkboxValues)
                  }
                }}
              >
                {userTrips
                  .find((trip) => trip.id === tripId)
                  .tripVenues.map((tripVenue) => (
                    <Checkbox
                      key={tripVenue.id}
                      value={tripVenue.venue.id}
                      isDisabled={
                        values[FORM_FIELD_NAMES.VENUES].length >=
                          MAX_SELECTED_VENUES &&
                        !values[FORM_FIELD_NAMES.VENUES].includes(
                          tripVenue.venue.id
                        )
                      }
                    >
                      {tripVenue.venue.title}
                    </Checkbox>
                  ))}
              </CheckboxGroup>
            </StyledFlex>
            <Flex flexDirection={{ mobile: 'column', tablet: 'row' }} mt="m">
              <Box flex="1">
                <StyledLabel>Your name</StyledLabel>
                <Field name={FORM_FIELD_NAMES.FULL_NAME}>
                  {({ field, meta }) => (
                    <Input
                      placeholder="Jane Doe"
                      isInvalid={meta.touched && meta.error !== undefined}
                      required
                      {...field}
                    />
                  )}
                </Field>
              </Box>
              <Box
                flex="1"
                ml={{ mobile: 0, tablet: 'm' }}
                mt={{ mobile: 'm', tablet: 0 }}
                mb="m"
              >
                <StyledLabel>Company Name</StyledLabel>
                <Field name={FORM_FIELD_NAMES.COMPANY_NAME}>
                  {({ field, meta }) => (
                    <Input
                      placeholder="company"
                      isInvalid={meta.touched && meta.error !== undefined}
                      required
                      {...field}
                    />
                  )}
                </Field>
              </Box>
            </Flex>
            <Flex flexDirection={{ mobile: 'column', tablet: 'row' }}>
              <Box flex="1">
                <StyledLabel>Your Email</StyledLabel>
                <Field name={FORM_FIELD_NAMES.EMAIL}>
                  {({ field, meta }) => (
                    <Input
                      placeholder="email@domain.com"
                      isInvalid={meta.touched && meta.error !== undefined}
                      required
                      {...field}
                    />
                  )}
                </Field>
              </Box>
              <Box
                flex="1"
                ml={{ mobile: 0, tablet: 'm' }}
                mt={{ mobile: 'm', tablet: 0 }}
                mb="m"
              >
                <StyledLabel>Company country</StyledLabel>
                <Field name={FORM_FIELD_NAMES.COMPANY_COUNTRY}>
                  {({ field, meta }) => (
                    <Input
                      placeholder="company country"
                      isInvalid={meta.touched && meta.error !== undefined}
                      required
                      {...field}
                    />
                  )}
                </Field>
              </Box>
            </Flex>
            <Flex flexDirection={{ mobile: 'column', tablet: 'row' }} mb="m">
              <Box flex="1">
                <StyledLabel>Phone number</StyledLabel>
                <Field name={FORM_FIELD_NAMES.PHONE_NUMBER}>
                  {({ field, meta }) => (
                    <Input
                      placeholder="+421915555555"
                      isInvalid={meta.touched && meta.error !== undefined}
                      required
                      {...field}
                    />
                  )}
                </Field>
              </Box>
              <Box flex="1" ml={{ mobile: 0, tablet: 'm' }} />
            </Flex>
            <Button.Primary
              disabled={!isValid || isSubmitting}
              isBlock
              type="submit"
            >
              Send Request
            </Button.Primary>
            <StyledModal
              isOpen={isCalendarModalOpen}
              closeModal={closeCalendarModal}
              hasCloseButton={false}
              ariaLabel="Availability calendar modal"
            >
              {renderAvailabilityCalendar({
                values,
                fieldName: values[FORM_FIELD_NAMES.EXACT_DATE]
                  ? FORM_FIELD_NAMES.EXACT_DATE_RANGE
                  : FORM_FIELD_NAMES.APPROX_DATE_RANGE,
                setFieldValue,
              })}
            </StyledModal>
          </StyledForm>
        )}
      </Formik>
    </Modal>
  )
}

TripCheckAvailabilityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  tripId: PropTypes.number.isRequired,
}

export default TripCheckAvailabilityModal
