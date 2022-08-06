import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { space, COLORS } from 'Theme'
import { Text } from 'components/atoms/Typography'
import CheckboxGroup from 'components/CheckboxGroup'
import Checkbox from 'components/Checkbox'
import Filter from 'sharedComponents/Filter'
import mountainsIcon from 'assets/images/svg/mountainous.svg'
import sunIcon from 'assets/images/svg/sunny.svg'
import cityIcon from 'assets/images/svg/city.svg'

const ALL_DESTINATIONS_QUERY_STRING_VALUE = undefined
const ALL_DESTINATIONS = {
  SUNNY: 'BEACH',
  MOUNTAINOUS: 'MOUNTAINS',
  CITY: 'CITY',
}
const { SUNNY, MOUNTAINOUS, CITY } = ALL_DESTINATIONS
const allDestinations = Object.values(ALL_DESTINATIONS)
const DESTINATION_LABELS = {
  [SUNNY]: 'Sunny',
  [MOUNTAINOUS]: 'Mountainous',
  [CITY]: 'City',
}
const ICON_SIZE = rem('24px')

const Icon = styled('img')`
  width: ${ICON_SIZE};
  height: ${ICON_SIZE};
  margin-left: ${space.s};
`

Icon.defaultProps = {
  alt: '',
}

const AllDestinations = ({ destinationTypes, setUrlFilters }) => {
  const [enabledDestinations, setEnabledDestinations] = React.useState(
    destinationTypes
  )

  const isStateDefault = allDestinations.every((property) =>
    destinationTypes.includes(property)
  )

  const getFilterLabel = () => {
    if (destinationTypes.length === 0) {
      return 'No destinations'
    }
    if (destinationTypes.length < allDestinations.length) {
      return destinationTypes
        .map((type, index) => {
          const label = DESTINATION_LABELS[type]
          return index !== 0 ? label.toLowerCase() : label
        })
        .join(', ')
    }
    if (destinationTypes.length === allDestinations.length) {
      return 'All destinations'
    }
    return 'All destinations'
  }

  return (
    <Filter
      label={getFilterLabel()}
      isChanged={!isStateDefault}
      onCancel={() => {
        setEnabledDestinations(destinationTypes)
      }}
      onClear={() => {
        setEnabledDestinations(allDestinations)
      }}
      onApply={() => {
        setUrlFilters({
          destinationTypes:
            enabledDestinations.length === allDestinations.length
              ? ALL_DESTINATIONS_QUERY_STRING_VALUE
              : enabledDestinations,
          page: 1,
        })
      }}
      isApplyDisabled={enabledDestinations.length === 0}
    >
      <Text display="block" mb="m" fontSize="s" color={COLORS.DEEP_RESERVOIR}>
        Destination types:
      </Text>
      <CheckboxGroup
        enabledItems={enabledDestinations}
        onChange={setEnabledDestinations}
      >
        <Checkbox value={ALL_DESTINATIONS.SUNNY}>
          {DESTINATION_LABELS[SUNNY]} <Icon src={sunIcon} />
        </Checkbox>
        <Checkbox value={ALL_DESTINATIONS.MOUNTAINOUS}>
          {DESTINATION_LABELS[MOUNTAINOUS]} <Icon src={mountainsIcon} />
        </Checkbox>
        <Checkbox value={ALL_DESTINATIONS.CITY}>
          {DESTINATION_LABELS[CITY]} <Icon src={cityIcon} />
        </Checkbox>
      </CheckboxGroup>
    </Filter>
  )
}

AllDestinations.defaultProps = {
  destinationTypes: allDestinations,
}

AllDestinations.propTypes = {
  destinationTypes: PropTypes.array,
  setUrlFilters: PropTypes.func.isRequired,
}

export default AllDestinations
