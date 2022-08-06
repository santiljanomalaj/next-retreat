import React from 'react'
import { useAuth } from 'AuthProvider'
import { useTripManagement, MODAL_TYPES } from 'TripManagementProvider'
import CreateTripModal from './CreateTripModal'
import UpdateTripModal from './UpdateTripModal'
import DeleteTripModal from './DeleteTripModal'
import EmptyTripModal from './EmptyTripModal'
import AddTripVenueModal from './AddTripVenueModal'
import RemoveTripVenueModal from './RemoveTripVenueModal'
import TripAskQuestionModal from './TripAskQuestionModal'
import TripCheckAvailabilityModal from './TripCheckAvailabilityModal'
import TripSuccessFormRequestModal from './TripSuccessFormRequestModal'

const TripManagementModals = () => {
  const { refetchData } = useAuth()
  const { closeModal, openedModals } = useTripManagement()

  const onSuccess = React.useCallback(
    (originalOnSuccess) => async (data) => {
      if (originalOnSuccess) {
        await originalOnSuccess(data)
      }
      refetchData()
    },
    [refetchData]
  )

  return (
    <>
      {openedModals[MODAL_TYPES.CREATE_MODAL] && (
        <CreateTripModal
          isOpen
          closeModal={() => closeModal(MODAL_TYPES.CREATE_MODAL)}
          onSuccess={onSuccess(
            openedModals[MODAL_TYPES.CREATE_MODAL].onSuccess
          )}
        />
      )}
      {openedModals[MODAL_TYPES.UPDATE_MODAL] &&
        openedModals[MODAL_TYPES.UPDATE_MODAL].id && (
          <UpdateTripModal
            isOpen
            closeModal={() => closeModal(MODAL_TYPES.UPDATE_MODAL)}
            onSuccess={onSuccess(
              openedModals[MODAL_TYPES.UPDATE_MODAL].onSuccess
            )}
            id={openedModals[MODAL_TYPES.UPDATE_MODAL].id}
          />
        )}
      {openedModals[MODAL_TYPES.DELETE_MODAL] &&
        openedModals[MODAL_TYPES.DELETE_MODAL].id && (
          <DeleteTripModal
            isOpen
            closeModal={() => closeModal(MODAL_TYPES.DELETE_MODAL)}
            onSuccess={onSuccess(
              openedModals[MODAL_TYPES.DELETE_MODAL].onSuccess
            )}
            id={openedModals[MODAL_TYPES.DELETE_MODAL].id}
          />
        )}
      {openedModals[MODAL_TYPES.EMPTY_MODAL] &&
        (
          <EmptyTripModal
            isOpen
            closeModal={() => closeModal(MODAL_TYPES.EMPTY_MODAL)}
          />
      )}
      {openedModals[MODAL_TYPES.ADD_VENUE_MODAL] &&
        openedModals[MODAL_TYPES.ADD_VENUE_MODAL].venueId && (
          <AddTripVenueModal
            isOpen
            closeModal={() => closeModal(MODAL_TYPES.ADD_VENUE_MODAL)}
            onSuccess={onSuccess(
              openedModals[MODAL_TYPES.ADD_VENUE_MODAL].onSuccess
            )}
            venueId={openedModals[MODAL_TYPES.ADD_VENUE_MODAL].venueId}
          />
        )}
      {openedModals[MODAL_TYPES.REMOVE_VENUE_MODAL] &&
        openedModals[MODAL_TYPES.REMOVE_VENUE_MODAL].id && (
          <RemoveTripVenueModal
            isOpen
            closeModal={() => closeModal(MODAL_TYPES.REMOVE_VENUE_MODAL)}
            onSuccess={onSuccess(
              openedModals[MODAL_TYPES.REMOVE_VENUE_MODAL].onSuccess
            )}
            id={openedModals[MODAL_TYPES.REMOVE_VENUE_MODAL].id}
          />
        )}
      {openedModals[MODAL_TYPES.ASK_QUESTION_MODAL] &&
        (openedModals[MODAL_TYPES.ASK_QUESTION_MODAL].tripId ||
          openedModals[MODAL_TYPES.ASK_QUESTION_MODAL].venueId) && (
          <TripAskQuestionModal
            isOpen
            closeModal={() => closeModal(MODAL_TYPES.ASK_QUESTION_MODAL)}
            onSuccess={onSuccess(
              openedModals[MODAL_TYPES.ASK_QUESTION_MODAL].onSuccess
            )}
            tripId={openedModals[MODAL_TYPES.ASK_QUESTION_MODAL].tripId}
            venueId={openedModals[MODAL_TYPES.ASK_QUESTION_MODAL].venueId}
          />
        )}
      {openedModals[MODAL_TYPES.CHECK_AVAILABILITY_MODAL] &&
        openedModals[MODAL_TYPES.CHECK_AVAILABILITY_MODAL].tripId && (
          <TripCheckAvailabilityModal
            isOpen
            closeModal={() => closeModal(MODAL_TYPES.CHECK_AVAILABILITY_MODAL)}
            onSuccess={onSuccess(
              openedModals[MODAL_TYPES.CHECK_AVAILABILITY_MODAL].onSuccess
            )}
            tripId={openedModals[MODAL_TYPES.CHECK_AVAILABILITY_MODAL].tripId}
          />
        )}
      {openedModals[MODAL_TYPES.SUCCESS_FORM_REQUEST_MODAL] &&
        openedModals[MODAL_TYPES.SUCCESS_FORM_REQUEST_MODAL].title && (
          <TripSuccessFormRequestModal
            isOpen
            closeModal={() =>
              closeModal(MODAL_TYPES.SUCCESS_FORM_REQUEST_MODAL)
            }
            title={openedModals[MODAL_TYPES.SUCCESS_FORM_REQUEST_MODAL].title}
          />
        )}
    </>
  )
}

export default TripManagementModals
