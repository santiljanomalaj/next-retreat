import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { space, COLORS } from 'Theme'
import SearchIcon from 'images/svg/search.inline.svg'
import Input from './Input'

const ICON_SIZE = rem('16px')
const ICON_BOX_WIDTH = rem('40px')

const StyledSearchIcon = styled(SearchIcon)`
  width: ${ICON_SIZE};
  height: ${ICON_SIZE};

  color: ${COLORS.SILK_SOX};
  stroke: currentColor;
`

const IconBox = styled('div')`
  pointer-events: none;
  position: absolute;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
  width: ${ICON_BOX_WIDTH};
  padding-left: ${space.xs};
`

const StyledBox = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
`

const StyledInput = styled(Input)`
  padding-left: ${ICON_BOX_WIDTH};

  text-indent: initial;
`

const Search = React.forwardRef(({ isDisabled, ...props }, ref) => (
  <StyledBox>
    <IconBox>
      <StyledSearchIcon />
    </IconBox>
    <StyledInput disabled={isDisabled} {...props} ref={ref} />
  </StyledBox>
))

Search.propTypes = {
  isDisabled: PropTypes.bool,
}

export default Search
