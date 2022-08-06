import React from 'react'
import styled from 'styled-components/macro'
import { rem } from 'polished'
import base, { filename } from 'paths.macro'
import { space } from 'Theme'
import { createStoryName } from 'utils/storybook'
import { ReactComponent as SearchIcon } from 'assets/images/svg/search.svg'
import Link from './Link'

export const DefaultUsage = () => <Link href="#something">Click me!</Link>

const ICON_SIZE = rem('15px')

const StyledSearchIcon = styled(SearchIcon)`
  height: ${ICON_SIZE};
  width: ${ICON_SIZE};
  margin-right: ${space.s};
`

export const WithIcon = () => (
  <Link href="#something">
    <StyledSearchIcon />
    Link with icon
  </Link>
)

export default {
  component: Link,
  title: createStoryName({ base, filename }),
}
