import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { Box } from 'components/atoms/Layout'
import { mq, space } from 'Theme'
import Button from 'components/atoms/Button'
import markerIcon from 'assets/images/svg/marker-button.svg'
import listIcon from 'assets/images/svg/list-button.svg'

const WrapperBox = styled(Box)`
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;

  ${mq.to.tablet`
    position: sticky;

    width: min-content;
    margin: ${space.s} 0;
  `}
`

const Icon = styled('img')`
  height: ${rem(15)};
  margin-right: ${space.s};
`

const ToggleMapViewButton = ({ isMapDisplayed, toggleMap, ...props }) => (
  <WrapperBox {...props}>
    <Button.Secondary onClick={toggleMap}>
      {isMapDisplayed ? (
        <>
          <Icon src={listIcon} />
          Back to List
        </>
      ) : (
        <>
          <Icon src={markerIcon} />
          View Map
        </>
      )}
    </Button.Secondary>
  </WrapperBox>
)

ToggleMapViewButton.propTypes = {
  isMapDisplayed: PropTypes.bool.isRequired,
  toggleMap: PropTypes.func.isRequired,
}

export default ToggleMapViewButton
