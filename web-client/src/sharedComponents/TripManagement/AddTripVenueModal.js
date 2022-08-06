import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { COLORS } from 'Theme'
import { useAuth } from 'AuthProvider'
import { useTripManagement, MODAL_TYPES } from 'TripManagementProvider'
import { useAddTripVenue } from 'hooks/trip/useAddTripVenue'
import TripItem from 'sharedComponents/TripManagement/TripItem'
import { Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import tentCircleIcon from 'assets/images/svg/tent-circle.svg'
import addTripIcon from 'assets/images/svg/add-trip.svg'
import TripModal from './TripModal'
import { useGoogleTracking, GTM_EVENTS } from '../../hooks/useGoogleTracking'

const AddTripVenueModal = ({ isOpen, closeModal, onSuccess, venueId }) => {
  const [addTripVenue] = useAddTripVenue()
  const { openModal, addedVenueIds } = useTripManagement()
  const { userTrips } = useAuth()
  const { legGTMEvent } = useGoogleTracking()

  const handleClick = React.useCallback(
    async (tripId) => {
      try {
        const response = await addTripVenue({
          variables: { input: { venueId, tripId } },
        })
        if (onSuccess) {
          await onSuccess(response?.data?.addTripVenue.id)
        }
        legGTMEvent({
          event: GTM_EVENTS.venueAddedToTrip,
          data: {
            venueId, tripId
          },
        })
        toast(() => (
          <Box>
            <Text as="p" mb="s">
              Saved to trip
            </Text>
            {response?.data?.addTripVenue.name && (
              <Text fontWeight="semi_bold" color={COLORS.SPACE_CADET}>
                {response?.data?.addTripVenue.name}
              </Text>
            )}
          </Box>
        ))
        closeModal()
      } catch {
        // do nothing
      }
    },
    [legGTMEvent, addTripVenue, closeModal, onSuccess, venueId]
  )
  return (
    <TripModal isOpen={isOpen} closeModal={closeModal} title="Save to a Trip">
      {userTrips.map((trip) => {
        const alreadyAddedVenue =
          addedVenueIds.includes(String(venueId)) ||
          trip.tripVenues.find(
            (tripVenue) => Number(tripVenue.venue.id) === venueId
          )
        return (
          <TripItem
            key={trip.id}
            onClick={() => handleClick(trip.id)}
            primaryText={trip.name}
            secondaryText={
              alreadyAddedVenue
                ? 'Already saved to this trip'
                : `${trip.tripVenues.length} venue${
                    trip.tripVenues.length !== 1 ? 's' : ''
                  }`
            }
            imageSrc={
              trip.tripVenues.find((tripVenue) => tripVenue.venue.thumbnailUrls)
                ?.venue.thumbnailUrls[0] || tentCircleIcon
            }
            isDisabled={!!alreadyAddedVenue}
          />
        )
      })}
      <TripItem
        onClick={() => {
          closeModal()
          openModal({ type: MODAL_TYPES.CREATE_MODAL, onSuccess: handleClick })
        }}
        primaryText="Create New Trip"
        imageSrc={addTripIcon}
      />
    </TripModal>
  )
}

AddTripVenueModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  venueId: PropTypes.number.isRequired,
}

export default AddTripVenueModal
