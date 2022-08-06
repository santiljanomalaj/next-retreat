import React from 'react'
import PropTypes from 'prop-types'
import { COLORS } from 'Theme'
import { Text } from 'components/atoms/Typography'
import CheckboxGroup from 'components/CheckboxGroup'
import Checkbox from 'components/Checkbox'
import Filter from 'sharedComponents/Filter'

const ALL_PROPERTIES = {
  HOTELS: 'HOTEL',
  APARTMENTS: 'APARTMENT',
  HOUSES: 'HOUSE',
  OTHER: 'OTHER',
}
const { HOTELS, APARTMENTS, HOUSES, OTHER } = ALL_PROPERTIES
const allProperties = Object.values(ALL_PROPERTIES)
const PROPERTY_LABELS = {
  [HOTELS]: 'Hotels',
  [APARTMENTS]: 'Apartments',
  [HOUSES]: 'Entire houses',
  [OTHER]: 'Other',
}

const AllProperties = ({ venueTypes, setUrlFilters }) => {
  const [enabledProperties, setEnabledProperties] = React.useState(venueTypes)

  const isStateDefault = allProperties.every((property) =>
    venueTypes.includes(property)
  )

  const getFilterLabel = () => {
    if (venueTypes.length === 0) {
      return 'No properties'
    }
    if (venueTypes.length < allProperties.length) {
      return venueTypes
        .map((type, index) => {
          const label = PROPERTY_LABELS[type]
          return index !== 0 ? label.toLowerCase() : label
        })
        .join(', ')
    }
    if (venueTypes.length === allProperties.length) {
      return 'All properties'
    }
    return 'All properties'
  }

  return (
    <Filter
      label={getFilterLabel()}
      isChanged={!isStateDefault}
      onCancel={() => {
        setEnabledProperties(venueTypes)
      }}
      onClear={() => {
        setEnabledProperties(allProperties)
      }}
      onApply={() => {
        setUrlFilters({ venueTypes: enabledProperties, page: 1 })
      }}
      isApplyDisabled={enabledProperties.length === 0}
    >
      <Text display="block" mb="m" fontSize="s" color={COLORS.DEEP_RESERVOIR}>
        Show only:
      </Text>
      <CheckboxGroup
        enabledItems={enabledProperties}
        onChange={setEnabledProperties}
      >
        <Checkbox value={HOTELS}>{PROPERTY_LABELS[HOTELS]}</Checkbox>
        <Checkbox value={APARTMENTS}>{PROPERTY_LABELS[APARTMENTS]}</Checkbox>
        <Checkbox value={HOUSES}>{PROPERTY_LABELS[HOUSES]}</Checkbox>
        <Checkbox value={OTHER}>{PROPERTY_LABELS[OTHER]}</Checkbox>
      </CheckboxGroup>
    </Filter>
  )
}

AllProperties.defaultProps = {
  venueTypes: allProperties,
}

AllProperties.propTypes = {
  venueTypes: PropTypes.array,
  setUrlFilters: PropTypes.func.isRequired,
}

export default AllProperties
