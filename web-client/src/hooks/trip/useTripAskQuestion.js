import { useMutation, gql } from '@apollo/client'
import * as Yup from 'yup'
import { PHONE_REGEX } from 'constants/constants'

const TRIP_ASK_QUESTION = gql`
  mutation TripAskQuestion($input: TripAskQuestionInput!) {
    tripAskQuestion(input: $input)
  }
`

export const FORM_FIELD_NAMES = {
  QUESTION: 'question',
  VENUES: 'venues',
  FULL_NAME: 'fullName',
  COMPANY_NAME: 'companyName',
  EMAIL: 'email',
  PHONE_NUMBER: 'phoneNumber',
}

export const validationSchema = Yup.object({
  [FORM_FIELD_NAMES.QUESTION]: Yup.string().required('This field is required'),
  [FORM_FIELD_NAMES.VENUES]: Yup.array()
    .min(1)
    .required('This field is required'),
  [FORM_FIELD_NAMES.FULL_NAME]: Yup.string().required('This field is required'),
  [FORM_FIELD_NAMES.COMPANY_NAME]: Yup.string().required(
    'This field is required'
  ),
  [FORM_FIELD_NAMES.EMAIL]: Yup.string()
    .email()
    .label('This field is required')
    .required(),
  [FORM_FIELD_NAMES.PHONE_NUMBER]: Yup.string().matches(
    PHONE_REGEX,
    'Phone number is not valid'
  ),
})

export const useTripAskQuestion = () => useMutation(TRIP_ASK_QUESTION)
