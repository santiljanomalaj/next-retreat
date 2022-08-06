import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { fontSizes, fontWeights, space, COLORS } from 'Theme'
import Tooltip from 'components/molecules/Tooltip'
import Checkbox from 'components/Checkbox'
import RadioGroup from 'components/RadioGroup'
import Filter from 'sharedComponents/Filter'

const Item = styled('div')`
  padding: ${space.xs} 0 ${space.m};

  &:last-child {
    padding-bottom: ${space.s};
  }
`

const Label = styled('span')`
  display: flex;

  padding-bottom: ${space.s};

  font-size: ${fontSizes.s};
  font-weight: ${fontWeights.semi_bold};

  color: ${COLORS.DEEP_RESERVOIR};

  > * {
    margin-left: ${space.s};
  }
`

const RETREAT_TYPES = {
  WORK: 'WORK',
  BALANCED: 'BALANCED',
  LEISURE: 'LEISURE',
}

const defaultFiltersState = {
  retreatType: RETREAT_TYPES.BALANCED,
  isMeetingRoomIncluded: false,
  isPromotedOnly: false,
}

const MoreFilters = ({
  retreatType,
  isMeetingRoomIncluded,
  isPromotedOnly,
  setUrlFilters,
}) => {
  const initialFiltersState = {
    retreatType,
    isMeetingRoomIncluded,
    isPromotedOnly,
  }
  const [filters, setFilters] = React.useState(initialFiltersState)

  const setFilterByName = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: 1,
      [name]: value || !prevFilters[name],
    }))
  }

  const filterValues = [
    retreatType === defaultFiltersState.retreatType,
    isPromotedOnly === defaultFiltersState.isPromotedOnly,
    isMeetingRoomIncluded === defaultFiltersState.isMeetingRoomIncluded,
  ]
  const changedFiltersCount =
    filterValues.length - filterValues.filter(Boolean).length

  return (
    <Filter
      label={`Smart filters${
        changedFiltersCount > 0 ? ` - ${changedFiltersCount}` : ''
      }`}
      isChanged={changedFiltersCount > 0}
      onCancel={() => {
        setFilters(initialFiltersState)
      }}
      onClear={() => {
        setFilters(defaultFiltersState)
      }}
      onApply={() => {
        setUrlFilters(filters)
      }}
    >
      {/* <Item> */}
      {/*   <Label> */}
      {/*     Retreat type <Tooltip text="Retreat type." /> */}
      {/*   </Label> */}
      {/*   <RadioGroup */}
      {/*     selectedValue={filters.retreatType} */}
      {/*     onSelect={(value) => setFilterByName('retreatType', value)} */}
      {/*   > */}
      {/*     <RadioGroup.Option value={RETREAT_TYPES.WORK} label="Work" /> */}
      {/*     <RadioGroup.Option value={RETREAT_TYPES.BALANCED} label="Balanced" /> */}
      {/*     <RadioGroup.Option value={RETREAT_TYPES.LEISURE} label="Leisure" /> */}
      {/*   </RadioGroup> */}
      {/* </Item> */}

      <Item>
        <Label>
          Need a meeting room?{' '}
          <Tooltip text="Check this option if you require a venue that has dedicated meeting facilities." />
        </Label>
        <RadioGroup
          selectedValue={filters.isMeetingRoomIncluded}
          onSelect={(value) => setFilterByName('isMeetingRoomIncluded', value)}
        >
          <RadioGroup.Option value label="Yes" />
          <RadioGroup.Option value={false} label="No" />
        </RadioGroup>
      </Item>

      <Item>
        <Checkbox
          css={`
            align-items: flex-start;
          `}
          isChecked={filters.isPromotedOnly}
          onChange={() => setFilterByName('isPromotedOnly')}
        >
          Show only curated venues
        </Checkbox>
      </Item>
    </Filter>
  )
}

MoreFilters.defaultProps = {
  retreatType: defaultFiltersState.retreatType,
  isPromotedOnly: defaultFiltersState.isPromotedOnly,
  isMeetingRoomIncluded: defaultFiltersState.isMeetingRoomIncluded,
}

MoreFilters.propTypes = {
  retreatType: PropTypes.string,
  isPromotedOnly: PropTypes.bool,
  isMeetingRoomIncluded: PropTypes.bool,
  setUrlFilters: PropTypes.func.isRequired,
}

export default MoreFilters
