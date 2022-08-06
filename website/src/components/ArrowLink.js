import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { fontSizes, fontWeights, space, COLORS } from 'Theme'
import Link from 'components/RouterLink'
import { Text } from 'components/Typography'
import ArrowheadIcon from 'images/svg/arrowhead.inline.svg'

const SIZE = rem('12px')

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: baseline;

  font-size: ${fontSizes.l};
  font-weight: ${fontWeights.semi_bold};
  white-space: nowrap;

  color: ${COLORS.CHUN_LI_BLUE};

  &:hover {
    text-decoration: underline;
  }
`

const StyledArrowheadIcon = styled(ArrowheadIcon)`
  margin-top: ${space.m};
  height: ${SIZE};
  width: ${SIZE};
  flex: none;

  transform: translateY(1px) rotate(-90deg);
`

const ArrowLink = ({ children, ...props }) => (
  <StyledLink {...props}>
    <Text mr="xs">{children}</Text>
    <StyledArrowheadIcon />
  </StyledLink>
)

ArrowLink.propTypes = {
  children: PropTypes.string,
}

export default ArrowLink
