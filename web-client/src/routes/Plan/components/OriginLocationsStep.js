import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ContentLoader from 'react-content-loader'
import { fontSizes, fontWeights, space, COLORS } from 'Theme'
import { Flex } from 'components/atoms/Layout'
import Stepper from 'components/Stepper'
import EditButton from './EditButton'

export const Loader = () => (
  <Flex width="100%">
    <ContentLoader
      speed="2"
      width="361"
      height="23"
      viewBox="0 0 361 23"
      backgroundColor={COLORS.IRRADIANT_IRIS}
      foregroundColor={COLORS.SUPER_SILVER}
    >
      <rect width="361" height="23" rx="10" />
    </ContentLoader>
  </Flex>
)

const LocationsList = styled('span')`
  display: inline-flex;
  flex-wrap: wrap;
`

const TextWithBullet = styled('span')`
  font-size: ${fontSizes.xl};
  font-weight: ${fontWeights.bold};
  white-space: nowrap;

  &::after {
    content: '•';
    display: inline-block;

    padding: 0 ${space.xs};

    color: ${COLORS.BROTHER_BLUE};

    transform: scale(0.6);
  }

  &:last-of-type::after {
    content: '';

    padding-right: ${space.s};
  }
`

const OriginLocationsStep = ({ locations, updateStepData, isLoading }) => (
  <Stepper.Step label="TEAM LOCATIONS">
    {isLoading ? (
      <Loader />
    ) : (
      <LocationsList>
        {locations?.map(({ name }, index) => (
          <TextWithBullet key={index}>
            <span>{name}</span>
          </TextWithBullet>
        ))}
        <EditButton
          onClick={() => {
            updateStepData(({ originLocations }) => ({ originLocations }), {
              overwrite: true,
            })
          }}
        />
      </LocationsList>
    )}
  </Stepper.Step>
)

OriginLocationsStep.propTypes = {
  isLoading: PropTypes.bool,
  locations: PropTypes.array,
  updateStepData: PropTypes.func.isRequired,
}

export default OriginLocationsStep
