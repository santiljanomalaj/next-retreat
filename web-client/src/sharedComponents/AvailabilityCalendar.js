import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ellipsis, math, rem } from 'polished'
import { addYears, differenceInCalendarDays, format, isSameDay } from 'date-fns'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  fontSizes,
  fontWeights,
  radius,
  space,
  BORDER_WIDTH,
  BOXSHADOWS,
  COLORS,
} from 'Theme'
import Button from 'components/atoms/Button'
import { Text } from 'components/atoms/Typography'
import arrowIcon from 'assets/images/svg/arrow.svg'

const TODAY = new Date()
const DAY_SIZE = rem('39px')
const ARROW_SIZE = rem('14px')
const ARROW_BUTTON_SIZE = rem('32px')

const formatDate = (date) => format(date, 'MMM d, Y')

const CalendarStyle = styled('div')`
  display: contents;

  .react-datepicker {
    display: flex;
    flex-wrap: wrap;

    margin: 0 ${ARROW_BUTTON_SIZE};

    font-family: inherit;

    border: none;
  }

  .react-datepicker__navigation {
    width: ${ARROW_BUTTON_SIZE};
    height: ${ARROW_BUTTON_SIZE};

    background: url("${arrowIcon}") center / ${ARROW_SIZE} ${ARROW_SIZE} no-repeat;
    background-color: ${COLORS.WHITE};
    box-shadow: ${BOXSHADOWS.DARK};
    border: ${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS};
    border-radius: ${radius.circle};
  }

  .react-datepicker__navigation--previous {
    left: -${ARROW_BUTTON_SIZE};

    transform: rotateY(180deg);
  }

  .react-datepicker__navigation--next {
    right: -${ARROW_BUTTON_SIZE};
  }

  .react-datepicker__navigation--previous--disabled,
  .react-datepicker__navigation--next--disabled {
    box-shadow: none;

    opacity: 0.5;
  }

  .react-datepicker__header {
    background-color: transparent;
    border: none;
  }

  .react-datepicker__month-container {
    float: none;
    margin: 0 auto;
  }

  .react-datepicker__month {
    min-height: ${math(`${DAY_SIZE} * 6`)}
  }

  .react-datepicker__day,
  .react-datepicker__day-name {
    user-select: none;

    width: ${DAY_SIZE};
    line-height: ${DAY_SIZE};
    margin: 0;
  }

  .react-datepicker__day {
    font-size: ${fontSizes.m};

    color: ${COLORS.SPACE_CADET};

    &,
    &:hover {
      border-radius: 0;
    }
  }

  .react-datepicker__day--today {
    font-weight: inherit;
  }

  .react-datepicker__day--disabled {
    text-decoration: line-through;

    opacity: 0.25;

    &:hover {
      background-color: transparent !important;
    }
  }

  .react-datepicker__day--in-range,
  .react-datepicker__day--in-selecting-range {
    background-color: ${COLORS.LYNX_WHITE};
  }

  .react-datepicker__day:hover,
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected,
  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end,
  .react-datepicker__day--selecting-range-start,
  .react-datepicker__day--selecting-range-end {
    background-color: ${COLORS.IRRADIANT_IRIS};
  }

  .react-datepicker__day--outside-month {
    visibility: hidden;
    pointer-events: none;
  }

  .react-datepicker__day-name {
    font-size: ${fontSizes.xs};
    font-weight: ${fontWeights.semi_bold};
    letter-spacing: 0.03em;
    text-transform: uppercase;

    color: ${COLORS.BLUEBERRY_SODA};
  }

  .react-datepicker__current-month {
    padding-top: ${space.xs};

    font-size: ${fontSizes.l};
    font-weight: ${fontWeights.semi_bold};

    color: ${COLORS.SPACE_CADET};
  }
`

const SelectedDates = styled(Text)`
  ${ellipsis()}
`

const Footer = styled('div')`
  display: flex;
  align-items: center;

  height: ${rem('77px')};

  white-space: nowrap;

  border-top: ${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS};

  > * + * {
    margin-left: ${space.m};
  }
`

const AvailabilityCalendar = ({
  minDate,
  maxDate,
  startDate: initialStartDate,
  endDate: initialEndDate,
  closeModal,
  onApply,
  selectButtonText = 'Check availability',
}) => {
  const [startDate, setStartDate] = React.useState(initialStartDate)
  const [endDate, setEndDate] = React.useState(initialEndDate)

  const handleChange = (dates) => {
    const [start, end] = dates
    if (start !== null && isSameDay(start, end)) {
      return
    }
    setStartDate(start)
    setEndDate(end)
  }

  return (
    <div>
      <Text display="block" fontSize="xxl" fontWeight="semi_bold" mb="l">
        Availability Calendar
      </Text>
      <CalendarStyle>
        <DatePicker
          onChange={handleChange}
          startDate={startDate}
          endDate={endDate}
          minDate={minDate}
          maxDate={maxDate}
          inline
          selectsRange
          monthsShown={2}
          shouldCloseOnSelect={false}
          showDisabledMonthNavigation
          disabledKeyboardNavigation // https://github.com/Hacker0x01/react-datepicker/issues/2117
          // selected={startDate} https://github.com/Hacker0x01/react-datepicker/issues/2117
        />
        <Footer>
          <SelectedDates mr="auto">
            {startDate &&
              endDate &&
              `${formatDate(startDate)} - ${formatDate(
                endDate
              )} (${differenceInCalendarDays(endDate, startDate)} nights)`}
          </SelectedDates>
          <Button.Tertiary
            fontSize="s"
            onClick={() => {
              handleChange([null, null])
            }}
          >
            Clear
          </Button.Tertiary>
          <Button.Primary
            disabled={Boolean(startDate) !== Boolean(endDate)}
            onClick={() => {
              onApply({ startDate, endDate })
              closeModal()
            }}
          >
            {selectButtonText}
          </Button.Primary>
        </Footer>
      </CalendarStyle>
    </div>
  )
}

AvailabilityCalendar.defaultProps = {
  minDate: TODAY,
  maxDate: addYears(TODAY, 1),
  closeModal: () => {},
  selectButtonText: 'Check availability',
}

AvailabilityCalendar.propTypes = {
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  closeModal: PropTypes.func,
  onApply: PropTypes.func.isRequired,
  selectButtonText: PropTypes.string,
}

export default AvailabilityCalendar
