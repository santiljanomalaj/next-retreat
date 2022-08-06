import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { Box } from 'components/atoms/Layout'
import { mq, space, radius } from 'Theme'
import Button from 'components/atoms/Button'
import { ReactComponent as Marker } from 'assets/images/svg/marker-button.svg'
import { ReactComponent as Close } from 'assets/images/svg/close-map-mobile.svg'

const WrapperBox = styled(Box)`
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  ${({ isMapDisplayed }) =>
    isMapDisplayed &&
    `
     position: absolute !important;
     top: 0;
     left: 0;
     margin: ${rem(20)} 0 0 ${rem(20)};
     transform: translateX(0);
  `}

  ${mq.to.tablet`
    position: sticky;

    width: min-content;
    margin: ${space.m} ${space.s};
  `}
`

const IconMarker = styled(Marker)`
  height: ${rem(15)};
  margin-right: ${space.s};
`
const IconClose = styled(Close)`
  height: ${rem(20)};
`
const SIZE = rem(40)

const CloseButton = styled(Button.Secondary)`
  height: ${SIZE};
  width: ${SIZE};
  border-radius: ${radius.circle};
  padding: 0;
  min-width: 0;
`

const ToggleMapViewButton = ({ isMapDisplayed, toggleMap, ...props }) => (
  <WrapperBox isMapDisplayed={isMapDisplayed} {...props}>
    {!isMapDisplayed ? (
      <Button.Secondary onClick={toggleMap}>
        <IconMarker />
        View Map
      </Button.Secondary>
    ) : (
      <CloseButton onClick={toggleMap}>
        <IconClose />
      </CloseButton>
    )}
  </WrapperBox>
)

ToggleMapViewButton.propTypes = {
  isMapDisplayed: PropTypes.bool.isRequired,
  toggleMap: PropTypes.func.isRequired,
}

export default ToggleMapViewButton
