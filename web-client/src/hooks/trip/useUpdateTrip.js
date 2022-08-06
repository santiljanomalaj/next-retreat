import { useMutation, gql } from '@apollo/client'
import * as Yup from 'yup'

const UPDATE_TRIP = gql`
  mutation UpdateTrip($input: UpdateTripInput!) {
    updateTrip(input: $input) {
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

export const useUpdateTrip = () => useMutation(UPDATE_TRIP)
