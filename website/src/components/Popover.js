import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { rem, triangle } from 'polished'
import { radius, COLORS } from 'Theme'
import { usePopper } from 'react-popper'
import OutsideClickHandler from 'react-outside-click-handler'

const ARROW_HEIGHT = rem('8px')

const arrowStyle = css`
  position: absolute;
  top: 1px;

  &::before,
  &::after {
    content: '';
    display: block;

    ${triangle({
      pointingDirection: 'top',
      width: rem('18px'),
      height: ARROW_HEIGHT,
      foregroundColor: COLORS.WHITE,
    })}
  }

  &::before {
    z-index: -1;
    position: absolute;

    filter: drop-shadow(0px 2px 8px rgba(66, 149, 165, 0.2))
      drop-shadow(0px 2px 2px rgba(66, 149, 165, 0.25))
      drop-shadow(0px -2px 2px rgba(66, 149, 165, 0.25));
  }
`

const Card = styled('div')`
  z-index: 1;
  position: relative;

  width: min-content;
  min-width: ${rem('200px')};
  margin-top: ${ARROW_HEIGHT};

  background-color: ${COLORS.WHITE};
  box-shadow: 0px 2px 8px rgba(66, 149, 165, 0.2),
    0px 2px 2px rgba(66, 149, 165, 0.25), 0px -2px 2px rgba(66, 149, 165, 0.25);
  border-radius: ${radius.m};
`

const Popover = ({ isOpen, onClose, onToggle, children, referenceComp }) => {
  const targetRef = React.useRef(null)
  const [referenceElement, setReferenceElement] = React.useState(null)
  const [popperElement, setPopperElement] = React.useState(null)
  const [arrowElement, setArrowElement] = React.useState(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      {
        name: 'preventOverflow',
        options: { padding: { left: 16, right: 16 }, rootBoundary: 'viewport' },
      },
    ],
  })

  return (
    <>
      <div style={{ display: 'contents' }} ref={targetRef}>
        {React.cloneElement(referenceComp, {
          onClick: onToggle,
          ref: setReferenceElement,
        })}
      </div>
      {isOpen && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <OutsideClickHandler
            disabled={!isOpen}
            onOutsideClick={(e) => {
              if (!targetRef.current.contains(e.target)) {
                onClose()
              }
            }}
          >
            <Card>{children}</Card>
          </OutsideClickHandler>
          <div
            ref={setArrowElement}
            style={styles.arrow}
            css={arrowStyle}
            {...attributes.popper}
          />
        </div>
      )}
    </>
  )
}

Popover.defaultProps = {
  referenceComp: <button type="button">Reference element</button>,
}

Popover.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  referenceComp: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
}

export default Popover
