import { useMutation, gql } from '@apollo/client'
import * as Yup from 'yup'
import { PHONE_REGEX } from 'constants/constants'

const TRIP_CHECK_AVAILABILITY = gql`
  mutation TripCheckAvailability($input: TripCheckAvailabilityInput!) {
    tripCheckAvailability(input: $input)
  }
`

export const MAX_SELECTED_VENUES = 3

export const FORM_FIELD_NAMES = {
  EXACT_DATE: 'exactDate',
  NIGHTS_COUNT: 'nightsCount',
  EXACT_PEOPLE_COUNT: 'exactPeopleCount',
  EXACT_DATE_RANGE: 'exactDateRange',
  APPROX_PEOPLE_COUNT: 'approxPeopleCount',
  APPROX_DATE_RANGE: 'approxDateRange',
  VENUES: 'venues',
  FULL_NAME: 'fullName',
  COMPANY_NAME: 'companyName',
  COMPANY_COUNTRY: 'companyCountry',
  EMAIL: 'email',
  PHONE_NUMBER: 'phoneNumber',
}

const countValidation = (isExact) =>
  Yup.string().when([FORM_FIELD_NAMES.EXACT_DATE], {
    is: isExact,
    then: Yup.string().required('This field is required'),
  })

const dateRangeValidation = (isExact) =>
  Yup.object().when([FORM_FIELD_NAMES.EXACT_DATE], {
    is: isExact,
    then: Yup.object().shape({
      from: Yup.string().required('This field is required'),
      to: Yup.string().required('This field is required'),
    }),
  })

export const validationSchema = Yup.object({
  [FORM_FIELD_NAMES.EXACT_DATE]: Yup.boolean(),
  [FORM_FIELD_NAMES.NIGHTS_COUNT]: countValidation(false),
  [FORM_FIELD_NAMES.APPROX_PEOPLE_COUNT]: countValidation(false),
  [FORM_FIELD_NAMES.EXACT_PEOPLE_COUNT]: countValidation(true),
  [FORM_FIELD_NAMES.APPROX_DATE_RANGE]: dateRangeValidation(false),
  [FORM_FIELD_NAMES.EXACT_DATE_RANGE]: dateRangeValidation(true),
  [FORM_FIELD_NAMES.VENUES]: Yup.array()
    .min(1)
    .max(MAX_SELECTED_VENUES)
    .required('This field is required'),
  [FORM_FIELD_NAMES.FULL_NAME]: Yup.string().required('This field is required'),
  [FORM_FIELD_NAMES.COMPANY_NAME]: Yup.string().required(
    'This field is required'
  ),
  [FORM_FIELD_NAMES.COMPANY_COUNTRY]: Yup.string().required(
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
export const useTripCheckAvailability = () =>
  useMutation(TRIP_CHECK_AVAILABILITY)
