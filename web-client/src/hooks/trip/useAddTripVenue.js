import { useMutation, gql } from '@apollo/client'

const ADD_TRIP_VENUE = gql`
  mutation AddTripVenue($input: AddTripVenueInput!) {
    addTripVenue(input: $input) {
      id
      name
    }
  }
`

export const useAddTripVenue = () => useMutation(ADD_TRIP_VENUE)
