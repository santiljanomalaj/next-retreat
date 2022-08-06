import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { fontSizes, radius, space, BORDER_WIDTH, COLORS } from 'Theme'
import {
  defaultStyle,
  hoverStyle,
  activeStyle,
  disabledStyle,
} from 'components/mixins'

const RADIO_HEIGHT = rem('40px')
const CIRCLE_RADIO_SIZE = 20

const StyledOption = styled('label')`
  ${defaultStyle}

  cursor: pointer;
  user-select: none;
  overflow: hidden;
  display: inline-block;

  flex: 1;

  min-width: ${rem('74px')};
  line-height: ${RADIO_HEIGHT};
  padding: 0 ${space.m};

  text-overflow: ellipsis;
  text-align: center;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover {
      ${hoverStyle}
    }
  }

  &:first-child {
    border-radius: ${radius.m} 0 0 ${radius.m};
  }

  &:last-child {
    border-radius: 0 ${radius.m} ${radius.m} 0;
  }

  &:not(:last-child) {
    margin-right: -${BORDER_WIDTH};
  }

  ${({ isActive }) => isActive && activeStyle}
  ${({ isDisabled }) => isDisabled && disabledStyle}

  input {
    display: none;
  }

  ${({ isInvalid }) =>
    isInvalid &&
    `
    background-color: ${COLORS.SEFID_WHITE};
    border: 0.5px solid ${COLORS.SPARKLING_RED};
  `}
`

const StyledRadioControl = styled.span`
  ${defaultStyle}
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${rem(CIRCLE_RADIO_SIZE)};
  height: ${rem(CIRCLE_RADIO_SIZE)};
  border-radius: 50%;
  margin-right: ${space.s};

  input + &::before {
    content: '';
    width: ${rem(CIRCLE_RADIO_SIZE / 2)};
    height: ${rem(CIRCLE_RADIO_SIZE / 2)};
    background-color: ${COLORS.CHUN_LI_BLUE};
    border-radius: 50%;
    display: inline-block;
    transition: 180ms transform ease-in-out;
    transform: scale(0);
  }

  input:disabled + &::before {
    background-color: ${COLORS.BLUEBERRY_SODA};
  }

  input:checked + &::before {
    transform: scale(1);
  }
`

const StyledRadioLabel = styled.label`
  display: flex;
  align-items: center;
  color: ${COLORS.SPACE_CADET};

  input {
    display: none;
  }

  @media (hover: hover) {
    &:hover ${StyledRadioControl} {
      ${hoverStyle}
    }
  }

  &:active ${StyledRadioControl} {
    ${activeStyle}
  }

  ${({ isDisabled }) =>
    isDisabled &&
    `
    cursor: default;
    color: ${COLORS.BLUEBERRY_SODA};

    ${StyledRadioControl} {
      ${disabledStyle}
    }
  `}

  ${({ isInvalid }) =>
    isInvalid &&
    `
    ${StyledRadioControl} {
      background-color: ${COLORS.SEFID_WHITE};
      border: 0.5px solid ${COLORS.SPARKLING_RED};
    }
  `}
`

const CircleOption = ({
  className,
  checked,
  disabled,
  label,
  onSelect,
  value,
  isInvalid,
}) => (
  <StyledRadioLabel
    className={className}
    isActive={checked}
    isDisabled={disabled}
    isInvalid={isInvalid}
  >
    <input
      type="radio"
      checked={checked}
      disabled={disabled}
      onChange={() => onSelect(value)}
    />
    <StyledRadioControl />
    {label}
  </StyledRadioLabel>
)

CircleOption.propTypes = {
  className: PropTypes.string,
  onSelect: PropTypes.func,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  label: PropTypes.node.isRequired,
  isInvalid: PropTypes.bool,
}

const Option = ({
  className,
  checked,
  disabled,
  label,
  onSelect,
  value,
  isUnstyled,
  isInvalid,
}) => {
  const Element = isUnstyled ? 'label' : StyledOption

  return (
    <Element
      className={className}
      isActive={checked}
      isDisabled={disabled}
      isInvalid={isInvalid}
    >
      <input
        type="radio"
        checked={checked}
        disabled={disabled}
        onChange={() => onSelect(value)}
      />
      {label}
    </Element>
  )
}

Option.propTypes = {
  className: PropTypes.string,
  onSelect: PropTypes.func,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  label: PropTypes.node.isRequired,
  isUnstyled: PropTypes.bool,
  isInvalid: PropTypes.bool,
}

const Wrapper = styled('div')`
  display: flex;

  font-size: ${fontSizes.m};
`

const RadioGroup = ({
  children,
  selectedValue,
  onSelect,
  isUnstyled,
  ...props
}) => {
  const optionsWithRadioProps = React.Children.map(children, (child) =>
    React.cloneElement(child, {
      checked: child.props.value === selectedValue,
      onSelect,
      isUnstyled,
    })
  )
  const Element = isUnstyled ? 'div' : Wrapper

  return <Element {...props}>{optionsWithRadioProps}</Element>
}

RadioGroup.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
  selectedValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]),
  onSelect: PropTypes.func.isRequired,
  isUnstyled: PropTypes.bool,
}

RadioGroup.Option = Option
RadioGroup.CircleOption = CircleOption

export default RadioGroup
