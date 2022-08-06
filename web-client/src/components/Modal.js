import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem, transparentize } from 'polished'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { mq, radius, space, BOXSHADOWS, COLORS } from 'Theme'
import xMarkIcon from 'assets/images/svg/xmark.svg'

const PADDING = space.l
const PADDING_SMALL = space.m
const CLOSE_BUTTON_SIZE = rem('32px')

const Overlay = styled(DialogOverlay)`
  overflow: auto;
  z-index: 1;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${transparentize(0.2, COLORS.WHITE)} !important;
`

const Content = styled(DialogContent)`
  overflow: hidden;
  position: relative;
  overflow-y: auto;

  max-height: 100%;
  ${({ $contentWidth }) =>
    $contentWidth ? `width: ${$contentWidth};` : `min-width: ${rem('520px')};`}
  ${({ $customPadding }) => !$customPadding && `padding: ${PADDING};`}

  box-shadow: ${BOXSHADOWS.CARD};
  ${({ $customBackgroundColor }) => $customBackgroundColor ? `background-color: ${$customBackgroundColor};`: `background-color: ${COLORS.WHITE};`}
  
  border-radius: ${radius.m};
  outline: none;

  ${mq.to.tablet`
    min-width: 0;
    width: 100vw;
    height: var(--nr-100vh, 100vh);
    padding: ${PADDING_SMALL};
    `}
`

const CloseButton = styled('button')`
  position: absolute;
  top: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  height: ${CLOSE_BUTTON_SIZE};
  width: ${CLOSE_BUTTON_SIZE};
  margin: ${({ customPadding }) => customPadding || PADDING};

  background: url("${xMarkIcon}") center no-repeat;

  ${mq.to.tablet`
    margin: ${PADDING_SMALL};
  `}
`

const Modal = ({
  children,
  isOpen,
  closeModal,
  ariaLabel,
  hasCloseButton,
  className,
  contentWidth,
  customPadding,
  customBackgroundColor
}) => (
  <Overlay isOpen={isOpen} onDismiss={closeModal}>
    <Content
      $customPadding={customPadding}
      className={className}
      aria-label={ariaLabel}
      $contentWidth={contentWidth}
      $customBackgroundColor={customBackgroundColor}
    >
      {hasCloseButton && (
        <CloseButton
          type="button"
          onClick={closeModal}
          customPadding={customPadding}
        />
      )}
      {children}
    </Content>
  </Overlay>
)

Modal.defaultProps = {
  hasCloseButton: true,
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  hasCloseButton: PropTypes.bool,
  className: PropTypes.string,
  contentWidth: PropTypes.string,
  customPadding: PropTypes.string,
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
