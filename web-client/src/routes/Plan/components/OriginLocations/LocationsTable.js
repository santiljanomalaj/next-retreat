import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ellipsis, rem } from 'polished'
import { space, BORDER_WIDTH, COLORS } from 'Theme'
import { Flex } from 'components/atoms/Layout'
import { Label, Text } from 'components/atoms/Typography'
import Input from 'components/Input'
import xmarkIcon from 'assets/images/svg/xmark.svg'

const ROW_ITEM_MARGIN = space.m
const REMOVE_BUTTON_SIZE = rem('40px')

const Header = styled('div')`
  display: flex;
  justify-content: space-between;

  > :last-child {
    text-align: right;

    margin-right: calc(${REMOVE_BUTTON_SIZE} + ${ROW_ITEM_MARGIN});
  }
`

const Row = styled(Flex)`
  height: ${rem('88px')};

  border-bottom: ${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS};

  &:last-child {
    border-color: transparent;
  }

  > :not(:last-child) {
    margin-right: ${ROW_ITEM_MARGIN};
  }
`

const Location = styled('div')`
  overflow: hidden;
  flex: 1;

  > * {
    ${ellipsis()}

    display: block !important;
  }
`

const RemoveButton = styled('button')`
  height: ${REMOVE_BUTTON_SIZE};
  width: ${REMOVE_BUTTON_SIZE};
`

const LocationsTable = ({
  locationsList,
  updateLocation,
  removeLocation,
  isTeamSizeKnown,
}) => (
  <>
    <Header>
      <Label>TEAM LOCATIONS</Label>
      {isTeamSizeKnown && <Label># OF PEOPLE</Label>}
    </Header>
    {locationsList.map(({ name, country, size }, index) => (
      <Row key={index} alignItems="center">
        <Location>
          <Text fontSize="xl" fontWeight="bold">
            {name}
          </Text>
          <Text fontSize="s">{country}</Text>
        </Location>
        {isTeamSizeKnown && (
          <Input.Number
          data-tour={`origin-locations-number-input-${index}`}
            value={size}
            onChange={(newSize) => {
              updateLocation(index, { size: Math.max(1, newSize) })
            }}
          />
        )}
        <RemoveButton
          type="button"
          onClick={() => {
            removeLocation(index)
          }}
        >
          <img src={xmarkIcon} alt="" />
        </RemoveButton>
      </Row>
    ))}
  </>
)

LocationsTable.propTypes = {
  locationsList: PropTypes.array.isRequired,
  updateLocation: PropTypes.func.isRequired,
  removeLocation: PropTypes.func.isRequired,
  isTeamSizeKnown: PropTypes.bool.isRequired,
}

export default LocationsTable
