import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS } from 'Theme'
import Button, { INLINE_BUTTON_HEIGHT } from 'components/Button'
import HamburgerIcon from 'images/svg/hamburger.inline.svg'

const ICON_SIZE = rem('16px')

const StyledButton = styled(Button.Inline)`
  width: ${INLINE_BUTTON_HEIGHT};
  min-width: 0;
  padding: 0;

  background-color: ${({ contentColor }) =>
    contentColor ? 'transparent' : COLORS.WHITE};

  transition: background-color 0.2s;
`

const StyledHamburgerIcon = styled(HamburgerIcon)`
  width: ${ICON_SIZE};
  height: ${ICON_SIZE};

  color: ${({ $contentColor }) => $contentColor || COLORS.BLUEBERRY_SODA};
`

const TouchMenuButton = React.forwardRef(({ contentColor, ...props }, ref) => (
  <StyledButton contentColor={contentColor} {...props} ref={ref}>
    <StyledHamburgerIcon $contentColor={contentColor} />
  </StyledButton>
))

TouchMenuButton.propTypes = {
  contentColor: PropTypes.string,
}

export default TouchMenuButton
