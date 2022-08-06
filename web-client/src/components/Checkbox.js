import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { fontSizes, radius, space, BOXSHADOWS, COLORS } from 'Theme'
import {
  defaultStyle,
  hoverStyle,
  activeStyle,
  disabledStyle,
} from 'components/mixins'
import { ReactComponent as CheckmarkIcon } from 'assets/images/svg/checkmark.svg'

const CHECKBOX_SIZE = rem('20px')
const ICON_SIZE = rem('12px')

const CheckBoxWrapper = styled('span')`
  ${defaultStyle}

  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;

  height: ${CHECKBOX_SIZE};
  width: ${CHECKBOX_SIZE};

  border-radius: ${radius.m};
  border-color: ${COLORS.IRRADIANT_IRIS};
  box-shadow: ${BOXSHADOWS.INNER};

  ${({ isInvalid }) =>
    isInvalid &&
    `
    background-color: ${COLORS.SEFID_WHITE};
    border: 0.5px solid ${COLORS.SPARKLING_RED};
  `}
`

/* prettier-ignore */
const Wrapper = styled('label')`
  cursor: pointer;
  user-select: none;

  display: inline-flex;
  align-items: center;
  vertical-align: top;

  font-size: ${fontSizes.m};
  line-height: 1.2;

  color: ${COLORS.SPACE_CADET};

  @media (hover: hover) {
    &:hover ${CheckBoxWrapper} {
      ${hoverStyle}
    }
  }

  &:active ${CheckBoxWrapper} {
    ${activeStyle}
  }

  ${({ isDisabled }) => isDisabled && `
    cursor: default;

    color: ${COLORS.BLUEBERRY_SODA};

    ${CheckBoxWrapper} {
      ${disabledStyle}
    }
  `}

  input {
    display: none;
  }
`

const Label = styled('div')`
  display: flex;

  padding: 0 ${space.s};
`

const CheckMark = styled(CheckmarkIcon)`
  flex: none;
  width: ${ICON_SIZE};

  fill: ${({ isDisabled }) =>
    isDisabled ? COLORS.BLUEBERRY_SODA : COLORS.CHUN_LI_BLUE} !important;
`

const Checkbox = ({
  className,
  children,
  onChange,
  isChecked,
  isDisabled,
  isInvalid,
  value,
  dataTour
}) => (
  <Wrapper className={className} isDisabled={isDisabled}>
    <input
      type="checkbox"
      checked={isChecked}
      disabled={isDisabled}
      onChange={() => onChange(value)}
    />
    <CheckBoxWrapper isInvalid={isInvalid} data-tour={dataTour}>
      {isChecked && <CheckMark isDisabled={isDisabled} />}
    </CheckBoxWrapper>
    <Label>{children}</Label>
  </Wrapper>
)

Checkbox.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func, // Optional because of https://github.com/facebook/react/issues/4494
  isChecked: PropTypes.bool,
  isInvalid: PropTypes.bool,
  isDisabled: PropTypes.bool,
  dataTour: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]),
}

export default Checkbox
