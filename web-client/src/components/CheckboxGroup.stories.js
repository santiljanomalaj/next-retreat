import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Box } from 'components/atoms/Layout'
import Tooltip from 'components/molecules/Tooltip'
import infoIcon from 'assets/images/svg/info.svg'
import CheckboxGroup from './CheckboxGroup'
import Checkbox from './Checkbox'

export const DefaultView = () => {
  const [enabledItems, setEnabledItems] = React.useState([
    'initial',
    'disabled_checked',
  ])
  return (
    <Box p="m">
      <Box pb="m">Selected boxes: [{enabledItems.join(', ')}]</Box>
      <CheckboxGroup enabledItems={enabledItems} onChange={setEnabledItems}>
        <Checkbox value="default">Default</Checkbox>
        <Checkbox value="initial">Initially checked</Checkbox>
        <Checkbox value="long_label">This one has a very long label</Checkbox>
        <Checkbox value="disabled" isDisabled>
          Disabled
        </Checkbox>
        <Checkbox value="disabled_checked" isDisabled>
          Disabled checked
        </Checkbox>
        <Checkbox value="tooltip">
          Checkbox with tooltip
          <Tooltip contentComp={<span>This is a tooltip</span>}>
            <img
              src={infoIcon}
              style={{ width: '16px', margin: '0 0.5em' }}
              alt=""
            />
          </Tooltip>
        </Checkbox>
      </CheckboxGroup>
    </Box>
  )
}

export default {
  component: CheckboxGroup,
  title: createStoryName({ base, filename }),
}
