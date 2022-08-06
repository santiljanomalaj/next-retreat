import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { CurrencyContext } from 'CurrencyProvider'
import { fontSizes, fontWeights, space, COLORS, mq } from 'Theme'
import Button from 'components/atoms/Button'
import { Text } from 'components/atoms/Typography'
import RadioGroup from 'components/RadioGroup'
import Media, { queries } from 'components/Media'
import { ReactComponent as ArrowheadIcon } from 'assets/images/svg/arrowhead.svg'
import Filter, { PADDING } from 'sharedComponents/Filter'
import { TOPBAR_HEIGHT } from 'constants/style'

const Icon = styled(ArrowheadIcon)`
  width: ${rem('12px')};
  margin-left: ${space.xs};

  color: ${COLORS.BROTHER_BLUE};
`

const StyledButton = styled(Button.Tertiary)`
  justify-content: flex-end;

  min-width: ${rem('50px')};
  height: ${TOPBAR_HEIGHT};
  margin-left: auto;
  ${mq.from.tablet`
      margin-left: ${space.s};
  `}
`

const StyledOption = styled(RadioGroup.Option)`
  cursor: pointer;
  z-index: 0;
  position: relative;
  display: block;

  font-size: ${fontSizes.m};
  line-height: ${rem('34px')};
  white-space: nowrap;

  &::after {
    ${({ checked }) => checked && `content: '';`}

    z-index: -1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: -${PADDING};
    right: -${PADDING};

    background-color: ${COLORS.IRRADIANT_IRIS};
  }

  input {
    display: none;
  }
`

const CurrencySymbol = styled('span')`
  display: inline-block;

  width: ${rem('40px')};

  font-weight: ${fontWeights.bold};
`

const CurrencyLine = ({ code, symbol }) => (
  <>
    <CurrencySymbol>{symbol}</CurrencySymbol>
    <span>{code}</span>
  </>
)

CurrencyLine.propTypes = {
  code: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
}

const Currency = ({ innerLabel }) => {
  const {
    currency,
    currencies,
    setCurrency,
    getCurrencySymbol,
  } = React.useContext(CurrencyContext)

  return (
    <Media queries={queries}>
      {(matches) => (
        <Filter
          value={currency}
          targetComp={StyledButton}
          label={
            <>
              <Text color={COLORS.SPACE_CADET}>
                {getCurrencySymbol(currency)}
              </Text>
              <Icon />
            </>
          }
          modalLabel={innerLabel}
          hasFooter={false}
        >
          {!matches.mobile && innerLabel && (
            <Text
              display="block"
              mb="s"
              fontSize="s"
              color={COLORS.DEEP_RESERVOIR}
            >
              {innerLabel}
            </Text>
          )}
          <RadioGroup
            selectedValue={currency}
            onSelect={(value) => {
              setCurrency(value)
            }}
            isUnstyled
          >
            {currencies.map((currencyCode) => (
              <StyledOption
                key={currencyCode}
                value={currencyCode}
                label={
                  <CurrencyLine
                    code={currencyCode}
                    symbol={getCurrencySymbol(currencyCode)}
                  />
                }
              />
            ))}
          </RadioGroup>
        </Filter>
      )}
    </Media>
  )
}

Currency.propTypes = {
  innerLabel: PropTypes.string,
}

export default Currency
