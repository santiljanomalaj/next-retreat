import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import styled from 'styled-components'
import { rem } from 'polished'
import { space } from 'Theme'
import Button from 'components/atoms/Button'
import { Text } from 'components/atoms/Typography'
import mountainsIcon from 'assets/images/svg/mountains.svg'
import Topbar from './Topbar'

const Logo = styled('img')`
  height: ${rem('40px')};
`

const StyledTopbar = styled(Topbar)`
  padding: 0 ${space.m};
`

const Content = styled('div')`
  > * {
    margin-left: ${space.m};
  }
`

export const DefaultView = () => (
  <StyledTopbar>
    <Content>
      <Logo src={mountainsIcon} alt="" />
      <Text fontWeight="bold">My Cool Logo</Text>
    </Content>
    <Content>
      <Button.Secondary>Log in</Button.Secondary>
      <Button.Primary>Sign up</Button.Primary>
    </Content>
  </StyledTopbar>
)

export default {
  component: Topbar,
  title: createStoryName({ base, filename }),
}
