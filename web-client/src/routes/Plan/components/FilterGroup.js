import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { space, COLORS } from 'Theme'
import { TOPBAR_HEIGHT } from 'constants/style'

const StyledFilterGroup = styled('div')`
  z-index: 2;
  position: sticky;
  top: ${TOPBAR_HEIGHT};

  height: ${rem('52px')};
  margin-top: -${rem('58px')};
`

const Scroller = styled('div')`
  overflow-x: auto;

  display: flex;
  align-items: center;

  height: 100%;

  background-color: ${COLORS.WHITE};

  > :not([data-placement]) {
    flex: none;
    margin-right: ${space.s};
  }

  > button:last-of-type {
    margin-left: auto;
    margin-right: 0;
  }

  ${({ outerPadding }) =>
    outerPadding &&
    `
      margin: 0 -${outerPadding};
      padding: 0 ${outerPadding};
  `}

  ${({ isSticky, outerPadding }) =>
    isSticky &&
    `
      &::before {
        content: '';
        pointer-events: none;

        position: absolute;
        right: -${outerPadding || 0};
        left: -100%;
        bottom: 0;

        height: 1px;

        background-color: ${COLORS.IRRADIANT_IRIS};
      }
  `}
`

const FilterGroup = React.forwardRef(
  ({ children, className, outerPadding, isSticky }, ref) => (
    <StyledFilterGroup className={className} ref={ref}>
      <Scroller outerPadding={outerPadding} isSticky={isSticky}>
        {children}
      </Scroller>
    </StyledFilterGroup>
  )
)

FilterGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  outerPadding: PropTypes.string,
  isSticky: PropTypes.bool,
}

export default FilterGroup
