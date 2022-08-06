import React from 'react'
import PropTypes from 'prop-types'
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
} from 'react-google-maps'
import { extendBoundsByOffset } from 'utils/map'
import { MAP_SETTINGS } from 'constants/constants'
import markerIcon from 'assets/images/team-locations-marker.png'
import mapStyles from './mapStyles.json'

const {
  DEFAULT_ZOOM,
  DEFAULT_CENTER,
  DEFAULT_MAP_OPTIONS,
  MARKER_SIZE,
} = MAP_SETTINGS

const MapContainer = ({ locationsList }) => {
  const mapRef = React.useRef(null)
  React.useEffect(() => {
    const bounds = new window.google.maps.LatLngBounds()
    if (locationsList.length > 0) {
      locationsList.forEach(({ coordinates: { lat, lon } }) => {
        bounds.extend(new window.google.maps.LatLng(lat, lon))
      })
      if (locationsList.length === 1) {
        extendBoundsByOffset(bounds, 1.5)
      }
      mapRef.current.fitBounds(bounds)
    }
  }, [locationsList])
  return (
    <GoogleMap
      defaultZoom={DEFAULT_ZOOM}
      defaultCenter={DEFAULT_CENTER}
      defaultOptions={{ ...DEFAULT_MAP_OPTIONS, styles: mapStyles }}
      ref={mapRef}
    >
      {locationsList.map(({ coordinates: { lat, lon: lng }, id }) => (
        <Marker
          key={id}
          position={{ lat, lng }}
          icon={{
            url: markerIcon,
            scaledSize: new window.google.maps.Size(
              MARKER_SIZE.MEDIUM,
              MARKER_SIZE.MEDIUM
            ),
          }}
        />
      ))}
    </GoogleMap>
  )
}

MapContainer.propTypes = {
  locationsList: PropTypes.arrayOf(
    PropTypes.shape({
      coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lon: PropTypes.number.isRequired,
      }).isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
}

export default withScriptjs(withGoogleMap(MapContainer))
