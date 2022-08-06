import React from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import MonthPickerComp from 'components/MonthPicker'
import Filter from 'sharedComponents/Filter'

const MonthPicker = ({
  onChange,
  startDate,
  targetComp,
  availableDateTo,
  availableDateFrom,
  onStartDateChange,
}) => (
  <Filter
    label={format(startDate, 'MMM Y')}
    targetComp={targetComp}
    hasFooter={false}
  >
    {availableDateFrom && availableDateTo && (
      <MonthPickerComp
        onChange={onChange}
        startDate={startDate}
        availableDateTo={availableDateTo}
        availableDateFrom={availableDateFrom}
        onStartDateChange={onStartDateChange}
      />
    )}
  </Filter>
)

MonthPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  targetComp: PropTypes.object.isRequired,
  availableDateTo: PropTypes.instanceOf(Date),
  onStartDateChange: PropTypes.func.isRequired,
  availableDateFrom: PropTypes.instanceOf(Date),
  startDate: PropTypes.instanceOf(Date).isRequired,
}

export default MonthPicker
