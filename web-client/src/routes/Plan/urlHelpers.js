import queryString from 'query-string'
import { STEP_ORDER } from './constants'

const queryStringOptions = {
  arrayFormat: 'index',
  sort: (a, b) => STEP_ORDER.indexOf(a) - STEP_ORDER.indexOf(b),
}

const sanitizeData = (data) =>
  Object.fromEntries(
    Object.entries(data).filter(([key]) => STEP_ORDER.includes(key))
  )

export const stringifyQuery = (data) =>
  queryString.stringify(data, queryStringOptions)

export const parseQuery = (url) =>
  sanitizeData(queryString.parse(url, queryStringOptions))
