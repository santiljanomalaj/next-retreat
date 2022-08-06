import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { math, rem } from 'polished'
import { COLORS } from 'Theme'
import { ReactComponent as CheckmarkIcon } from 'assets/images/svg/checkmark.svg'

const StyledSuccessFlag = styled('div')`
  position: absolute;

  color: ${COLORS.WHITE};

  &::after {
    content: '';
    position: absolute;

    height: 0;
    width: 0;

    border: ${({ size }) => size} solid;
    border-color: ${COLORS.EXPLORATION_GREEN} transparent transparent
      ${COLORS.EXPLORATION_GREEN};
  }

  ${({ offset }) => `
    top: ${offset};
    left: ${offset};
  `}
`

const StyledCheckmarkIcon = styled(CheckmarkIcon)`
  z-index: 1;
  position: absolute;

  ${({ offset }) => `
    left: ${offset};
    right: ${offset};
  `}

  ${({ size }) => `
    width: ${size};
    height: ${size};
  `}
`

const SuccessFlag = ({ size }) => {
  const offset = math(`${size} / 5`)

  return (
    <StyledSuccessFlag size={size} offset={offset}>
      <StyledCheckmarkIcon size={size} offset={offset} />
    </StyledSuccessFlag>
  )
}

SuccessFlag.defaultProps = {
  size: rem('12px'),
}

SuccessFlag.propTypes = {
  size: PropTypes.string,
}

export default SuccessFlag
