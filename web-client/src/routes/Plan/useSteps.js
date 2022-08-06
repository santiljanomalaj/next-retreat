import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { parseQuery, stringifyQuery } from './urlHelpers'

const decode = (search) =>
  Object.fromEntries(
    Object.entries(parseQuery(search)).map(([key, value]) => [
      key,
      JSON.parse(value),
    ])
  )

const encode = (data) =>
  stringifyQuery(
    Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value && JSON.stringify(value),
      ])
    )
  )

export const useSteps = () => {
  const history = useHistory()
  const { pathname, search } = useLocation()
  const parsedSearch = React.useMemo(() => decode(search), [search])

  const getNextSearch = (fn) => (nextSteps, { overwrite, replace } = {}) =>
    fn(
      `?${encode({
        ...(overwrite ? {} : parsedSearch),
        ...(typeof nextSteps === 'function'
          ? nextSteps(parsedSearch)
          : nextSteps),
      })}`,
      replace
    )

  const setNextSteps = getNextSearch((nextSearch, replace) => {
    if (search !== nextSearch) {
      history[replace ? 'replace' : 'push'](`${pathname}${nextSearch}`)
    }
  })

  const getNextUrl = getNextSearch((nextSearch) => `${pathname}${nextSearch}`)

  return { stepData: parsedSearch, updateStepData: setNextSteps, getNextUrl }
}
