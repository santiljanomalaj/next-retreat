import { useMutation, gql } from '@apollo/client'

const REMOVE_TRIP_VENUE = gql`
  mutation RemoveTripVenue($id: Int!) {
    removeTripVenue(id: $id) {
      id
    }
  }
`

export const useRemoveTripVenue = () => useMutation(REMOVE_TRIP_VENUE)
