import React from 'react'
import styled from 'styled-components'
import { radius } from 'Theme'
import { GOOGLE_MAP_URL } from 'constants/constants'
import { Box } from 'components/atoms/Layout'
import MapContainer from './Map'

const StyledBox = styled(Box)`
  .gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom {
    top: 0;
  }
`

const StyledMapElementContaienr = styled(Box)`
  border-radius: ${radius.m};
`

const Map = (props) => (
  <StyledBox height="100%">
    <MapContainer
      googleMapURL={GOOGLE_MAP_URL}
      loadingElement={<Box height="100%" />}
      containerElement={<Box height="100%" />}
      mapElement={<StyledMapElementContaienr height="100%" />}
      {...props}
    />
  </StyledBox>
)

export default Map
