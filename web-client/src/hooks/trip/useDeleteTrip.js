import { useMutation, gql } from '@apollo/client'

const DELETE_TRIP = gql`
  mutation DeleteTrip($id: Int!) {
    deleteTrip(id: $id)
  }
`

export const useDeleteTrip = () => useMutation(DELETE_TRIP)
