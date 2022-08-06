import React from 'react'
import PropTypes from 'prop-types'
import ReactSelect, { components } from 'react-select'
import { COLORS, radius, BOXSHADOWS, fontSizes } from 'Theme'
import ArrowIconActive from 'images/svg/select-arrow-active.inline.svg'
import ArrowIconInactive from 'images/svg/select-arrow-inactive.inline.svg'

const ArrowActive = (props) => (
  <components.DropdownIndicator {...props}>
    <ArrowIconActive />
  </components.DropdownIndicator>
)
const ArrowInactive = (props) => (
  <components.DropdownIndicator {...props}>
    <ArrowIconInactive />
  </components.DropdownIndicator>
)

const customStyles = {
  control: (styles, { isDisabled, isFocused }) => ({
    ...styles,
    boxShadow: isDisabled ? null : BOXSHADOWS.DARK,
    border: `1px solid ${isDisabled ? COLORS.IRRADIANT_IRIS : COLORS.SILK_SOX}`,
    backgroundColor: isDisabled || isFocused ? COLORS.LYNX_WHITE : COLORS.WHITE,
    '&:hover': {
      border: `1px solid ${COLORS.CHUN_LI_BLUE}`,
    },
    cursor: isDisabled ? 'not-allowed' : 'pointer',
  }),
  placeholder: (styles, { isDisabled }) => ({
    ...styles,
    fontSize: fontSizes.m,
    color: isDisabled ? COLORS.BLUEBERRY_SODA : COLORS.SPACE_CADET,
  }),
  menu: (styles) => ({
    ...styles,
    borderRadius: radius.m,
    color: COLORS.SPACE_CADET,
    boxShadow: BOXSHADOWS.CARD,
  }),
  option: (styles, { data, isDisabled, isFocused }) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    color: isDisabled ? COLORS.BLUEBERRY_SODA : data.color,
    backgroundColor: isFocused ? COLORS.IRRADIANT_IRIS : COLORS.WHITE,
    ':active': {
      ...styles[':active'],
      backgroundColor: !isDisabled && COLORS.IRRADIANT_IRIS,
    },
  }),
  singleValue: (styles, { isDisabled }) => ({
    ...styles,
    width: '100%',
    fontSize: fontSizes.m,
    color: isDisabled ? COLORS.BLUEBERRY_SODA : COLORS.SPACE_CADET,
  }),
  indicatorSeparator: () => null,
}

const Select = ({
  isDisabled,
  placeholder,
  options,
  handleInputChange,
  value,
}) => (
  <ReactSelect
    value={value}
    options={options}
    onChange={handleInputChange}
    styles={customStyles}
    components={{
      DropdownIndicator: isDisabled ? ArrowInactive : ArrowActive,
    }}
    placeholder={placeholder || 'Select'}
    isDisabled={isDisabled}
  />
)

Select.propTypes = {
  isDisabled: PropTypes.bool,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  handleInputChange: PropTypes.func.isRequired,
}

export default Select
