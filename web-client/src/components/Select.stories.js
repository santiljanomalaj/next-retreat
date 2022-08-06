import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Text } from 'components/atoms/Typography'
import { Box } from 'components/atoms/Layout'
import Select from './Select'

const options = [
  { value: 'geralt', label: 'Geralt' },
  { value: 'yennefer', label: 'Yennefer' },
  { value: 'triss', label: 'Triss' },
]

export const Active = () => {
  const [inputValue, setInputValue] = React.useState(null)
  return (
    <Box mx="m" my="m">
      <Text>Input value: {inputValue?.value}</Text>
      <Select
        options={options}
        handleInputChange={setInputValue}
        value={inputValue}
      />
    </Box>
  )
}
export const Disabled = () => {
  const [inputValue, setInputValue] = React.useState(null)
  return (
    <Box mx="m" my="m">
      <Text>Input value: {inputValue?.value}</Text>
      <Select
        isDisabled
        options={options}
        handleInputChange={setInputValue}
        value={inputValue}
      />
    </Box>
  )
}

export default {
  component: Select,
  title: createStoryName({ base, filename }),
}
