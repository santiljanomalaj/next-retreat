import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { DialogContent } from '@reach/dialog'
import { COLORS, space, mq } from 'Theme'
import { Overlay } from 'components/Modal'
import CancelIcon from 'images/svg/cancel.inline.svg'
import Form from './Form'

const ICON_SIZE = rem('20px')

const StyledCancelIcon = styled(CancelIcon)`
  z-index: 1;
  position: absolute;
  width: ${ICON_SIZE};
  margin: ${space.l} 0 0 ${space.l};
  ${mq.to.tablet`
    margin: ${space.m} 0 0 ${space.m};
  `}
  cursor: pointer;
`

const Content = styled(DialogContent)`
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  outline: none;
  background-color: ${COLORS.WHITE};
`

const GetAccessModal = ({ isOpen, closeModal, ariaLabel }) => (
  <Overlay isOpen={isOpen} onDismiss={closeModal}>
    <Content aria-label={ariaLabel}>
      <StyledCancelIcon onClick={closeModal} />
      <Form />
    </Content>
  </Overlay>
)

GetAccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
}

export default GetAccessModal
