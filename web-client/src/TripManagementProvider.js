import React from 'react'
import PropTypes from 'prop-types'
import { useGoogleTracking, GTM_EVENTS } from './hooks/useGoogleTracking'

export const MODAL_TYPES = {
  CREATE_MODAL: 'CREATE_MODAL',
  UPDATE_MODAL: 'UPDATE_MODAL',
  DELETE_MODAL: 'DELETE_MODAL',
  EMPTY_MODAL: 'EMPTY_MODAL',
  ADD_VENUE_MODAL: 'ADD_VENUE_MODAL',
  REMOVE_VENUE_MODAL: 'REMOVE_VENUE_MODAL',
  ASK_QUESTION_MODAL: 'ASK_QUESTION_MODAL',
  CHECK_AVAILABILITY_MODAL: 'CHECK_AVAILABILITY_MODAL',
  SUCCESS_FORM_REQUEST_MODAL: 'SUCCESS_FORM_REQUEST_MODAL',
}

export const TripManagementContext = React.createContext({
  openModal: () => {},
  closeModal: () => {},
  openedModals: () => {},
  addedVenueIds: [],
  setAddedVenueIds: () => {},
})

export const useTripManagement = () => React.useContext(TripManagementContext)

const TripManagementProvider = ({ children }) => {
  const [openedModals, setOpenedModals] = React.useState({})
  const [addedVenueIds, setAddedVenueIds] = React.useState([])
  const { logGTMEvent } = useGoogleTracking()

  const openModal = React.useCallback(
    ({ type, ...rest }) => {
      logGTMEvent({ event: GTM_EVENTS.modalOpened, type })
      setOpenedModals((previousOpenedModals) => ({
        ...previousOpenedModals,
        [type]: rest,
      }))
    },
    [logGTMEvent]
  )

  const closeModal = React.useCallback((type) => {
    setOpenedModals((previousOpenedModals) =>
      Object.entries(previousOpenedModals)
        .filter(([previousType]) => previousType !== type)
        .reduce(
          (acc, [previousType, props]) => ({ ...acc, [previousType]: props }),
          {}
        )
    )
  }, [])

  const contextValue = React.useMemo(
    () => ({
      openedModals,
      openModal,
      closeModal,
      addedVenueIds,
      setAddedVenueIds,
    }),
    [openedModals, openModal, closeModal, addedVenueIds]
  )

  return (
    <TripManagementContext.Provider value={contextValue}>
      {children}
    </TripManagementContext.Provider>
  )
}

TripManagementProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default TripManagementProvider
