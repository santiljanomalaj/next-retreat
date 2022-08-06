import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'components/Modal'
import FlightGrid from 'sharedComponents/FlightGrid'

const FlightGridModal = ({
  isOpen,
  toDate,
  fromDate,
  closeModal,
  destination,
  setUrlFilters,
  originLocations,
}) => (
  <Modal isOpen={isOpen} closeModal={closeModal} ariaLabel="Flight grid modal">
    <FlightGrid
      toDate={toDate}
      hasFooterControls
      fromDate={fromDate}
      closeModal={closeModal}
      destination={destination}
      setUrlFilters={setUrlFilters}
      originLocations={originLocations}
    />
  </Modal>
)

FlightGridModal.propTypes = {
  toDate: PropTypes.string,
  fromDate: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  destination: PropTypes.string.isRequired,
  setUrlFilters: PropTypes.func.isRequired,
  originLocations: PropTypes.array.isRequired,
}

export default FlightGridModal
