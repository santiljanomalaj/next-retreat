import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Text = styled('span')`
  color: blue;
  text-decoration: underline;
  font-size: 0.875rem;
  line-height: 1.5;
  cursor: pointer;
`

const LinkText = ({text, click}) => (
  <Text onClick={click}>
    {text}
  </Text>
)

LinkText.propTypes = {
  text: PropTypes.string,
  click: PropTypes.func
}

export default LinkText