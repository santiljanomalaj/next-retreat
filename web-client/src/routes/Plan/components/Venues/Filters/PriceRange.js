import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { rem } from 'polished'
import { fontSizes, mq, COLORS } from 'Theme'
import RangeSlider from 'components/RangeSlider'
import Input from 'components/Input'
import { Box, Flex } from 'components/atoms/Layout'
import { Label, Text } from 'components/atoms/Typography'
import { clamp } from 'utils/helpers'
import { formatPrice } from 'utils/money'
import Filter from 'sharedComponents/Filter'

const CURRENCY_FONT_SIZE = fontSizes.m
const SYMBOL_POSITION = {
  BEFORE: 'before',
  AFTER: 'after',
}

const getSymbolPosition = (symbol) =>
  ({
    '€': SYMBOL_POSITION.BEFORE,
    $: SYMBOL_POSITION.BEFORE,
    '£': SYMBOL_POSITION.BEFORE,
  }[symbol])

const CurrencySymbol = styled('span')`
  position: absolute;

  height: ${CURRENCY_FONT_SIZE};
  line-height: 1;

  font-size: ${CURRENCY_FONT_SIZE};
  white-space: nowrap;

  color: transparent;

  &::before {
    content: '${({ symbol }) => symbol}';
    position: absolute;

    margin: 0 0.08em;

    color: ${COLORS.SPACE_CADET};

    ${({ symbolPosition }) =>
      symbolPosition === SYMBOL_POSITION.BEFORE
        ? `right: 100%;`
        : `left: 100%;`}
  }
`

const InputWrapper = styled('div')`
  pointer-events: none;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  &:focus-within ${CurrencySymbol} {
    visibility: hidden;
  }
`

const StyledInput = styled(Input)`
  pointer-events: initial;

  max-width: ${rem('102px')};

  text-align: center;
  text-indent: 0;

  ${mq.to.tablet`
    max-width: none;
  `}
`

const PriceInput = ({ value, currencySymbol, ...props }) => (
  <InputWrapper>
    <CurrencySymbol
      symbol={currencySymbol}
      symbolPosition={getSymbolPosition(currencySymbol)}
    >
      {value}
    </CurrencySymbol>
    <StyledInput type="number" value={value} {...props} />
  </InputWrapper>
)

PriceInput.defaultProps = {
  currencySymbol: '€',
}

PriceInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  currencySymbol: PropTypes.string,
}

const PriceRange = ({
  minPriceLimit,
  maxPriceLimit,
  minPrice = minPriceLimit,
  maxPrice = maxPriceLimit,
  getCurrencySymbol,
  currencyIsoCode,
  setUrlFilters,
}) => {
  const [currentMinPrice, setMinPrice] = React.useState(minPrice)
  const [currentMaxPrice, setMaxPrice] = React.useState(maxPrice)
  const [inputMinPrice, setInputMinPrice] = React.useState(currentMinPrice)
  const [inputMaxPrice, setInputMaxPrice] = React.useState(currentMaxPrice)

  const limitNextMinPrice = clamp(minPriceLimit, currentMaxPrice)
  const limitNextMaxPrice = clamp(currentMinPrice, maxPriceLimit)
  const filterValues = [minPrice === minPriceLimit, maxPrice === maxPriceLimit]
  const isStateDefault =
    filterValues.length - filterValues.filter(Boolean).length === 0
  const currencySymbol = getCurrencySymbol(currencyIsoCode)

  return (
    <Filter
      label={
        isStateDefault
          ? 'Price range'
          : `${formatPrice({
              value: minPrice,
              currencyIsoCode,
              showCents: false,
            })} - ${formatPrice({
              value: maxPrice,
              currencyIsoCode,
              showCents: false,
            })}`
      }
      isChanged={!isStateDefault}
      onCancel={() => {
        setInputMinPrice(minPrice)
        setInputMaxPrice(maxPrice)
        setMinPrice(minPrice)
        setMaxPrice(maxPrice)
      }}
      onClear={() => {
        setInputMinPrice(minPriceLimit)
        setInputMaxPrice(maxPriceLimit)
        setMinPrice(minPriceLimit)
        setMaxPrice(maxPriceLimit)
      }}
      onApply={() => {
        setInputMinPrice(currentMinPrice)
        setInputMaxPrice(currentMaxPrice)
        setUrlFilters({
          priceRange: [currentMinPrice, currentMaxPrice],
          page: 1,
        })
      }}
    >
      <RangeSlider
        value={[currentMinPrice, currentMaxPrice]}
        min={minPriceLimit}
        max={maxPriceLimit}
        onChange={([min, max]) => {
          setMinPrice(min)
          setMaxPrice(max)
          setInputMinPrice(min)
          setInputMaxPrice(max)
        }}
        mt="s"
        mb="m"
      />
      <Box my="s">
        <Flex mb="s" justifyContent="space-between">
          <Label>MIN (room/night)</Label>
          <Label>MAX (room/night)</Label>
        </Flex>
        <Flex alignItems="center">
          <PriceInput
            value={inputMinPrice}
            currencySymbol={currencySymbol}
            onChange={({ target: { value } }) => {
              setInputMinPrice(value)
            }}
            onBlur={() => {
              const nextMinPrice = limitNextMinPrice(Number(inputMinPrice))
              setMinPrice(nextMinPrice)
              setInputMinPrice(nextMinPrice)
            }}
          />
          <Text
            mx="s"
            color={COLORS.BLUEBERRY_SODA}
            css={`
              user-select: none;
            `}
          >
            –
          </Text>
          <PriceInput
            value={inputMaxPrice}
            currencySymbol={currencySymbol}
            onChange={({ target: { value } }) => {
              setInputMaxPrice(value)
            }}
            onBlur={() => {
              const nextMaxPrice = limitNextMaxPrice(Number(inputMaxPrice))
              setMaxPrice(nextMaxPrice)
              setInputMaxPrice(nextMaxPrice)
            }}
          />
        </Flex>
      </Box>
    </Filter>
  )
}

PriceRange.defaultProps = {
  minPriceLimit: 0,
  maxPriceLimit: 1000,
}

PriceRange.propTypes = {
  minPriceLimit: PropTypes.number,
  maxPriceLimit: PropTypes.number,
  minPrice: PropTypes.number,
  maxPrice: PropTypes.number,
  currencyIsoCode: PropTypes.string,
  setUrlFilters: PropTypes.func.isRequired,
  getCurrencySymbol: PropTypes.func.isRequired,
}

export default PriceRange
