import React from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery, gql } from '@apollo/client'
import { useSteps } from 'routes/Plan/useSteps'

const DEFAULT_COUNTRY = {
  country: null,
  countryCode: null,
  isSameOrigin: null,
}

const DEFAULT_IS_DOMESTIC_DESTINATION = true

const GET_ORIGIN_COUNTRIES = gql`
  query OriginCountries($filter: OriginLocationsInput!) {
    originLocations(filter: $filter) {
      country
      countryCode
    }
  }
`

const GET_DESTINATION = gql`
  query Destination($input: DestinationInput!) {
    destination(input: $input) {
      id
      countryCode
    }
  }
`

export const DomesticTravelContext = React.createContext({
  ...DEFAULT_COUNTRY,
  isDomesticDestination: DEFAULT_IS_DOMESTIC_DESTINATION,
})

const DomesticTravelProvider = ({ children }) => {
  const { stepData } = useSteps()
  const [domesticTravelCountry, setDomesticTravelCountry] = React.useState(
    DEFAULT_COUNTRY
  )
  const [isDomesticDestination, setIsDomesticDestination] = React.useState(
    DEFAULT_IS_DOMESTIC_DESTINATION
  )

  const [getOriginCountries] = useLazyQuery(GET_ORIGIN_COUNTRIES, {
    onCompleted: ({ originLocations }) => {
      setDomesticTravelCountry(
        originLocations.every(
          ({ countryCode }, _, locations) =>
            countryCode === locations[0].countryCode
        )
          ? { ...originLocations[0], isSameOrigin: true }
          : { ...DEFAULT_COUNTRY, isSameOrigin: false }
      )
    },
  })

  const [getDestination] = useLazyQuery(GET_DESTINATION, {
    onCompleted: ({ destination }) => {
      setIsDomesticDestination(
        domesticTravelCountry.countryCode === destination.countryCode
      )
    },
  })

  React.useEffect(() => {
    if (stepData.originLocations) {
      getOriginCountries({
        variables: {
          filter: {
            ids: stepData.originLocations.map(({ id }) => id),
            selectedOriginLocations: [], // Has to be here because of BE bug
          },
        },
      })
    }
  }, [stepData.originLocations, getOriginCountries])

  React.useEffect(() => {
    if (stepData.originLocations && stepData.destination && stepData.venue) {
      getDestination({
        variables: {
          input: {
            id: stepData.destination.id,
            originLocations: stepData.originLocations.map(({ id }) => id),
          },
        },
      })
    }
  }, [
    stepData.originLocations,
    stepData.destination,
    stepData.venue,
    getDestination,
  ])

  return (
    <DomesticTravelContext.Provider
      value={{ ...domesticTravelCountry, isDomesticDestination }}
    >
      {children}
    </DomesticTravelContext.Provider>
  )
}

DomesticTravelProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DomesticTravelProvider
