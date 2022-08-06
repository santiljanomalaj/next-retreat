import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { space } from 'Theme'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;

  > :not(:last-child) {
    margin-bottom: ${space.m};
  }
`

const CheckboxGroup = ({ children, onChange, enabledItems = [] }) => {
  const handleChange = (value) => {
    onChange(
      enabledItems.includes(value)
        ? enabledItems.filter((item) => item !== value)
        : enabledItems.concat(value)
    )
  }

  return (
    <Wrapper>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          onChange: (value) => handleChange(value),
          isChecked: enabledItems.includes(child.props.value),
        })
      )}
    </Wrapper>
  )
}

CheckboxGroup.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  enabledItems: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool])
  ),
}

export default CheckboxGroup
