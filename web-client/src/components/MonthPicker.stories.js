import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Box } from 'components/atoms/Layout'
import MonthPicker from './MonthPicker'

export const RangeMonthPicker = () => {
  const [startDate, setStartDate] = React.useState(null)
  const [endDate, setEndDate] = React.useState(null)

  return (
    <Box p="m">
      <MonthPicker
        endDate={endDate}
        startDate={startDate}
        onEndDateChange={setEndDate}
        onStartDateChange={setStartDate}
        availableDateFrom={new Date()}
        availableDateTo={new Date(2021, 5, 1)}
      />
    </Box>
  )
}

export const SingleMonthPicker = () => {
  const [startDate, setStartDate] = React.useState(null)

  return (
    <Box p="m">
      <MonthPicker startDate={startDate} onStartDateChange={setStartDate} />
    </Box>
  )
}

export const LimitedSingleMonthPicker = () => {
  const [startDate, setStartDate] = React.useState(null)

  return (
    <Box p="m">
      <MonthPicker
        startDate={startDate}
        onStartDateChange={setStartDate}
        availableDateFrom={new Date(2021, 4, 31)}
        availableDateTo={new Date(2021, 7, 1)}
      />
    </Box>
  )
}

export default {
  component: MonthPicker,
  title: createStoryName({ base, filename }),
}
