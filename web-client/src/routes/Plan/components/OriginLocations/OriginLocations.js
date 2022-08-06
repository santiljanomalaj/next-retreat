import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { useLazyQuery, gql } from '@apollo/client'
import { mq, space, BOXSHADOWS, COLORS } from 'Theme'
import { useDebouncedCallback } from 'use-debounce'
import { Box, Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Button from 'components/atoms/Button'
import Tooltip from 'components/molecules/Tooltip'
import Checkbox from 'components/Checkbox'
import Media from 'components/Media'
import Stepper from 'components/Stepper'
import { TOPBAR_HEIGHT } from 'constants/style'
import { sum } from 'utils/helpers'
import Layout, { LIST_PADDING } from 'sharedComponents/Layout'
import LocationsInput from './LocationsInput'
import LocationsTable from './LocationsTable'
import Map from './Map'
import { STEP_NAMES } from '../../constants'
import {
  useGoogleTracking,
  GTM_EVENTS,
} from '../../../../hooks/useGoogleTracking'

const ERROR_MESSAGES = {
  ValidationError: 'Please pick origin locations from the list',
}

const GET_LOCATION_SUGGESTIONS = gql`
  query SearchLocations($filter: SearchLocationsInput!) {
    searchLocations(filter: $filter) {
      title
      type
      suggestions {
        id
        name
        country
        type
        coordinates {
          lat
          lon
        }
      }
    }
  }
`

const GET_ORIGIN_LOCATIONS = gql`
  query OriginLocations($filter: OriginLocationsInput!) {
    originLocations(filter: $filter) {
      id
      name
      country
      coordinates {
        lat
        lon
      }
    }
  }
`

const VALIDATE_ORIGIN_LOCATIONS = gql`
  query ValidateOriginLocations($locations: [String]!) {
    validateOriginLocations(locations: $locations)
  }
`

const LOCATIONS_LIMIT = 40
const originMQ = mq.to.tablet

const getLocationByID = (locations, id) =>
  locations.find((location) => location.id === id)

const StyledForm = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const ContinueWrapper = styled('div')`
  ${originMQ`
    position: sticky;
    left: 0;
    bottom: 0;
    right: 0;

    height: ${rem('70px')};
    padding: ${space.m};
    margin: 0 -${LIST_PADDING} -${LIST_PADDING};

    background-color: ${COLORS.WHITE};
    box-shadow: ${BOXSHADOWS.LIGHT};
  `}
`

const StyledList = styled(Layout.List)`
  ${originMQ`
    display: flex;
    flex-direction: column;

    min-height: calc(var(--nr-100vh, 100vh) - ${TOPBAR_HEIGHT});
  `}
`

const Info = (props) => (
  <Text as="p" fontSize="s" textAlign="center" my="s" {...props} />
)

const EMPTY_ARRAY = []

const OriginLocations = ({ stepData, updateStepData }) => {
  const history = useHistory()
  const { logGTMEvent } = useGoogleTracking()
  const urlOriginLocations = stepData?.originLocations ?? EMPTY_ARRAY

  const [locationsList, setLocationsList] = React.useState(EMPTY_ARRAY)
  const [canRenderError, setCanRenderError] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const [setSearchDebounce] = useDebouncedCallback((value) => {
    setSearch(value)
  }, 200)

  const [isTeamSizeKnown, setIsTeamSizeKnown] = React.useState(
    urlOriginLocations.some(({ size }) => size > 0)
  )

  const addLocation = ({ id, size }) => {
    updateStepData(({ originLocations }) => {
      if(originLocations && originLocations.some(ol => ol.id === id)) return
      return {
        [STEP_NAMES.originLocations]: [
          { id, size },
          ...(originLocations ?? EMPTY_ARRAY),
        ],
      }
    })
  }

  const updateLocation = (index, { size }) => {
    updateStepData(({ originLocations }) => ({
      [STEP_NAMES.originLocations]: [
        ...originLocations.slice(0, index),
        { ...originLocations[index], size },
        ...originLocations.slice(index + 1),
      ],
    }))
  }

  const updateLocations = ({ size }) => {
    updateStepData(({ originLocations }) => ({
      [STEP_NAMES.originLocations]: originLocations.map((prevLocation) => ({
        ...prevLocation,
        size,
      })),
    }))
  }

  const removeLocation = (index) => {
    updateStepData(({ originLocations }) => {
      const filteredLocations = originLocations.filter(
        (_, prevIndex) => index !== prevIndex
      )
      return {
        [STEP_NAMES.originLocations]:
          filteredLocations.length === 0 ? null : filteredLocations,
      }
    })
  }

  const [getOriginLocations, { error: locationsError }] = useLazyQuery(
    GET_ORIGIN_LOCATIONS,
    {
      onCompleted: ({ originLocations }) => {
        setLocationsList(
          urlOriginLocations.map((location) => ({
            ...location,
            ...getLocationByID(originLocations, location.id),
          }))
        )
      },
    }
  )

  const [
    getLocationSuggestions,
    { error: searchError, data: searchData },
  ] = useLazyQuery(GET_LOCATION_SUGGESTIONS, {
    fetchPolicy: 'network-only',
  })

  const [validateOriginLocations, { error: validationError }] = useLazyQuery(
    VALIDATE_ORIGIN_LOCATIONS,
    {
      onCompleted: () => {
        updateStepData({ [STEP_NAMES.destination]: null })
      },
      onError: () => {
        setCanRenderError(true)
      },
    }
  )

  const searchLocations = searchData?.searchLocations ?? []
  const errors = validationError?.graphQLErrors ?? []
  const isLocationListOverLimit = locationsList.length >= LOCATIONS_LIMIT
  const isLocationListEmpty = !locationsList.length

  React.useEffect(() => {
    if (urlOriginLocations.length === 0) {
      setLocationsList(EMPTY_ARRAY)
    } else {
      getOriginLocations({
        variables: {
          filter: {
            ids: urlOriginLocations.map(({ id }) => id),
            selectedOriginLocations: [], // Has to be here because of BE bug
          },
        },
      })
    }

    setLocationsList((prevLocationsList) =>
      prevLocationsList.map((location) => ({
        ...location,
        ...getLocationByID(urlOriginLocations, location.id),
      }))
    )
  }, [urlOriginLocations, getOriginLocations])

  React.useEffect(() => {
    if (search) {
      getLocationSuggestions({
        variables: {
          filter: {
            search,
            selectedOriginLocations: locationsList.map(({ id }) => id),
          },
        },
      })
    }
  }, [search, locationsList, getLocationSuggestions])

  if (locationsError || searchError) {
    history.push('/internal-server-error')
  }

  const continueWrapper = !isLocationListEmpty && (
    <ContinueWrapper>
      <Button.Primary
      data-tour="continue-rr-destination"
        isBlock
        onClick={() => {
          logGTMEvent({
            event: GTM_EVENTS.originDestinationsSelected,
            from: locationsList.map(({ id }) => id).join(','),
          })

          validateOriginLocations({
            variables: {
              locations: locationsList
                .map(({ id }) => id)
                .slice(0, LOCATIONS_LIMIT),
            },
          })
        }}
      >
        Continue to retreat destination
      </Button.Primary>
    </ContinueWrapper>
  )

  return (
    <Media>
      {(matches) => (
        <Layout
          listContent={
            <StyledList>
              <StyledForm>
                <Stepper mb="m">
                  <Stepper.Step>
                    <Text
                      fontWeight="600"
                      fontSize="xxl"
                      mb="m"
                      lineHeight="1.2"
                    >
                      Where are your team members located?
                    </Text>
                  </Stepper.Step>
                </Stepper>
                <LocationsInput
                  placeholder="Add origin team locations or preferred departure points"
                  isDisabled={isLocationListOverLimit}
                  onFocus={() => {
                    setCanRenderError(false)
                  }}
                  suggestions={searchLocations}
                  onSuggestionsFetchRequested={({ value: inputValue }) => {
                    setSearchDebounce(inputValue)
                  }}
                  onSuggestionSelected={(location) => {
                    addLocation({ ...location, size: isTeamSizeKnown ? 1 : 0 })
                    setSearchDebounce('')
                  }}
                />
                {!isLocationListEmpty && (
                  <Box mt="m">
                    <Checkbox
                      dataTour={"exact-team-input"}
                      isChecked={isTeamSizeKnown}
                      onChange={() => {
                        const nextTeamSizeKnown = !isTeamSizeKnown
                        setIsTeamSizeKnown(
                          (prevIsTeamSizeKnown) => !prevIsTeamSizeKnown
                        )
                        updateLocations({ size: nextTeamSizeKnown ? 1 : 0 })
                      }}
                    >
                      <Flex>
                        <Text mr="s">I know the exact number of people</Text>
                        <Tooltip
                          text="If you already have information about the number of attending team members, you can add a final or approx. number for each location, to refine the results."
                          position={matches.mobile ? 'LEFT' : undefined}
                        />
                      </Flex>
                    </Checkbox>
                  </Box>
                )}
                {!isLocationListEmpty && (
                  <Box mt="l" mb="m">
                    <LocationsTable
                      locationsList={locationsList}
                      updateLocation={updateLocation}
                      removeLocation={removeLocation}
                      isTeamSizeKnown={isTeamSizeKnown}
                    />
                  </Box>
                )}
                {!matches.mobile && continueWrapper}
                <div>
                  {isTeamSizeKnown && !isLocationListEmpty && (
                    <Info>
                      {sum(locationsList.map(({ size }) => size))} people coming
                      to retreat
                    </Info>
                  )}
                  {isLocationListOverLimit && (
                    <Info>Max number of locations reached</Info>
                  )}
                  {canRenderError &&
                    errors.map(({ name }, index) => (
                      <Info key={index}>{ERROR_MESSAGES[name]}</Info>
                    ))}
                </div>
              </StyledForm>
              {matches.mobile && continueWrapper}
            </StyledList>
          }
          mapContent={
            <Layout.Map>
              <Map locationsList={locationsList} />
            </Layout.Map>
          }
        />
      )}
    </Media>
  )
}

OriginLocations.propTypes = {
  stepData: PropTypes.object.isRequired,
  updateStepData: PropTypes.func.isRequired,
}

export default OriginLocations
