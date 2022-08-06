import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { math, rem } from 'polished'
import {
  fontSizes,
  fontWeights,
  radius,
  space,
  BORDER_WIDTH,
  COLORS,
} from 'Theme'
import Button from 'components/atoms/Button'
import { ReactComponent as ArrowheadIcon } from 'assets/images/svg/arrowhead.svg'
import { CELL_WIDTH, CELL_HEIGHT } from './constants'

const HEADER_UI_SIZE = rem('24px')
const BUTTON_SIZE = rem('32px')
const BUTTON_SIZE_INSET = rem('26px')
const ICON_SIZE = rem('12px')

export const HeaderTitle = styled('span')`
  overflow: hidden;

  font-size: ${fontSizes.l};
  font-weight: ${fontWeights.semi_bold};
  text-overflow: ellipsis;

  color: ${COLORS.SPACE_CADET};
`

const StyledArrowheadIcon = styled(ArrowheadIcon)`
  width: ${ICON_SIZE};
  height: ${ICON_SIZE};

  ${({ direction }) => {
    const rotation = {
      down: 0,
      left: 90,
      up: 180,
      right: 270,
    }[direction || 'down']
    return `
      transform: rotate(${rotation}deg);
    `
  }}
`

export const ButtonGroup = styled('div')`
  display: flex;

  ${({ axis }) => {
    if (axis === 'horizontal') {
      return `
        margin-left: ${space.m};

        > :first-child {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        > :last-child {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        > :not(:last-child) {
          margin-right: -${BORDER_WIDTH};
        }
      `
    }

    if (axis === 'vertical') {
      return `
        flex-direction: column;

        margin-bottom: ${space.m};

        > :first-child {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        > :last-child {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }

        > :not(:last-child) {
          margin-bottom: -${BORDER_WIDTH};
        }
      `
    }

    return ''
  }}
`

const StyledArrowButton = styled(Button.Secondary)`
  min-width: 0;
  width: ${BUTTON_SIZE};
  height: ${BUTTON_SIZE};
  padding: 0;

  color: ${COLORS.SPACE_CADET};

  ${({ isInset }) =>
    isInset
      ? `
        position: absolute;

        width: ${BUTTON_SIZE_INSET};
        height: ${BUTTON_SIZE_INSET};
      `
      : `
        @media (hover: hover) {
          &:hover {
            position: relative;
          }
        }
      `}

  ${({ direction, isInset }) => {
    const HALF_WIDTH = math(`${CELL_WIDTH} / 2`)
    const HALF_HEIGHT = math(`${CELL_HEIGHT} / 2`)

    if (isInset) {
      if (direction === 'left') {
        return `
          top: ${HALF_HEIGHT};
          left 0;

          transform: translate(-70%, -50%);
        `
      }
      if (direction === 'right') {
        return `
          top: ${HALF_HEIGHT};
          right ${CELL_WIDTH};

          transform: translate(70%, -50%);
        `
      }
      if (direction === 'up') {
        return `
          top: ${CELL_HEIGHT};
          right ${HALF_WIDTH};

          transform: translate(50%, -70%);
        `
      }
      if (direction === 'down') {
        return `
          bottom: 0;
          right ${HALF_WIDTH};

          transform: translate(50%, 70%);
        `
      }
    }

    return ''
  }}
`

export const ArrowButton = ({ isInset, direction, ...props }) => (
  <StyledArrowButton isInset={isInset} direction={direction} {...props}>
    <StyledArrowheadIcon direction={direction} />
  </StyledArrowButton>
)

ArrowButton.propTypes = {
  isInset: PropTypes.bool,
  direction: PropTypes.string,
}

const StyledDropdownButton = styled(Button.Secondary)`
  height: ${BUTTON_SIZE};

  font-size: ${fontSizes.s};

  color: ${COLORS.SPACE_CADET};

  ${StyledArrowheadIcon} {
    margin-left: ${space.m};
  }
`

export const DropdownButton = React.forwardRef(
  ({ children, ...props }, ref) => (
    <StyledDropdownButton {...props} ref={ref}>
      {children}
      <StyledArrowheadIcon />
    </StyledDropdownButton>
  )
)

DropdownButton.propTypes = {
  children: PropTypes.node,
}

const HeaderUI = styled('div')`
  display: flex;
  align-items: center;

  border: ${BORDER_WIDTH} solid ${COLORS.BROTHER_BLUE};

  ${HeaderTitle} {
    background-color: ${COLORS.WHITE};
  }

  ${({ position }) => {
    if (position === 'top') {
      return `
        grid-area: from;

        width: calc(100% - ${CELL_WIDTH});
        height: ${HEADER_UI_SIZE};
        padding: 0 ${space.s};
        margin-top: ${HEADER_UI_SIZE};

        border-bottom-width: 0;
        border-radius: ${radius.m} ${radius.m} 0 0;

        > * {
          transform: translateY(-${math(`${HEADER_UI_SIZE} / 2`)});
        }

        ${HeaderTitle} {
          padding: 0 ${space.s};
          margin-right: auto;
        }
      `
    }
    if (position === 'right') {
      return `
        flex-direction: column;
        grid-area: to;

        height: calc(100% - ${CELL_HEIGHT});
        width: ${HEADER_UI_SIZE};
        padding: ${space.s} 0;
        margin-top: auto;
        margin-right: ${HEADER_UI_SIZE};

        border-left: 0;
        border-radius: 0 ${radius.m} ${radius.m} 0;

        > * {
          transform: translateX(${math(`${HEADER_UI_SIZE} / 2`)});
        }

        ${HeaderTitle} {
          writing-mode: vertical-lr;

          padding: ${space.s} 0;
          margin-top: auto;
        }
      `
    }

    return ''
  }}
`

export default HeaderUI
