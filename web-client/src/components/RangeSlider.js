import React from 'react'
import styled from 'styled-components'
import { space } from 'styled-system'
import { math, rem } from 'polished'
import { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'
import { COLORS } from 'Theme'
import { defaultStyle, hoverStyle, activeStyle } from 'components/mixins'
import draggableIcon from 'assets/images/svg/draggable.svg'

const HANDLE_SIZE = rem('22px')

const RangeSlider = styled((props) => <Range {...props} />)`
  &.rc-slider {
    display: flex;
    align-items: center;

    width: calc(100% - ${HANDLE_SIZE});
    height: ${HANDLE_SIZE};
    margin-left: auto;
    margin-right: auto;

    ${space}
  }

  .rc-slider-rail,
  .rc-slider-track {
    height: 1px;
  }

  .rc-slider-rail {
    left: ${math(`${HANDLE_SIZE} / -2`)};

    width: calc(100% + ${HANDLE_SIZE});

    background-color: ${COLORS.IRRADIANT_IRIS};
  }

  .rc-slider-track {
    background-color: transparent;
  }

  .rc-slider-handle {
    height: ${HANDLE_SIZE};
    width: ${HANDLE_SIZE};
    margin-top: 0;

    background: url("${draggableIcon}") no-repeat center;
    background-size: ${rem('8px')};

    &,
    &:focus {
      ${defaultStyle}
    }

    @media (hover: hover) {
      &:hover {
        ${hoverStyle}
      }
    }

    &:active,
    &.rc-slider-handle-dragging {
      ${activeStyle}
    }
  }
`

export default RangeSlider
