import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { COLORS } from 'Theme'

const Overlay = styled(DialogOverlay)`
  overflow: auto;
  z-index: 10;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  justify-items: center;
  align-content: center;
  background-color: ${transparentize(0.15, COLORS.WHITE)} !important;
`

const Content = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  max-height: 100%;
  outline: none;
`

const Modal = ({ children, isOpen, closeModal }) => (
  <Overlay isOpen={isOpen} onDismiss={closeModal}>
    <Content aria-label="content">{children}</Content>
  </Overlay>
)

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default Modal
