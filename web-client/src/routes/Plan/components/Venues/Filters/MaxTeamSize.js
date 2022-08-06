import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { COLORS } from 'Theme'
import Button from 'components/atoms/Button'
import { Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Tooltip from 'components/molecules/Tooltip'
import Checkbox from 'components/Checkbox'
import CheckboxGroup from 'components/CheckboxGroup'
import Input from 'components/Input'
import Filter from 'sharedComponents/Filter'

const TEAMSIZE_SEPARATE_SEARCH_CUTOFF = 18
const TEAMSIZE_HOTELS_OTHERS_CUTOFF = 36
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

const StyledButton = styled(Button.Secondary)`
  cursor: pointer;

  text-decoration: none;
`

const MaxTeamSize = ({
  isOpen,
  venueTypes,
  maxTeamSize: initialMaxTeamSize,
  defaultMaxTeamSize,
  setUrlFilters,
}) => {
  const [currentMaxTeamSize, setCurrentMaxTeamSize] = React.useState(
    initialMaxTeamSize
  )
  const [enabledProperties, setEnabledProperties] = React.useState(venueTypes)

  const handleCurrentMaxTeamSizeChange = (newCurrentMaxTeamSize) => {
    const hasOnlyHotelsOrOther =
      enabledProperties.every((property) =>
        [HOTELS, OTHER].includes(property)
      ) && enabledProperties.length <= 2

    setCurrentMaxTeamSize((prevCurrentMaxTeamSize) => {
      if (
        prevCurrentMaxTeamSize <= TEAMSIZE_SEPARATE_SEARCH_CUTOFF &&
        newCurrentMaxTeamSize > TEAMSIZE_SEPARATE_SEARCH_CUTOFF &&
        newCurrentMaxTeamSize <= TEAMSIZE_HOTELS_OTHERS_CUTOFF
      ) {
        setEnabledProperties(
          enabledProperties.filter((property) =>
            (hasOnlyHotelsOrOther
              ? [HOTELS, OTHER]
              : [APARTMENTS, HOUSES]
            ).includes(property)
          )
        )
      }

      if (
        prevCurrentMaxTeamSize <= TEAMSIZE_HOTELS_OTHERS_CUTOFF &&
        newCurrentMaxTeamSize > TEAMSIZE_HOTELS_OTHERS_CUTOFF
      ) {
        if (
          !enabledProperties.some((property) =>
            [HOTELS, OTHER].includes(property)
          )
        ) {
          setEnabledProperties([HOTELS, OTHER])
        } else {
          setEnabledProperties(
            enabledProperties.filter((property) =>
              [HOTELS, OTHER].includes(property)
            )
          )
        }
      }

      return newCurrentMaxTeamSize
    })
  }

  const handleEnabledPropertiesChange = (newEnabledProperties) => {
    const clickedProperty =
      newEnabledProperties[newEnabledProperties.length - 1]
    const isHotelOrOther = [HOTELS, OTHER].includes(clickedProperty)

    if (
      newEnabledProperties.length &&
      currentMaxTeamSize > TEAMSIZE_SEPARATE_SEARCH_CUTOFF
    ) {
      setEnabledProperties(
        newEnabledProperties.filter(
          (property) =>
            !(isHotelOrOther ? [APARTMENTS, HOUSES] : [HOTELS, OTHER]).includes(
              property
            )
        )
      )
    } else {
      setEnabledProperties(newEnabledProperties)
    }
  }

  const isStateDefault =
    initialMaxTeamSize === null &&
    allProperties.every((property) => venueTypes.includes(property))

  const getFilterLabel = () => {
    if (venueTypes.length === 0) {
      return 'no properties'
    }
    if (venueTypes.length < allProperties.length) {
      return venueTypes
        .map((type) => PROPERTY_LABELS[type].toLowerCase())
        .join(', ')
    }
    if (venueTypes.length === allProperties.length) {
      return 'all properties'
    }
    return 'all properties'
  }

  return (
    <Filter
      label={
        isStateDefault
          ? 'Venue size'
          : `Max ${initialMaxTeamSize} people, ${getFilterLabel()}`
      }
      isChanged={!isStateDefault}
      isOpen={isOpen}
      onCancel={() => {
        setCurrentMaxTeamSize(initialMaxTeamSize)
        setEnabledProperties(venueTypes)
      }}
      onClear={() => {
        setCurrentMaxTeamSize(defaultMaxTeamSize)
        setEnabledProperties(allProperties)
      }}
      onApply={() => {
        setUrlFilters({
          venueTypes: enabledProperties,
          maxTeamSize: currentMaxTeamSize || defaultMaxTeamSize,
          page: 1,
        })
      }}
      isApplyDisabled={enabledProperties.length === 0}
    >
      <Box>
        <Text display="block" mb="m" fontSize="s" color={COLORS.DEEP_RESERVOIR}>
          Max team size:{' '}
          <Box display="inline-block" verticalAlign="sub" mx="s">
            <Tooltip text="A maximum number of people arriving to retreat from all team locations (min. 5)" />
          </Box>
        </Text>
        <Input.Number
          data-hj-whitelist
          value={currentMaxTeamSize || defaultMaxTeamSize}
          onChange={(value) =>
            handleCurrentMaxTeamSizeChange(Math.max(value, defaultMaxTeamSize))
          }
        />
        {currentMaxTeamSize > TEAMSIZE_SEPARATE_SEARCH_CUTOFF &&
          currentMaxTeamSize <= TEAMSIZE_HOTELS_OTHERS_CUTOFF && (
            <Text
              display="block"
              my="m"
              fontSize="s"
              color={COLORS.DEEP_RESERVOIR}
            >
              We cannot display results of all 4 property types together for
              more than {TEAMSIZE_SEPARATE_SEARCH_CUTOFF} people – but you can
              still search them separately.
            </Text>
          )}
        {currentMaxTeamSize > TEAMSIZE_HOTELS_OTHERS_CUTOFF && (
          <>
            <Text
              display="block"
              my="m"
              fontSize="s"
              color={COLORS.DEEP_RESERVOIR}
            >
              Different property types can host different team sizes. If your
              team is above {TEAMSIZE_HOTELS_OTHERS_CUTOFF} people, search for
              Hotels or Others, or request custom retreat proposal from us.
            </Text>
            <StyledButton
              as="a"
              href={process.env.REACT_APP_REQUEST_RETREAT_URL}
              isBlock
            >
              Request retreat
            </StyledButton>
          </>
        )}
      </Box>
      <Box mt="m">
        <Text display="block" mb="m" fontSize="s" color={COLORS.DEEP_RESERVOIR}>
          Type of property:
        </Text>
        <CheckboxGroup
          enabledItems={enabledProperties}
          onChange={handleEnabledPropertiesChange}
        >
          <Checkbox value={HOTELS}>{PROPERTY_LABELS[HOTELS]}</Checkbox>
          <Checkbox
            value={APARTMENTS}
            isDisabled={currentMaxTeamSize > TEAMSIZE_HOTELS_OTHERS_CUTOFF}
          >
            {PROPERTY_LABELS[APARTMENTS]}
          </Checkbox>
          <Checkbox
            value={HOUSES}
            isDisabled={currentMaxTeamSize > TEAMSIZE_HOTELS_OTHERS_CUTOFF}
          >
            {PROPERTY_LABELS[HOUSES]}
          </Checkbox>
          <Checkbox value={OTHER}>{PROPERTY_LABELS[OTHER]}</Checkbox>
        </CheckboxGroup>
      </Box>
    </Filter>
  )
}

MaxTeamSize.defaultProps = {
  maxTeamSize: null,
  venueTypes: allProperties,
}

MaxTeamSize.propTypes = {
  isOpen: PropTypes.bool,
  venueTypes: PropTypes.array,
  maxTeamSize: PropTypes.number,
  defaultMaxTeamSize: PropTypes.number.isRequired,
  setUrlFilters: PropTypes.func.isRequired,
}

export default MaxTeamSize
