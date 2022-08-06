import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Formik, Field } from 'formik'
import isRequiredIf from 'react-proptype-conditional-require'
import { space, fontSizes, fontWeights, COLORS } from 'Theme'
import { useAuth } from 'AuthProvider'
import { useTripManagement, MODAL_TYPES } from 'TripManagementProvider'
import { Text } from 'components/atoms/Typography'
import { Flex, Box } from 'components/atoms/Layout'
import Input from 'components/Input'
import Button from 'components/atoms/Button'
import {
  useTripAskQuestion,
  FORM_FIELD_NAMES,
  validationSchema,
} from 'hooks/trip/useTripAskQuestion'
import CheckboxGroup from 'components/CheckboxGroup'
import Checkbox from 'components/Checkbox'
import Modal from 'components/Modal'
import { useGoogleTracking, GTM_EVENTS } from '../../hooks/useGoogleTracking'

const StyledForm = styled.form`
  width: 100%;
`

const StyledLabel = styled(Text).attrs({ as: 'p' })`
  margin-bottom: ${space.s};
  font-size: ${fontSizes.s};
  font-weight: ${fontWeights.semi_bold};
  color: ${COLORS.SPACE_CADET};
`

const ALL_CHECKED_CHECKBOX_NAME = 'all'

const TripAskQuestionModal = ({
  isOpen,
  closeModal,
  onSuccess,
  tripId,
  venueId,
}) => {
  const [tripAskQuestion] = useTripAskQuestion()
  const { user, userTrips } = useAuth()
  const { legGTMEvent } = useGoogleTracking()
  const { openModal } = useTripManagement()
  const modalTrip = !venueId && userTrips.find((trip) => trip.id === tripId)
  return (
    <Modal isOpen={isOpen} closeModal={closeModal} ariaLabel="Ask a Question">
      <Text fontWeight="bold" fontSize="xxl" as="p" mb="l">
        Ask a Question
      </Text>
      <Formik
        initialValues={{
          [FORM_FIELD_NAMES.QUESTION]: '',
          [FORM_FIELD_NAMES.VENUES]: [...(venueId ? [venueId] : [])],
          [FORM_FIELD_NAMES.FULL_NAME]: '',
          [FORM_FIELD_NAMES.COMPANY_NAME]: '',
          [FORM_FIELD_NAMES.EMAIL]: user ? user.email : '',
          [FORM_FIELD_NAMES.PHONE_NUMBER]: '',
        }}
        validationSchema={validationSchema}
        validateOnMount
        onSubmit={async ({ venues, ...values }) => {
          try {
            const response = await tripAskQuestion({
              variables: {
                input: {
                  ...values,
                  venueIds: venues
                    .filter((venue) => venue !== ALL_CHECKED_CHECKBOX_NAME)
                    .map(Number),
                },
              },
            })
            if (onSuccess) {
              await onSuccess(response?.data?.tripAskQuestion)
            }
            legGTMEvent({
              event: GTM_EVENTS.legGTMEvent,
              type: MODAL_TYPES.ASK_QUESTION_MODAL,
            })
            closeModal()
            openModal({
              type: MODAL_TYPES.SUCCESS_FORM_REQUEST_MODAL,
              title: 'Your questions have been sent!',
            })
          } catch {
            // do nothing
          }
        }}
      >
        {({ handleSubmit, isValid, isSubmitting, setFieldValue, values }) => (
          <StyledForm onSubmit={handleSubmit}>
            <StyledLabel>
              What can we help you with regarding your selected venues?
            </StyledLabel>
            <Field name={FORM_FIELD_NAMES.QUESTION}>
              {({ field, meta }) => (
                <Input.Textarea
                  placeholder="Write a question"
                  isInvalid={meta.touched && meta.error !== undefined}
                  required
                  mb={venueId ? undefined : 'm'}
                  {...field}
                />
              )}
            </Field>
            {!venueId && modalTrip && (
              <>
                <StyledLabel>
                  Questions are related to these venues:
                </StyledLabel>
                <CheckboxGroup
                  enabledItems={values[FORM_FIELD_NAMES.VENUES]}
                  onChange={(checkboxValues) => {
                    if (checkboxValues.includes(ALL_CHECKED_CHECKBOX_NAME)) {
                      setFieldValue(FORM_FIELD_NAMES.VENUES, [
                        'all',
                        ...modalTrip.tripVenues.map(
                          (tripVenue) => tripVenue.venue.id
                        ),
                      ])
                    } else if (
                      values[FORM_FIELD_NAMES.VENUES].includes(
                        ALL_CHECKED_CHECKBOX_NAME
                      )
                    ) {
                      setFieldValue(FORM_FIELD_NAMES.VENUES, [])
                    } else {
                      setFieldValue(FORM_FIELD_NAMES.VENUES, checkboxValues)
                    }
                  }}
                >
                  <Checkbox value={ALL_CHECKED_CHECKBOX_NAME}>All</Checkbox>
                  {modalTrip.tripVenues.map((tripVenue) => (
                    <Checkbox key={tripVenue.id} value={tripVenue.venue.id}>
                      {tripVenue.venue.title}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </>
            )}
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
            </Flex>
            <Text fontSize="xs" as="p" textAlign="center" mb="m">
              By submitting this form, I agree to the TourRadar T&amp;Cs and
              Privacy policy.
            </Text>
            <Button.Primary
              disabled={!isValid || isSubmitting}
              isBlock
              type="submit"
            >
              Send Question
            </Button.Primary>
          </StyledForm>
        )}
      </Formik>
    </Modal>
  )
}

TripAskQuestionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  tripId: isRequiredIf(PropTypes.number, (props) => !props.venueId),
  venueId: isRequiredIf(PropTypes.number, (props) => !props.tripId),
}

export default TripAskQuestionModal
