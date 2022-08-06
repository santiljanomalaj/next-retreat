import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Formik, Field } from 'formik'
import { toast } from 'react-toastify'
import { Text } from 'components/atoms/Typography'
import Input from 'components/Input'
import Button from 'components/atoms/Button'
import {
  useCreateTrip,
  FORM_FIELD_NAMES,
  validationSchema,
} from 'hooks/trip/useCreateTrip'
import TripModal from './TripModal'
import {
  useGoogleTracking,
  GTM_EVENTS,
} from '../../hooks/useGoogleTracking'

const StyledForm = styled.form`
  width: 100%;
`

const CreateTripModal = ({ isOpen, closeModal, onSuccess }) => {
  const { logGTMEvent } = useGoogleTracking()
  const [createTrip] = useCreateTrip()
  const [
    isSuccessActionExecuting,
    setIsSuccessActionExecuting,
  ] = React.useState(false)
  return (
    <TripModal isOpen={isOpen} closeModal={closeModal} title="Create New Trip">
      <Formik
        initialValues={{
          [FORM_FIELD_NAMES.NAME]: '',
        }}
        validationSchema={validationSchema}
        validateOnMount
        onSubmit={async (values) => {
          try {
            const response = await createTrip({ variables: { input: values } })

            logGTMEvent({ event: GTM_EVENTS.createTrip, values })

            setIsSuccessActionExecuting(true)
            if (onSuccess) {
              await onSuccess(response?.data?.createTrip.id)
            }
            setIsSuccessActionExecuting(true)
            toast('Trip created')
            closeModal()
          } catch {
            // do nothing
          }
        }}
      >
        {({ handleSubmit, isValid, isSubmitting }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Text fontWeight="bold">Trip Name</Text>
            <Field name={FORM_FIELD_NAMES.NAME}>
              {({ field, meta }) => (
                <Input
                  placeholder="Enter team trip name"
                  isInvalid={meta.touched && meta.error !== undefined}
                  required
                  mb="m"
                  mt="s"
                  {...field}
                />
              )}
            </Field>
            <Text as="p" my="m">
              Our past customers chose names like “Hotjar summer retreat”, or
              “Convers.io team trip”.
            </Text>
            <Button.Primary
              disabled={!isValid || isSubmitting || isSuccessActionExecuting}
              isBlock
              type="submit"
            >
              Create Trip
            </Button.Primary>
          </StyledForm>
        )}
      </Formik>
    </TripModal>
  )
}

CreateTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
}

export default CreateTripModal
