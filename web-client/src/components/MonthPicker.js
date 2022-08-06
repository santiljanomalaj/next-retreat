import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import {
  format,
  addDays,
  addYears,
  endOfYear,
  endOfMonth,
  startOfYear,
  isSameMonth,
  eachMonthOfInterval,
  differenceInCalendarYears,
} from 'date-fns'
import {
  fontSizes,
  fontWeights,
  mq,
  radius,
  space,
  BORDER_WIDTH,
  BOXSHADOWS,
  COLORS,
} from 'Theme'
import { Box } from 'components/atoms/Layout'

const monthPickerMQ = mq.from.tablet
const now = new Date()
const getYears = (date, amount) =>
  [...Array(amount)].map((_, i) => addYears(date, i))
const getMonths = (year) =>
  eachMonthOfInterval({ start: startOfYear(year), end: endOfYear(year) })
const isBetween = (minDate, maxDate, date) => date > minDate && date < maxDate
const noop = () => {}

const Wrapper = styled('div')`
  ${monthPickerMQ`
    max-height: ${rem('300px')};
    width: min-content;
  `}
`

const Year = styled('div')`
  margin-bottom: ${space.s};

  font-size: ${fontSizes.l};
  font-weight: ${fontWeights.bold};

  ${monthPickerMQ`
    text-align: center;
  `}
`

const Months = styled('div')`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: flex-start;
  grid-gap: ${space.xs};

  ${monthPickerMQ`
    grid-template-columns: repeat(3, auto);
  `}
`

const Month = styled('button')`
  height: ${rem('44px')};

  font-size: ${fontSizes.s};

  background-color: ${COLORS.LYNX_WHITE};
  border-radius: ${radius.xs};
  border: ${BORDER_WIDTH} solid transparent;

  ${monthPickerMQ`
    width: ${rem('72px')};
  `}

  ${({ isActive }) =>
    isActive &&
    `
      background-color: ${COLORS.IRRADIANT_IRIS};
      border-color: ${COLORS.BROTHER_BLUE};
      box-shadow: ${BOXSHADOWS.INNER};
    `}
`

Month.defaultProps = {
  type: 'button',
}

const MonthPicker = ({
  endDate,
  onChange,
  startDate,
  onEndDateChange,
  availableDateTo,
  availableDateFrom,
  onStartDateChange,
}) => {
  const numberOfYears = React.useMemo(
    () => differenceInCalendarYears(availableDateTo, availableDateFrom) + 1,
    [availableDateFrom, availableDateTo]
  )
  const years = React.useMemo(
    () => getYears(availableDateFrom, numberOfYears),
    [availableDateFrom, numberOfYears]
  )
  const months = React.useMemo(() => years.map((year) => getMonths(year)), [
    years,
  ])

  const handleMonthClick = (month) => {
    if (month < availableDateFrom && !isSameMonth(month, availableDateFrom)) {
      return
    }
    if (!isSameMonth(startDate, endDate) || month < startDate) {
      onStartDateChange(month)
    }
    if (!isSameMonth(month, endDate)) {
      onEndDateChange(endOfMonth(month))
    }

    onChange(month)
  }

  return (
    <Wrapper>
      {years.map((year, yearIndex) => (
        <Box mb="m" key={yearIndex}>
          <Year>{format(year, 'y')}</Year>
          <Months>
            {months[yearIndex].map((month, monthIndex) => (
              <Month
                onClick={() => handleMonthClick(month)}
                disabled={
                  !(
                    isBetween(availableDateFrom, availableDateTo, month) ||
                    isSameMonth(availableDateFrom, month) ||
                    isSameMonth(availableDateTo, month)
                  )
                }
                isActive={
                  isBetween(startDate, endDate, month) ||
                  isSameMonth(startDate, month) ||
                  isSameMonth(endDate, month)
                }
                key={monthIndex}
              >
                {format(month, 'MMM')}
              </Month>
            ))}
          </Months>
        </Box>
      ))}
    </Wrapper>
  )
}

MonthPicker.defaultProps = {
  onChange: noop,
  onEndDateChange: noop,
  availableDateFrom: now,
  availableDateTo: addDays(addYears(now, 3), -1),
}

MonthPicker.propTypes = {
  onChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
  onStartDateChange: PropTypes.func.isRequired,
  endDate: PropTypes.instanceOf(Date),
  startDate: PropTypes.instanceOf(Date),
  availableDateTo: PropTypes.instanceOf(Date),
  availableDateFrom: PropTypes.instanceOf(Date),
}

export default MonthPicker
