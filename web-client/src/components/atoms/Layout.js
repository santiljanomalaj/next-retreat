import styled, { css } from 'styled-components'
import {
  space,
  color,
  layout,
  typography,
  background,
  flexbox,
  alignItems,
  justifyContent,
  justifyItems,
  flex,
  order,
  position,
  grid,
  gridArea,
} from 'styled-system'
import propTypes, { createPropTypes } from '@styled-system/prop-types'
import { theme } from 'Theme'

const gutter = ({ gutterX, gutterY }) =>
  css`
    ${gutterX && `> * + * { margin-left: ${theme.space[gutterX] || gutterX}};`}
    ${gutterY && `> * + * { margin-top: ${theme.space[gutterY] || gutterY}};`}
  `

const commonPropFunctions = [
  layout,
  space,
  position,
  typography,
  flex,
  order,
  gridArea,
  color,
  background,
  gutter,
]

const commonPropTypes = {
  ...propTypes.layout,
  ...propTypes.space,
  ...propTypes.position,
  ...propTypes.typography,
  ...propTypes.color,
  ...propTypes.background,
  ...createPropTypes(flex.propNames),
  ...createPropTypes(order.propNames),
  ...createPropTypes(gridArea.propNames),
  ...createPropTypes(['gutter']),
}

const Box = styled('div')`
  ${commonPropFunctions}
`

Box.propTypes = commonPropTypes

const Flex = styled('div')`
  display: flex;
  ${commonPropFunctions}
  ${flexbox}
`

Flex.propTypes = {
  ...commonPropTypes,
  ...propTypes.flexbox,
}

const Grid = styled('div')`
  display: grid;
  ${commonPropFunctions}
  ${grid}
  ${alignItems}
  ${justifyContent}
  ${justifyItems}
`

Grid.propTypes = {
  ...commonPropTypes,
  ...propTypes.grid,
  ...createPropTypes(alignItems.propNames),
  ...createPropTypes(justifyContent.propNames),
  ...createPropTypes(justifyItems.propNames),
}

export { Box, Flex, Grid }
