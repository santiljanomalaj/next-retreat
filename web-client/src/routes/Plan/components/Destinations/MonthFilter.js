import React from 'react'
import PropTypes from 'prop-types'
import { format, formatISO, isThisYear } from 'date-fns'
import MonthPicker from 'components/MonthPicker'
import Filter from 'sharedComponents/Filter'

const formatLabel = (date, withYear) => format(date, withYear ? 'MMM Y' : 'MMM')
const formatISODate = (date) => formatISO(date, { representation: 'date' })

const MonthFilter = ({
  startMonth: initialStartMonth,
  endMonth: initialEndMonth,
  availableDateFrom,
  availableDateTo,
  setUrlFilters,
}) => {
  const [startDate, setStartDate] = React.useState(initialStartMonth)
  const [endDate, setEndDate] = React.useState(initialEndMonth)

  const isStateDefault = initialStartMonth == null && initialEndMonth == null
  const areDatesThisYear =
    isThisYear(initialStartMonth) && isThisYear(initialEndMonth)

  return (
    <Filter
      label={
        isStateDefault
          ? 'Anytime'
          : `${formatLabel(
              initialStartMonth,
              !areDatesThisYear
            )} - ${formatLabel(initialEndMonth, !areDatesThisYear)}`
      }
      modalLabel="Select months"
      isChanged={!isStateDefault}
      onCancel={() => {
        setStartDate(initialStartMonth)
        setEndDate(initialEndMonth)
      }}
      onClear={() => {
        setStartDate(null)
        setEndDate(null)
      }}
      clearLabel="Reset to anytime"
      onApply={() => {
        setUrlFilters({
          startMonth: startDate && formatISODate(startDate),
          endMonth: endDate && formatISODate(endDate),
          page: 1,
        })
      }}
      isApplyDisabled={Boolean(startDate) !== Boolean(endDate)}
    >
      {availableDateFrom && availableDateTo && (
        <MonthPicker
          endDate={endDate || availableDateTo}
          availableDateFrom={availableDateFrom}
          availableDateTo={availableDateTo}
          startDate={startDate || availableDateFrom}
          onEndDateChange={setEndDate}
          onStartDateChange={setStartDate}
        />
      )}
    </Filter>
  )
}

MonthFilter.propTypes = {
  startMonth: PropTypes.instanceOf(Date),
  endMonth: PropTypes.instanceOf(Date),
  setUrlFilters: PropTypes.func.isRequired,
  availableDateTo: PropTypes.instanceOf(Date),
  availableDateFrom: PropTypes.instanceOf(Date),
}

export default MonthFilter
