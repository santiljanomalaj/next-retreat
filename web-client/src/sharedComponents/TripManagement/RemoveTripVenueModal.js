import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useRemoveTripVenue } from 'hooks/trip/useRemoveTripVenue'
import Button from 'components/atoms/Button'
import TripModal from './TripModal'
import { useGoogleTracking, GTM_EVENTS } from '../../hooks/useGoogleTracking'

const RemoveTripVenueModal = ({ isOpen, closeModal, onSuccess, id }) => {
  const [removeTripVenue, { loading }] = useRemoveTripVenue()
  const { legGTMEvent } = useGoogleTracking()
  const [
    isSuccessActionExecuting,
    setIsSuccessActionExecuting,
  ] = React.useState(false)
  return (
    <TripModal
      isOpen={isOpen}
      closeModal={closeModal}
      title="Remove trip venue"
    >
      <Button.Primary
        isBlock
        disabled={loading || isSuccessActionExecuting}
        onClick={async () => {
          try {
            const response = await removeTripVenue({
              variables: { id },
            })
            legGTMEvent({
              event: GTM_EVENTS.venueRemovedFromTrip,
              data: { id },
            })
            setIsSuccessActionExecuting(true)
            if (onSuccess) {
              await onSuccess(response?.data?.removeTripVenue.id)
            }
            setIsSuccessActionExecuting(false)
            toast('Venue removed from trip')
            closeModal()
          } catch {
            // do nothing
          }
        }}
      >
        Confirm
      </Button.Primary>
    </TripModal>
  )
}

RemoveTripVenueModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  id: PropTypes.number.isRequired,
}

export default RemoveTripVenueModal
