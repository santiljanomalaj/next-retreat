import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BOXSHADOWS, COLORS, mq } from 'Theme'
import { TOPBAR_HEIGHT } from 'constants/style'

const StyledTopbar = styled('header')`
  display: flex;
  align-items: center;

  height: ${TOPBAR_HEIGHT};

  box-shadow: ${BOXSHADOWS.DARK};
  background-color: ${COLORS.WHITE};
  ${mq.from.tablet`
      justify-content: space-between;
  `}
`

const Topbar = ({ className, children }) => (
  <StyledTopbar className={className}>{children}</StyledTopbar>
)

Topbar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

export default Topbar
