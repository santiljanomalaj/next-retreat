import styled from 'styled-components'
import { rem } from 'polished'
import { radius, space, BORDER_WIDTH, BOXSHADOWS, COLORS } from 'Theme'

const hoverBorder = `${BORDER_WIDTH} solid ${COLORS.CHUN_LI_BLUE}`
const invalidBorder = `${BORDER_WIDTH} solid ${COLORS.SPARKLING_RED}`
export const INPUT_HEIGHT = rem('54px')

export const InputBase = styled('input')`
  display: block;

  height: ${INPUT_HEIGHT};
  width: 100%;

  font-size: 16px; // needs fixed value >= 16 to prevent zoom on mobile

  color: ${COLORS.SPACE_CADET};
  box-shadow: ${BOXSHADOWS.INNER};
  border: ${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS};

  &:disabled {
    background-color: ${COLORS.LYNX_WHITE};
  }
`

const Input = styled(InputBase)`
  text-indent: ${space.m};

  border-radius: ${radius.m};

  &:hover {
    border: ${({ disabled }) => !disabled && hoverBorder};
  }

  &:focus {
    border: ${hoverBorder};
    background-color: ${COLORS.LYNX_WHITE};
  }

  &::placeholder {
    color: ${COLORS.SILK_SOX};

    opacity: 1;
  }

  ${({ isInvalid }) =>
    isInvalid &&
    `
      border: ${invalidBorder};
      background-color: ${COLORS.SEFID_WHITE};

      &:focus {
        border: ${invalidBorder};
        background-color: ${COLORS.SEFID_WHITE};
      }

      &:hover {
        border: ${invalidBorder};
      }
    `}

    ${({ isHidden }) =>
    isHidden &&
    `
      display: none;
    `}
`

export default Input
