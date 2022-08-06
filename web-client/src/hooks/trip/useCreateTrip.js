import { useMutation, gql } from '@apollo/client'
import * as Yup from 'yup'

const CREATE_TRIP = gql`
  mutation CreateTrip($input: CreateTripInput!) {
    createTrip(input: $input) {
      id
    }
  }
`

export const FORM_FIELD_NAMES = {
  NAME: 'name',
}

export const validationSchema = Yup.object({
  [FORM_FIELD_NAMES.NAME]: Yup.string().required('This field is required'),
})

export const useCreateTrip = () => useMutation(CREATE_TRIP)
