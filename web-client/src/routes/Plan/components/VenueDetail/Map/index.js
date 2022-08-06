import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import { GOOGLE_MAP_URL } from 'constants/constants'
import { Box } from 'components/atoms/Layout'
import MapContainer from './Map'

const MAP_HEIGHT = rem(330)

const StyledBox = styled(Box)`
  .gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom {
    top: 0;
  }
  height: ${MAP_HEIGHT};
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
