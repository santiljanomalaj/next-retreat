import { BORDER_WIDTH, BOXSHADOWS, COLORS } from 'Theme'

export const defaultStyle = `
  cursor: pointer;

  border: ${BORDER_WIDTH} solid ${COLORS.SILK_SOX};
  box-shadow: ${BOXSHADOWS.DARK};
  background-color: ${COLORS.WHITE};
`

export const hoverStyle = `
  border-color: ${COLORS.CHUN_LI_BLUE};
`

export const activeStyle = `
  border-color: ${COLORS.CHUN_LI_BLUE} !important;
  box-shadow: ${BOXSHADOWS.INNER} !important;
  background-color: ${COLORS.IRRADIANT_IRIS} !important;
`

export const disabledStyle = `
  cursor: default;

  color: ${COLORS.BLUEBERRY_SODA};
  box-shadow: none !important;
  background-color: ${COLORS.LYNX_WHITE} !important;

  & {
    border-color: ${COLORS.IRRADIANT_IRIS} !important;
  }

  @media (hover: hover) {
    &:hover {
      border-color: ${COLORS.IRRADIANT_IRIS} !important;
    }
  }
`
