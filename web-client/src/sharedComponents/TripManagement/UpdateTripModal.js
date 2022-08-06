import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Formik, Field } from 'formik'
import { toast } from 'react-toastify'
import { Text } from 'components/atoms/Typography'
import Input from 'components/Input'
import Button from 'components/atoms/Button'
import {
  useUpdateTrip,
  FORM_FIELD_NAMES,
  validationSchema,
} from 'hooks/trip/useUpdateTrip'
import TripModal from './TripModal'
import { MODAL_TYPES } from 'TripManagementProvider'
import { useGoogleTracking, GTM_EVENTS } from '../../hooks/useGoogleTracking'

const StyledForm = styled.form`
  width: 100%;
`

const UpdateTripModal = ({ isOpen, closeModal, onSuccess, id }) => {
  const [updateTrip] = useUpdateTrip()
  const { legGTMEvent } = useGoogleTracking()
  const [
    isSuccessActionExecuting,
    setIsSuccessActionExecuting,
  ] = React.useState(false)
  return (
    <TripModal isOpen={isOpen} closeModal={closeModal} title="Rename Trip">
      <Formik
        initialValues={{
          [FORM_FIELD_NAMES.NAME]: '',
        }}
        validationSchema={validationSchema}
        validateOnMount
        onSubmit={async (values) => {
          try {
            const response = await updateTrip({
              variables: { input: { ...values, id } },
            })
            setIsSuccessActionExecuting(true)
            if (onSuccess) {
              await onSuccess(response?.data?.updateTrip.id)
            }
            legGTMEvent({
              event: GTM_EVENTS.legGTMEvent,
              type: MODAL_TYPES.UPDATE_MODAL,
            })
            setIsSuccessActionExecuting(true)
            toast('Trip updated')
            closeModal()
          } catch {
            // do nothing
          }
        }}
      >
        {({ handleSubmit, isValid, isSubmitting }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Text fontWeight="semi_bold" as="p" mb="s">
              Trip Name
            </Text>
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
              disabled={!isValid || isSubmitting || isSuccessActionExecuting}
              isBlock
              type="submit"
            >
              Save
            </Button.Primary>
          </StyledForm>
        )}
      </Formik>
    </TripModal>
  )
}

UpdateTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  id: PropTypes.number.isRequired,
}

export default UpdateTripModal
