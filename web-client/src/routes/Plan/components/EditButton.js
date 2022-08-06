import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import Button from 'components/atoms/Button'
import penIcon from 'assets/images/svg/pen.svg'

const ICON_SIZE = rem('12px')

const PenIcon = styled('img')`
  width: ${ICON_SIZE};
  height: ${ICON_SIZE};
`

const EditButton = ({ onClick }) => (
  <Button.Circle onClick={onClick}>
    <PenIcon src={penIcon} alt="" />
  </Button.Circle>
)

EditButton.propTypes = {
  onClick: PropTypes.func,
}

export default EditButton
