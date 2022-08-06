import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Cookies from 'universal-cookie'
import { Formik, Field } from 'formik'
import { useMutation, gql } from '@apollo/client'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { Text } from 'components/atoms/Typography'
import Input from 'components/Input'
import Button from 'components/atoms/Button'
import TripModal from '../TripManagement/TripModal'

const cookies = new Cookies()

const StyledForm = styled.form`
  width: 100%;
`

const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      id
    }
  }
`

const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'gclid',
]
const getTrackingParams = () => {
  const track_params = {}
  let queryString = window.location.search
  const params = queryString.replace('?', '').split('&')
  for (let i = 0; i < params.length; i++) {
    const param = params[i]
    if (param === '') continue
    const paramParsed = param.split('=')
    if (TRACKING_PARAMS.includes(paramParsed[0])) {
      track_params[paramParsed[0]] = paramParsed[1]
    }
  }
  const gid = cookies.get('_gid')
  if(gid) track_params.gid = gid; 

  if (Object.keys(track_params).length === 0) return null
  return track_params
}

export const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email')
    .label('This field is required')
    .required(),
})

const UserModal = ({ isOpen, closeModal, onSuccess, isSigningIn, hasCloseButton = false}) => {
  const trackingData = getTrackingParams()
  const [signUp] = useMutation(SIGN_UP)
  return (
    <TripModal
      isOpen={isOpen}
      closeModal={closeModal}
      title={isSigningIn ? "Signing in..." : "Access My Account"}
      hasCloseButton={hasCloseButton}
    >
      {!isSigningIn && <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={validationSchema}
        validateOnMount
        onSubmit={async (values) => {
          try {
            const response = await signUp({
              variables: {
                input: {
                  ...values,
                  trackingData,
                },
              },
            })
            if (onSuccess) {
              await onSuccess(response?.data?.signUp.id)
            }
            toast('Login link sent')
            closeModal()
          } catch {
            // do nothing
          }
        }}
      >
        {({ handleSubmit, isValid, isSubmitting }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Text fontWeight="bold">Your email</Text>
            <Field name="email">
              {({ field, meta }) => (
                <Input
                  placeholder="Enter your email"
                  isInvalid={meta.touched && meta.error !== undefined}
                  required
                  mb="m"
                  mt="s"
                  {...field}
                />
              )}
            </Field>
            <Button.Primary
              disabled={!isValid || isSubmitting}
              isBlock
              type="submit"
            >
              Send login link
            </Button.Primary>
          </StyledForm>
        )}
      </Formik>}
    </TripModal>
  )
}

UserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  hasCloseButton: PropTypes.bool,
}

export default UserModal
