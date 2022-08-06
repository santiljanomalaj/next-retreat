import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import Button, { BUTTON_HEIGHT } from 'components/atoms/Button'
import hamburgerIcon from 'assets/images/svg/hamburger.svg'

const ICON_SIZE = rem('16px')

const StyledButton = styled(Button.Secondary)`
  min-width: 0;
  width: ${BUTTON_HEIGHT};
  padding: 0;

  border: none;
`

const HamburgerIcon = styled('img')`
  width: ${ICON_SIZE};
  height: ${ICON_SIZE};
`

const TouchMenuButton = React.forwardRef((props, ref) => (
  <StyledButton {...props} ref={ref}>
    <HamburgerIcon src={hamburgerIcon} alt="" />
  </StyledButton>
))

export default TouchMenuButton
