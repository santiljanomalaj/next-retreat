import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useDeleteTrip } from 'hooks/trip/useDeleteTrip'
import Button from 'components/atoms/Button'
import TripModal from './TripModal'
import { MODAL_TYPES } from 'TripManagementProvider'
import { useGoogleTracking, GTM_EVENTS } from '../../hooks/useGoogleTracking'

const DeleteTripModal = ({ isOpen, closeModal, onSuccess, id }) => {
  const [deleteTrip, { loading }] = useDeleteTrip()
  const { legGTMEvent } = useGoogleTracking()
  const [
    isSuccessActionExecuting,
    setIsSuccessActionExecuting,
  ] = React.useState(false)
  return (
    <TripModal isOpen={isOpen} closeModal={closeModal} title="Delete trip">
      <Button.Primary
        isBlock
        disabled={loading || isSuccessActionExecuting}
        onClick={async () => {
          try {
            const response = await deleteTrip({
              variables: { id },
            })
            legGTMEvent({
              event: GTM_EVENTS.legGTMEvent,
              type: MODAL_TYPES.DELETE_MODAL,
            })
            setIsSuccessActionExecuting(true)
            if (onSuccess) {
              await onSuccess(response?.data?.deleteTrip.id)
            }
            setIsSuccessActionExecuting(true)
            toast('Trip deleted')
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

DeleteTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  id: PropTypes.number.isRequired,
}

export default DeleteTripModal
