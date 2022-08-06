import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Modal from 'components/Modal'
import AvailabilityCalendar from 'sharedComponents/AvailabilityCalendar'

const StyledModal = styled(Modal)`
  padding-bottom: 0;
`

const AvailabilityCalendarModal = ({
  minDate,
  maxDate,
  startDate,
  endDate,
  isOpen,
  closeModal,
  onApply,
  selectButtonText
}) => (
  <StyledModal
    isOpen={isOpen}
    closeModal={closeModal}
    hasCloseButton={false}
    ariaLabel="Availability calendar modal"
  >
    <AvailabilityCalendar
      minDate={minDate}
      maxDate={maxDate}
      startDate={startDate}
      endDate={endDate}
      closeModal={closeModal}
      onApply={onApply}
      selectButtonText={selectButtonText}
    />
  </StyledModal>
)

AvailabilityCalendarModal.propTypes = {
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  selectButtonText: PropTypes.string,
}

export default AvailabilityCalendarModal
