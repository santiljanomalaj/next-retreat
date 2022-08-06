import styled from 'styled-components'
import { rem } from 'polished'
import {
  fontSizes,
  fontWeights,
  radius,
  space,
  BORDER_WIDTH,
  BOXSHADOWS,
  COLORS,
  GRADIENTS,
} from 'Theme'

const borderOnHover = `${BORDER_WIDTH} solid ${COLORS.CHUN_LI_BLUE}`
const borderDisabled = `${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS}`

const Button = styled('button')`
  justify-content: center;
  align-items: center;

  min-width: ${rem('171px')};
  padding: ${space.xs} ${space.m};

  font-weight: ${fontWeights.semi_bold};
  text-decoration: none;

  box-shadow: ${BOXSHADOWS.DARK};
  background-color: ${COLORS.CHUN_LI_BLUE};
  border-radius: ${radius.m};
  color: ${COLORS.WHITE};

  &:hover {
    background-image: linear-gradient(${GRADIENTS.BUTTON_HOVER});
  }

  &:active {
    background-image: linear-gradient(${GRADIENTS.BUTTON_PRESSED});
  }

  &:disabled {
    background-image: linear-gradient(${GRADIENTS.BUTTON_DISABLED});
  }
`

export const INLINE_BUTTON_HEIGHT = rem('40px')

const Inline = styled(Button)`
  display: inline-flex;

  height: ${INLINE_BUTTON_HEIGHT};
  ${({ isBlock }) => isBlock && `width: 100%`};

  font-size: ${fontSizes.m};
`

const Block = styled(Button)`
  display: flex;

  height: ${rem('54px')};
  width: 100%;

  font-size: ${fontSizes.l};
`

const ButtonBase = styled('button')`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: ${radius.m};
  min-width: ${rem(62)};
  background-color: ${COLORS.WHITE};
  ${({ isBlock }) => isBlock && `width: 100%`};
`

const Secondary = styled(ButtonBase)`
  height: ${INLINE_BUTTON_HEIGHT};
  min-width: ${rem('200px')};

  border: 0.5px solid ${COLORS.SILK_SOX};
  box-shadow: ${BOXSHADOWS.DARK};

  font-size: ${fontSizes.m};
  text-decoration: none;

  color: ${COLORS.SPACE_CADET};
  background-color: ${COLORS.WHITE};

  padding: 0 ${space.m};

  &:hover {
    border: ${borderOnHover};
  }

  &:active {
    box-shadow: none;
    background-color: ${COLORS.LYNX_WHITE};
  }

  &:disabled {
    box-shadow: none;
    border: ${borderDisabled};
    background-color: ${COLORS.LYNX_WHITE};
    color: ${COLORS.BLUEBERRY_SODA};
  }
`

Button.defaultProps = {
  type: 'button',
}

Button.Inline = Inline
Button.Block = Block
Button.Secondary = Secondary

export default Button
