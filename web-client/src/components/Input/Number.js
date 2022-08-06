import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { space } from 'styled-system'
import { rem } from 'polished'
import { fontSizes, COLORS, BOXSHADOWS, theme } from 'Theme'
import { Flex } from 'components/atoms/Layout'
import { InputBase } from './Input'

const IconMinus = ({ isDisabled }) => (
  <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
    <rect
      y=".375"
      width="8"
      height="1.25"
      rx=".625"
      fill={isDisabled ? COLORS.IRRADIANT_IRIS : COLORS.BLUEBERRY_SODA}
    />
  </svg>
)

IconMinus.propTypes = {
  isDisabled: PropTypes.bool,
}

const IconPlus = ({ isDisabled }) => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <path
      d="M7.333 3.333H4.667V.667a.667.667 0 00-1.334 0v2.666H.667a.667.667 0 000 1.334h2.666v2.666a.667.667 0 001.334 0V4.667h2.666a.667.667 0 000-1.334z"
      fill={isDisabled ? COLORS.IRRADIANT_IRIS : COLORS.BLUEBERRY_SODA}
    />
  </svg>
)

IconPlus.propTypes = {
  isDisabled: PropTypes.bool,
}

const NUMERICAL_REGEX = /^-?[1-9]\d*$/
const INCREMENT = 'increment'
const DECREMENT = 'decrement'
const SIZE = rem(27)

const buttonStyle = `
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${SIZE};
  width: ${SIZE};
  border: 0.5px solid ${COLORS.IRRADIANT_IRIS};
  border-left-style: none;
  box-shadow: ${BOXSHADOWS.DARK};
  background-color: ${COLORS.WHITE};
`

const StyledInputBase = styled(InputBase)`
  font-size: ${fontSizes.xxxl};
  text-align: center;
  border-top-left-radius: ${theme.radius.m};
  border-bottom-left-radius: ${theme.radius.m};
  width: ${rem(58)};
  height: ${rem(54)};
  ${({ isBlock }) => isBlock && `width: calc(100% - ${SIZE});`};
  ${space}
`

const ButtonPlus = styled('button')`
  ${buttonStyle}
  ${({ isDisabled }) =>
    isDisabled && `cursor: not-allowed;`}
  border-bottom-width: 0;
  border-top-right-radius: ${theme.radius.m};
`

const ButtonMinus = styled('button')`
  ${buttonStyle}
  ${({ isDisabled }) => isDisabled && `cursor: not-allowed;`}
  border-bottom-right-radius: ${theme.radius.m};
`

const NumberInput = ({
  max,
  min,
  value,
  isBlock,
  onChange,
  isDisabled,
  ...inputProps
}) => {
  const isMin = min === 0 || Boolean(min)
  const isMax = max === 0 || Boolean(max)
  const isPlusDisabled = (isMax && Number(value) >= max) || isDisabled
  const isMinusDisabled = (isMin && Number(value) <= min) || isDisabled

  const handleInputChange = ({ target }) => {
    if (!NUMERICAL_REGEX.test(target.value) && target.value !== '') {
      return
    }
    const numberValue = Number(target.value)
    if (isMax && numberValue > max) {
      return
    }
    if (isMin && numberValue < min) {
      return
    }
    onChange(numberValue)
  }

  const handleButtonClick = (action) => {
    if (isMinusDisabled && action === DECREMENT) {
      return
    }
    if (isPlusDisabled && action === INCREMENT) {
      return
    }
    if (!isDisabled) {
      onChange(Number(value) + (action === INCREMENT ? 1 : -1))
    }
  }

  return (
    <Flex>
      <StyledInputBase
        onChange={handleInputChange}
        value={value}
        disabled={isDisabled}
        isBlock={isBlock}
        {...inputProps}
      />
      <div>
        <ButtonPlus
          onClick={() => handleButtonClick(INCREMENT)}
          isDisabled={isPlusDisabled}
          type="button"
        >
          <IconPlus isDisabled={isPlusDisabled} />
        </ButtonPlus>
        <ButtonMinus
          onClick={() => handleButtonClick(DECREMENT)}
          isDisabled={isMinusDisabled}
          type="button"
        >
          <IconMinus isDisabled={isMinusDisabled} />
        </ButtonMinus>
      </div>
    </Flex>
  )
}

NumberInput.propTypes = {
  max: PropTypes.number,
  min: PropTypes.number,
  isBlock: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default NumberInput
