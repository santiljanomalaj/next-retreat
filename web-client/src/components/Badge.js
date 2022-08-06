import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { rem } from 'polished'
import {
  BORDER_WIDTH,
  BOXSHADOWS,
  COLORS,
  radius,
  space,
  fontSizes,
  fontWeights,
} from 'Theme'
import { Box } from 'components/atoms/Layout'
import { ReactComponent as TickIcon } from 'assets/images/svg/badge-tick.svg'

const BadgeBase = styled(Box)`
  white-space: nowrap;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: top;
  height: ${rem(20)};
  border-radius: ${radius.s};
  font-size: ${fontSizes.xxs};
  font-weight: ${fontWeights.semi_bold};
  box-shadow: ${({ boxShadow }) => boxShadow};
  padding: 0 ${space.xs};
`

const Badge = styled(BadgeBase)`
  color: ${({ color }) => color || COLORS.BLUEBERRY_SODA};
  border: ${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS};
  border-bottom-color: ${COLORS.BROTHER_BLUE};
  background-color: ${COLORS.WHITE};
  ${({ isUppercase }) =>
    isUppercase &&
    `
      text-transform: uppercase;
    `}
`

const Filled = styled(BadgeBase)`
  color: ${COLORS.WHITE};
  background-color: ${({ backgroundColor }) =>
    backgroundColor || COLORS.BLUEBERRY_SODA};
`

Filled.defaultProps = {
  boxShadow: BOXSHADOWS.DARK,
}

Badge.Filled = Filled

const Icon = styled(TickIcon)`
  height: ${rem(10)};
  margin-right: ${space.xs};
`

const Success = ({ children, ...props }) => (
  <Filled
    color={COLORS.WHITE}
    backgroundColor={COLORS.EXPLORATION_GREEN}
    {...props}
  >
    <div>
      <Icon />
      {children}
    </div>
  </Filled>
)

Badge.Success = Success

Success.propTypes = {
  children: PropTypes.string.isRequired,
}

export default Badge
