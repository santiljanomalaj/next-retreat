import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { fontSizes, COLORS } from 'Theme'
import { Text } from 'components/atoms/Typography'
import RadioGroup from 'components/RadioGroup'
import SORTER_PARAMS from 'constants/sorterParams'
import Filter, { PADDING } from 'sharedComponents/Filter'

const { OPTIMAL, TRAVEL_TIME, PRICE } = SORTER_PARAMS
const defaultSortBy = OPTIMAL
const SORTER_LABELS = {
  [OPTIMAL]: 'Best options first',
  [TRAVEL_TIME]: 'Travel time',
  [PRICE]: 'Lowest price',
}

const StyledOption = styled(RadioGroup.Option)`
  cursor: pointer;
  z-index: 0;
  position: relative;
  display: block;

  font-size: ${fontSizes.m};
  line-height: ${rem('34px')};
  white-space: nowrap;

  &::after {
    ${({ checked }) => checked && `content: '';`}

    z-index: -1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: -${PADDING};
    right: -${PADDING};

    background-color: ${COLORS.IRRADIANT_IRIS};
  }

  input {
    display: none;
  }
`

const Sorter = ({
  innerLabel,
  setUrlFilters,
  travelTimeLabel,
  sortBy: initialSortBy,
}) => {
  const [currentSortBy, setCurrentSortBy] = React.useState(initialSortBy)

  const isStateDefault = initialSortBy === defaultSortBy

  return (
    <Filter
      label={
        initialSortBy === TRAVEL_TIME
          ? travelTimeLabel
          : SORTER_LABELS[initialSortBy]
      }
      isChanged={!isStateDefault}
      onCancel={() => {
        setCurrentSortBy(initialSortBy)
      }}
      onClear={() => {
        setCurrentSortBy(defaultSortBy)
      }}
      onApply={() => {
        setUrlFilters({ sortBy: currentSortBy, page: 1 })
      }}
    >
      {innerLabel && (
        <Text display="block" mb="s" fontSize="s" color={COLORS.DEEP_RESERVOIR}>
          {innerLabel}
        </Text>
      )}
      <RadioGroup
        selectedValue={currentSortBy}
        onSelect={setCurrentSortBy}
        isUnstyled
      >
        <StyledOption value={OPTIMAL} label={SORTER_LABELS.OPTIMAL} />
        <StyledOption value={PRICE} label={SORTER_LABELS.PRICE} />
        <StyledOption value={TRAVEL_TIME} label={travelTimeLabel} />
      </RadioGroup>
    </Filter>
  )
}

Sorter.defaultProps = {
  sortBy: defaultSortBy,
  travelTimeLabel: SORTER_LABELS.TRAVEL_TIME,
}

Sorter.propTypes = {
  sortBy: PropTypes.string,
  innerLabel: PropTypes.string,
  travelTimeLabel: PropTypes.string,
  setUrlFilters: PropTypes.func.isRequired,
}

export default Sorter
