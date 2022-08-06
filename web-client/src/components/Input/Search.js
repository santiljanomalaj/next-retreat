import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import searchIcon from 'assets/images/svg/search.svg'
import { Input, INPUT_HEIGHT } from './Input'

const SIZE = rem(16)

const StyledBox = styled('div')`
  position: relative;
  ::before {
    content: '';
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: ${rem(22)};
    transform: translate(-50%, -50%);
    z-index: 1;
    width: ${SIZE};
    height: ${SIZE};
    background: url("${searchIcon}") center / contain no-repeat;
  }
`

const Search = React.forwardRef(({ isDisabled, ...props }, ref) => (
  <StyledBox>
    <Input pl={INPUT_HEIGHT} disabled={isDisabled} {...props} ref={ref} />
  </StyledBox>
))

Search.propTypes = {
  isDisabled: PropTypes.bool,
}

export default Search
