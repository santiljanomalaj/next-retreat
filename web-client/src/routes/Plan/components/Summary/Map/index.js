import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import { GOOGLE_MAP_URL } from 'constants/constants'
import { radius } from 'Theme'
import { Box } from 'components/atoms/Layout'
import MapContainer from './Map'

const MAP_HEIGHT = rem(240)

const StyledBox = styled(Box)`
  .gm-style {
    background-color: #cfdcfc;
  }
  .gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom {
    top: 0;
  }
  overflow: hidden;
  height: ${MAP_HEIGHT};
  border-radius: ${radius.s};
`

const Map = (props) => (
  <StyledBox>
    <MapContainer
      googleMapURL={GOOGLE_MAP_URL}
      loadingElement={<Box height={MAP_HEIGHT} />}
      containerElement={<Box height={MAP_HEIGHT} />}
      mapElement={<Box height={MAP_HEIGHT} />}
      {...props}
    />
  </StyledBox>
)

export default Map
