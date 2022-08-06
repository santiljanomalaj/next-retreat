import styled from 'styled-components'
import { space, color, typography, display, layout } from 'styled-system'
import propTypes, { createPropTypes } from '@styled-system/prop-types'
import { theme, mq, COLORS } from 'Theme'
import { Box } from 'components/atoms/Layout'

const textFunctions = [display, space, color, typography, layout]

const styledPropTypes = {
  ...createPropTypes(display.propNames),
  ...propTypes.space,
  ...propTypes.color,
  ...propTypes.typography,
  ...propTypes.layout,
}

export const Text = styled('span')`
  ${textFunctions}
`

Text.propTypes = styledPropTypes

export const Label = styled('span')`
  font-weight: ${theme.fontWeights.semi_bold};
  font-size: ${theme.fontSizes.xxs};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;

  color: ${COLORS.BLUEBERRY_SODA};

  ${textFunctions}
`

const Block = styled(Box)`
  > * + * {
    margin-top: ${({ gutter }) => theme.space[gutter] || gutter};
  }
`

Block.defaultProps = {
  gutter: '1em',
}

Text.Block = Block

export const H1 = styled('h1')`
  font-size: ${theme.fontSizes.xxxl};
  ${mq.from.tablet`
    font-size: ${theme.fontSizes.xxxxl};
  `}
  ${textFunctions}
`

export const H2 = styled('h2')`
  font-size: ${theme.fontSizes.xxl};
  ${mq.from.tablet`
    font-size: ${theme.fontSizes.xxxl};
  `}
  ${textFunctions}
`

export const H3 = styled('h3')`
  font-size: ${theme.fontSizes.xl};
  ${mq.from.tablet`
    font-size: ${theme.fontSizes.xxl};
  `}
  ${textFunctions}
`

export const H4 = styled('h4')`
  font-size: ${theme.fontSizes.l};
  ${mq.from.tablet`
    font-size: ${theme.fontSizes.xl};
  `}
  ${textFunctions}
`

export const H5 = styled('h5')`
  font-size: ${theme.fontSizes.m};
  ${mq.from.tablet`
    font-size: ${theme.fontSizes.l};
  `}
  ${textFunctions}
`

export const H6 = styled('h6')`
  font-size: ${theme.fontSizes.s};
  ${mq.from.tablet`
    font-size: ${theme.fontSizes.m};
  `}
  ${textFunctions}
`
