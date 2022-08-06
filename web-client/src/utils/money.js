import { DEFAULT_CURRENCY_ISO_CODE } from 'constants/constants'

const createFormatter = ({
  currencyIsoCode = DEFAULT_CURRENCY_ISO_CODE,
  showCents = true,
}) =>
  new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: currencyIsoCode,
    minimumFractionDigits: showCents ? undefined : 0,
  })

export const formatPrice = ({ value, currencyIsoCode, showCents }) =>
  createFormatter({ currencyIsoCode, showCents }).format(value)
