import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro' // eslint-disable-line no-unused-vars
import { Manager, Reference, Popper } from 'react-popper'

const Popover = ({
  children,
  arrowStyle,
  targetComp,
  placement,
  isVisible,
  popoverStyle,
  zIndex,
}) => (
  <Manager>
    <Reference>
      {({ ref }) => React.cloneElement(targetComp, { ref })}
    </Reference>
    {isVisible &&
      ReactDOM.createPortal(
        <Popper
          positionFixed
          placement={placement}
          modifiers={{
            preventOverflow: { padding: 0, boundariesElement: 'window' },
          }}
        >
          {({ ref, style, placement: popperPlacement, arrowProps }) => (
            <div
              ref={ref}
              style={popoverStyle || { zIndex, ...style }}
              data-placement={popperPlacement}
            >
              {children}
              <div
                ref={arrowProps.ref}
                style={arrowProps.style}
                data-placement={popperPlacement}
                placement={popperPlacement}
                css={arrowStyle}
              />
            </div>
          )}
        </Popper>,
        document.querySelector('body')
      )}
  </Manager>
)

Popover.propTypes = {
  children: PropTypes.node.isRequired,
  arrowStyle: PropTypes.array,
  targetComp: PropTypes.node.isRequired,
  placement: PropTypes.string,
  isVisible: PropTypes.bool,
  popoverStyle: PropTypes.object,
  zIndex: PropTypes.number,
}

export default Popover
