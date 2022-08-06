import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TOPBAR_HEIGHT } from 'constants/style'
import { GOOGLE_MAP_URL } from 'constants/constants'
import { radius, BOXSHADOWS } from 'Theme'
import { Box } from 'components/atoms/Layout'
import MapContainer from './Map'

const StyledBox = styled(Box)`
  .gm-style {
    background-color: #cfdcfc;
  }

  .gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom {
    top: 0;
  }
  .gm-ui-hover-effect {
    display: none !important;
  }
  .gm-style .gm-style-iw-t::after {
    display: none;
  }
  .gm-style-iw.gm-style-iw-c {
    padding: 0;
    max-width: none !important;
    max-height: none !important;
    box-shadow: ${BOXSHADOWS.DARK};
    border-radius: ${radius.s};
    .gm-style-iw-d {
      overflow: hidden !important;
      max-width: none !important;
      max-height: none !important;
    }
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

const Map = ({ isMapOpen, toggleMapViewButton, carousel, ...props }) => (
  <StyledBox isMapOpen={isMapOpen} key={isMapOpen}>
    <MapContainer
      googleMapURL={GOOGLE_MAP_URL}
      loadingElement={<Box height="100%" />}
      containerElement={<Box height="100%" />}
      mapElement={<Box height="100%" />}
      {...props}
    />

    {toggleMapViewButton}
    {carousel}
  </StyledBox>
)

Map.propTypes = {
  isMapOpen: PropTypes.bool.isRequired,
  toggleMapViewButton: PropTypes.node.isRequired,
  carousel: PropTypes.node,
}

export default Map
