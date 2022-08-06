import React from 'react'
import styled from 'styled-components'
import { TOPBAR_HEIGHT } from 'constants/style'
import { GOOGLE_MAP_URL } from 'constants/constants'
import { Box } from 'components/atoms/Layout'
import MapContainer from './Map'

const StyledBox = styled(Box)`
  .gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom {
    top: 0;
  }

  z-index: 1;
  position: sticky;
  top: ${TOPBAR_HEIGHT};

  height: calc(var(--nr-100vh, 100vh) - ${TOPBAR_HEIGHT});
`

const Map = ({ ...props }) => (
  <StyledBox>
    <MapContainer
      googleMapURL={GOOGLE_MAP_URL}
      loadingElement={<Box height="100%" />}
      containerElement={<Box height="100%" />}
      mapElement={<Box height="100%" />}
      {...props}
    />
  </StyledBox>
)

export default Map
