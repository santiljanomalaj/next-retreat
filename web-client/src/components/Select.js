import React from 'react'
import PropTypes from 'prop-types'
import ReactSelect, { components } from 'react-select'
import { COLORS, radius, BOXSHADOWS, fontSizes } from 'Theme'
import { ReactComponent as ArrowIconActive } from 'assets/images/svg/select-arrow-active.svg'
import { ReactComponent as ArrowIconInactive } from 'assets/images/svg/select-arrow-inactive.svg'

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
  control: (styles, { isDisabled, isFocused, selectProps: { isInvalid } }) => ({
    ...styles,
    boxShadow: isDisabled ? null : BOXSHADOWS.DARK,
    border: `1px solid ${
      /* prettier-ignore */
      // eslint-disable-next-line no-nested-ternary
      isDisabled
        ? COLORS.IRRADIANT_IRIS
        : isInvalid
          ? COLORS.SPARKLING_RED
          : COLORS.SILK_SOX
    }`,
    backgroundColor:
      /* prettier-ignore */
      // eslint-disable-next-line no-nested-ternary
      isDisabled || isFocused
        ? COLORS.LYNX_WHITE
        : isInvalid
          ? COLORS.SEFID_WHITE
          : COLORS.WHITE,
    '&:hover': {
      border: `1px solid ${COLORS.CHUN_LI_BLUE}`,
    },
    cursor: isDisabled ? 'not-allowed' : 'pointer',
  }),
  placeholder: (styles, { isDisabled }) => ({
    ...styles,
    fontSize: fontSizes.m,
    color: isDisabled ? COLORS.BLUEBERRY_SODA : COLORS.SILK_SOX,
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
    color: isDisabled ? COLORS.SPARKLING_RED : data.color,
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
  isInvalid,
  placeholder,
  options,
  handleInputChange,
  onBlur,
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
    isInvalid={isInvalid}
    onBlur={onBlur}
  />
)

Select.propTypes = {
  isDisabled: PropTypes.bool,
  isInvalid: PropTypes.bool,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.shape({
    value: PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    label: PropTypes.string.isRequired,
  }),
  handleInputChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
}

export default Select
