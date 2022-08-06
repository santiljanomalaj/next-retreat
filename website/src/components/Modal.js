import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { radius, space, BOXSHADOWS, COLORS } from 'Theme'
import { getDisableBodyScrollDefaultSelector } from 'constants/constants'

export const Overlay = styled(DialogOverlay)`
  overflow: auto;
  z-index: 1;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: grid;
  justify-items: center;
  align-content: center;

  background-color: ${transparentize(0.2, COLORS.WHITE)} !important;
`

const Content = styled(DialogContent)`
  overflow: hidden;
  position: relative;

  max-height: 100%;
  max-width: 100%;
  padding: ${space.m};

  box-shadow: ${BOXSHADOWS.CARD};
  background-color: ${COLORS.WHITE};
  border-radius: ${radius.m};
  outline: none;
`

const Modal = ({ children, isOpen, closeModal, ariaLabel }) => {
  React.useEffect(() => {
    if (isOpen) {
      disableBodyScroll(getDisableBodyScrollDefaultSelector())
    } else {
      clearAllBodyScrollLocks()
    }
  }, [isOpen])

  return (
    <Overlay isOpen={isOpen} onDismiss={closeModal}>
      <Content aria-label={ariaLabel}>{children}</Content>
    </Overlay>
  )
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
}

export const useModal = () => {
  const [isOpen, setOpen] = React.useState(false)

  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
  }

  const toggleModal = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  return { isOpen, openModal, closeModal, toggleModal }
}

export default Modal
