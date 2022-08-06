import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { typography } from 'styled-system'
import { fontSizes, space, COLORS, BOXSHADOWS, GRADIENTS, theme } from 'Theme'
import { ReactComponent as ArrowSVG } from 'assets/images/svg/arrow-button.svg'

const borderOnHover = `0.5px solid ${COLORS.CHUN_LI_BLUE}`
const borderDisabled = `0.5px solid ${COLORS.IRRADIANT_IRIS}`
export const BUTTON_HEIGHT = rem('40px')
const ROUND_BUTTON_HEIGHT = rem('32px')

const ButtonBase = styled('button')`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: ${theme.radius.m};
  min-width: ${rem(62)};
  background-color: ${COLORS.WHITE};
  ${({ isBlock }) => isBlock && `width: 100%`};
`

ButtonBase.defaultProps = {
  type: 'button',
}

const ArrowImg = styled(ArrowSVG)`
  height: ${rem(15)};
  margin-right: ${space.s};
`

const buttonStyle = `
  padding: 0 ${space.m};
  height: ${BUTTON_HEIGHT};
  font-size: ${fontSizes.m};
`

const Primary = styled(ButtonBase)`
  ${buttonStyle}
  font-weight: ${theme.fontWeights.semi_bold};
  color: ${COLORS.WHITE};
  background-color: ${COLORS.CHUN_LI_BLUE};
  @media (hover: hover) {
    &:hover {
      background-image: linear-gradient(${GRADIENTS.BUTTON_HOVER});
    }
  }
  :active {
    background-image: linear-gradient(${GRADIENTS.BUTTON_PRESSED});
  }
  :disabled {
    background-image: linear-gradient(${GRADIENTS.BUTTON_DISABLED});
  }
`

const Secondary = styled(ButtonBase)`
  ${buttonStyle}
  color: ${COLORS.SPACE_CADET};
  background-color: ${COLORS.WHITE};
  border: 0.5px solid ${COLORS.SILK_SOX};
  box-shadow: ${BOXSHADOWS.DARK};
  @media (hover: hover) {
    &:hover {
      border: ${borderOnHover};
    }
  }
  :active {
    box-shadow: none;
    background-color: ${COLORS.LYNX_WHITE};
  }
  :disabled {
    box-shadow: none;
    border: ${borderDisabled};
    background-color: ${COLORS.LYNX_WHITE};
    color: ${COLORS.BLUEBERRY_SODA};
  }
`

const Back = ({ children, ...buttonProps }) => (
  <Secondary {...buttonProps}>
    <ArrowImg />
    {children}
  </Secondary>
)

Back.propTypes = {
  children: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

export const tertiaryStyle = `
  display: inline-flex;
  align-items: center;
  padding: 0 ${space.s};
  height: ${BUTTON_HEIGHT};
  color: ${COLORS.CHUN_LI_BLUE};
`

const Tertiary = styled('button')`
  ${tertiaryStyle}
  ${typography}
`

Tertiary.defaultProps = {
  type: 'button',
}

const pillActiveStyle = `
  box-shadow: none;
  background-color: ${COLORS.IRRADIANT_IRIS};
  border: ${borderOnHover};
  box-shadow: ${BOXSHADOWS.INNER};
`

const Pill = styled(ButtonBase)`
  font-size: ${fontSizes.s};
  height: ${ROUND_BUTTON_HEIGHT};
  min-width: ${rem('46px')};
  padding: 0 ${space.m};
  border-radius: ${theme.radius.pill};
  color: ${COLORS.SPACE_CADET};
  background-color: ${COLORS.WHITE};
  box-shadow: ${BOXSHADOWS.DARK};
  border: ${borderDisabled};
  @media (hover: hover) {
    &:hover {
      border: ${borderOnHover};
    }
  }
  :active {
    ${pillActiveStyle}
  }
  :disabled {
    box-shadow: none;
    background-color: ${COLORS.LYNX_WHITE};
    color: ${COLORS.BLUEBERRY_SODA};
    border: ${borderDisabled};
  }

  ${({ isActive }) => isActive && pillActiveStyle}

  ${({ isOutlined, isActive }) =>
    isOutlined &&
    !isActive &&
    `
      &:not(:hover):not(:disabled) {
        box-shadow: ${BOXSHADOWS.DARK}, inset 0 0 0 1.5px ${COLORS.CHUN_LI_BLUE};
        border-color: transparent;
      }
    `}
`

const Circle = styled(Pill)`
  overflow: hidden;

  flex: none;
  width: ${ROUND_BUTTON_HEIGHT};
  min-width: 0;
  padding: 0 ${space.xs};

  font-size: ${fontSizes.m};
`

export default {
  Primary,
  Secondary,
  Tertiary,
  Pill,
  Circle,
  Back,
}
