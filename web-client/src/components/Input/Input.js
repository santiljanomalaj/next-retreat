import styled from 'styled-components'
import { space } from 'styled-system'
import { rem } from 'polished'
import { COLORS, BOXSHADOWS, theme } from 'Theme'

const inputFuncs = [space]
const borderOnHover = `0.5px solid ${COLORS.CHUN_LI_BLUE}`
const borderIsInvalid = `0.5px solid ${COLORS.SPARKLING_RED}`
export const INPUT_HEIGHT = rem('40px')

export const InputBase = styled('input')`
  display: block;
  height: ${INPUT_HEIGHT};
  width: 100%;
  font-size: ${theme.fontSizes.m};
  font-size: 16px; // iOS zoom fix
  color: ${COLORS.SPACE_CADET};
  box-shadow: ${BOXSHADOWS.INNER};
  border: 0.5px solid ${COLORS.IRRADIANT_IRIS};
  word-break: break-all;
  appearance: none;
  :disabled {
    background-color: ${COLORS.LYNX_WHITE};
  }
`

export const Input = styled(InputBase)`
  padding-left: ${theme.space.m};
  border-radius: ${theme.radius.m};
  @media (hover: hover) {
    &:hover {
      border: ${({ disabled }) => !disabled && borderOnHover};
    }
  }
  :focus {
    border: ${borderOnHover};
    background-color: ${COLORS.LYNX_WHITE};
  }
  ::placeholder {
    color: ${COLORS.SILK_SOX};
  }
  ${({ isInvalid }) =>
    isInvalid &&
    `
    border: ${borderIsInvalid};
    background-color: ${COLORS.SEFID_WHITE};
    :focus {
      border: ${borderIsInvalid};
      background-color: ${COLORS.SEFID_WHITE};
    }
    @media (hover: hover) {
      &:hover {
        border: ${borderIsInvalid};
      }
    }
  `}
  ${inputFuncs}
`
