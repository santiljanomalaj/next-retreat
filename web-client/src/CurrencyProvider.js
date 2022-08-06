import React from 'react'
import PropTypes from 'prop-types'
import { useQuery, gql } from '@apollo/client'
import {
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_CURRENCY_ISO_CODE,
  ENABLED_CURRENCIES,
  LOCAL_STORAGE_CURRENCY_KEY,
} from 'constants/constants'

const NOOP = () => {}

const GET_CURRENCIES = gql`
  query Currencies {
    currencies {
      isoCode
      symbol
    }
  }
`

export const CurrencyContext = React.createContext({
  currency: DEFAULT_CURRENCY_ISO_CODE,
  currencies: [DEFAULT_CURRENCY_ISO_CODE],
  setCurrency: NOOP,
  getCurrencySymbol: NOOP,
})

const CurrencyProvider = ({ children }) => {
  const { data } = useQuery(GET_CURRENCIES)
  const currencies = data?.currencies
    .filter(({ isoCode }) => ENABLED_CURRENCIES.includes(isoCode))
    .map(({ isoCode }) => isoCode) ?? [DEFAULT_CURRENCY_ISO_CODE]

  const [currency, setCurrency] = React.useState(() => {
    try {
      const localStorageValue = localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY)
      if (localStorageValue !== null) {
        return localStorageValue
      }
      localStorage.setItem(
        LOCAL_STORAGE_CURRENCY_KEY,
        DEFAULT_CURRENCY_ISO_CODE
      )
      return DEFAULT_CURRENCY_ISO_CODE
    } catch {
      return DEFAULT_CURRENCY_ISO_CODE
    }
  })

  const getCurrencySymbol = (isoCode) =>
    data?.currencies.find(
      (currencyObject) => currencyObject.isoCode === isoCode
    )?.symbol ?? DEFAULT_CURRENCY_SYMBOL

  React.useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CURRENCY_KEY, currency)
    } catch {
      // do nothing
    }
  }, [currency])

  return (
    <CurrencyContext.Provider
      value={{ currency, currencies, setCurrency, getCurrencySymbol }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

CurrencyProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default CurrencyProvider
