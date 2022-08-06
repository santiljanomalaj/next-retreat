import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { radius, space, COLORS, BORDER_WIDTH, BOXSHADOWS } from 'Theme'
import arrowIcon from 'images/svg/arrow.svg'

const BUTTON_SIZE = rem('54px')
const DIRECTIONS = {
  LEFT: `transform: rotate(0deg);`,
  RIGHT: `transform: rotate(180deg);`,
}

const ArrowImg = styled('img')`
  height: ${rem('15px')};

  ${({ direction }) => DIRECTIONS[direction]}
`

const Button = styled('button')`
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${BUTTON_SIZE};
  height: ${BUTTON_SIZE};

  background-color: ${COLORS.WHITE};
  box-shadow: ${BOXSHADOWS.DARK};
  border: ${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS};
  border-radius: ${radius.circle};

  transition: opacity 0.3s;

  ${({ isAbsolute, direction, top }) =>
    isAbsolute &&
    `
      z-index: 1;
      position: absolute;
      ${top ? `top: ${top};` : ''}
      ${direction === 'LEFT' ? `left: ${space.m};` : ''}
      ${direction === 'RIGHT' ? `right: ${space.m};` : ''}
    `}
`

const ArrowButton = ({ top, onClick, direction, isAbsolute }) => (
  <Button
    top={top}
    onClick={onClick}
    direction={direction}
    isAbsolute={isAbsolute}
  >
    <ArrowImg src={arrowIcon} direction={direction} alt="" />
  </Button>
)

ArrowButton.propTypes = {
  top: PropTypes.string,
  isAbsolute: PropTypes.bool,
  direction: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

export default ArrowButton
