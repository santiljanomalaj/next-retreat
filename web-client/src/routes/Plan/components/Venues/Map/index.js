import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BOXSHADOWS, radius } from 'Theme'
import { TOPBAR_HEIGHT } from 'constants/style'
import { GOOGLE_MAP_URL } from 'constants/constants'
import { Box } from 'components/atoms/Layout'
import MapContainer from './Map'

const StyledBox = styled(Box)`
  .gm-ui-hover-effect {
    display: none !important;
  }
  .gm-style .gm-style-iw-t::after {
    box-shadow: -2px 2px 2px rgba(66, 149, 165, 0.25);
  }
  .gm-style-iw.gm-style-iw-c {
    padding: 0;
    max-width: none !important;
    max-height: none !important;
    box-shadow: ${BOXSHADOWS.CARD};
    border-radius: ${radius.m};
    .gm-style-iw-d {
      overflow: hidden !important;
      max-width: none !important;
      max-height: none !important;
    }
  }
  .gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom {
    top: 0;
  }

  z-index: 1;
  position: sticky;
  top: ${TOPBAR_HEIGHT};

  height: calc(var(--nr-100vh, 100vh) - ${TOPBAR_HEIGHT});

  ${({ isMapOpen }) =>
    isMapOpen &&
    `
      z-index: 2;
      position: fixed;
      left: 0;
      right: 0;
  `}
`

const Map = ({
  isMapOpen,
  toggleMapViewButton: ToggleMapViewButton,
  ...props
}) => (
  <StyledBox isMapOpen={isMapOpen} key={isMapOpen}>
    <MapContainer
      googleMapURL={GOOGLE_MAP_URL}
      loadingElement={<Box height="100%" />}
      containerElement={<Box height="100%" />}
      mapElement={<Box height="100%" />}
      {...props}
    />
    {ToggleMapViewButton}
  </StyledBox>
)

Map.propTypes = {
  isMapOpen: PropTypes.bool.isRequired,
  toggleMapViewButton: PropTypes.node.isRequired,
}

export default Map
