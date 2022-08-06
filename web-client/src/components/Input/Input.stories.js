import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import Input from './index'

export const TextEnabled = () => <Input defaultValue="Standard input" />

export const TextDisabled = () => (
  <Input placeholder="Standard input" disabled />
)

export const TextSearchEnabled = () => {
  const [inputValue, setInputValue] = React.useState('Tenerife')
  return (
    <Input.Search
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Add Team Location"
    />
  )
}

export const TextSearchDisabled = () => {
  const [inputValue, setInputValue] = React.useState('')
  return (
    <Input.Search
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Add Team Location"
      isDisabled
    />
  )
}

export const NumberWithMaxEnabled = () => {
  const [inputValue, setInputValue] = React.useState(1)
  return <Input.Number value={inputValue} onChange={setInputValue} max={100} />
}

export const NumberWithoutMaxMinEnabled = () => {
  const [inputValue, setInputValue] = React.useState(1)
  return <Input.Number value={inputValue} onChange={setInputValue} />
}

export const NumberWithMinEnabled = () => {
  const [inputValue, setInputValue] = React.useState(1)
  return <Input.Number value={inputValue} onChange={setInputValue} min={-10} />
}

export const NumberWithMaxMinEnabled = () => {
  const [inputValue, setInputValue] = React.useState(-1)
  return (
    <Input.Number
      value={inputValue}
      onChange={setInputValue}
      max={0}
      min={-5}
    />
  )
}

export const NumberDisabled = () => {
  const [inputValue, setInputValue] = React.useState(1)
  return <Input.Number value={inputValue} onChange={setInputValue} isDisabled />
}

export default {
  component: Input,
  title: createStoryName({ base, filename }),
}
