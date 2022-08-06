import { css, createGlobalStyle } from 'styled-components'
import { fluidRange, transparentize, math, rem } from 'polished'

export const fontStack = `system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'`
export const BORDER_WIDTH = '0.5px'
export const MAX_CONTENT_WIDTH = rem('1120px')

export const COLORS = {
  BLACK: '#000',
  CERULEAN: '#62AAEC',
  CHUN_LI_BLUE: '#175EDC' /* Brand Color */,
  SOULSTONE_BLUE: '#003DA1',
  SPACE_CADET: '#0F264E' /* Dark Blue */,
  SPACE_CADET_50: transparentize(0.5, '#0F264E'),
  DEEP_RESERVOIR: '#465061' /* 80 Grey */,
  BLUEBERRY_SODA: '#8591A5' /* 60 Grey */,
  SILK_SOX: '#A9B4C8' /* 40 Grey */,
  BROTHER_BLUE: '#B2BCCC' /* 20 Grey */,
  IRRADIANT_IRIS: '#DBDFE7' /* 15 Grey */,
  LYNX_WHITE: '#F8F8F8' /* 5 Grey */,
  WHITE: '#FFFFFF' /* White */,
  SUPER_SILVER: '#eeeeee',
  EXPLORATION_GREEN: '#58A55D',
  SEFID_WHITE: '#FFF0F0',
  SPARKLING_RED: '#F33636',
  GOUDA_GOLD: '#F2D01E',
  COLD_MORNING: '#E5E5E5',
  BRILLIANCE: '#fcfcfc',
  COTTON_BALL: '#F7FAFF',
  PALE_GREY: '#FAFCFE',
}

export const BOXSHADOWS = {
  TOOLTIP: ` 0px 13px 38px 0px rgba(32, 32, 32, 0.1)`,
  LIGHT: '0px -1px 2px rgba(143, 133, 165, 0.24)',
  DARK: '0px 1px 2px rgba(13, 64, 128, 0.19)',
  INNER: 'inset 1px 1px 4px rgba(0, 0, 0, 0.08)',
  CARD:
    '0px 2px 8px rgba(66, 149, 165, 0.2), 0px 2px 2px rgba(66, 149, 165, 0.25)',
}

export const GRADIENTS = {
  TAG: `180deg, ${COLORS.IRRADIANT_IRIS} 0%, rgba(223, 219, 231, 0.765625) 95.64%, #C5BED1 97.54%`,
  RATING: `180deg, ${COLORS.SPACE_CADET} 0%, #472F7B 100%`,
  BUTTON_HOVER:
    '180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%',
  BUTTON_PRESSED: '0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)',
  BUTTON_DISABLED: '0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)',
}

export const space = {
  xxs: rem(2),
  xs: rem(4),
  s: rem(8),
  m: rem(16),
  l: rem(32),
  xl: rem(64),
  xxl: rem(128),
  xxxl: rem(256),
  xxxxl: rem(400),
}

export const fontSizes = {
  xxs: rem(10),
  xs: rem(12),
  s: rem(14),
  m: rem(16),
  l: rem(18),
  xl: rem(20),
  xxl: rem(24),
  xxxl: rem(28),
  xxxxl: rem(32),
  xxxxxl: rem(36),
  xxxxxxl: rem(48),
}

export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semi_bold: 600,
  bold: 700,
}

export const radius = {
  xs: '1px',
  s: '2px',
  m: '4px',
  l: '8px',
  circle: '50%',
  pill: '9999px',
}

const devices = {
  mobile: '0',
  tablet: '768px',
  desktop: '1024px',
  tv: '1440px',
}

export const breakpoints = {
  mobile: devices.mobile,
  tablet: devices.tablet,
  desktop: devices.desktop,
  tv: devices.tv,
}

const mediaQuery = ({ mobileFirst = true }) =>
  Object.entries(devices).reduce(
    (deviceMediaQueries, [label, breakpoint]) => ({
      ...deviceMediaQueries,
      [label]: (...args) => css`
        @media screen and (${mobileFirst ? 'min-width' : 'max-width'}: ${math(
        `${breakpoint} - 0.1px`
      )}) {
          ${css(...args)}
        }
      `,
    }),
    {}
  )

// mq is for usage within `styled` function
export const mq = {
  to: mediaQuery({ mobileFirst: false }),
  from: mediaQuery({ mobileFirst: true }),
}

export const GlobalStyles = createGlobalStyle`
  :root {
    --reach-dialog: 1; /* https://reacttraining.com/reach-ui/styling/#skip-including-styles */
  }
  html,
  body {
    min-width: 320px;
    margin: 0;
  }
  html {
    ${fluidRange(
      {
        prop: 'font-size',
        fromSize: '13px',
        toSize: '18px',
      },
      '320px',
      '2200px'
    )}
    cursor: initial;
  }
  body {
    font-family: ${fontStack};
    letter-spacing: -${1 / 32}em;
    color: ${COLORS.SPACE_CADET};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 0 0.5em 0;
  }
  h1,
  h2,
  h3 {
    line-height: 1.3;
  }
  h4,
  h5,
  h6 {
    line-height: 1.5;
  }
  p {
    margin: 0;
  }

  ol {
    margin: 0;
    padding: 0;
  }

  input,
  textarea,
  button {
    font-family: inherit;
    font-size: ${fontSizes.m};
    letter-spacing: inherit;
    box-sizing: border-box;
  }

  input::placeholder {
    font-size: inherit;
  }

  button {
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }

  input[type="number"] {
    appearance: textfield;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }

  code,
  kbd,
  samp,
  pre {
    font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 1em;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  :focus {
    outline: none;
  }
`

export const theme = {
  space,
  fontSizes,
  fontWeights,
  breakpoints,
  radius,
}
