import React from 'react'
import PropTypes from 'prop-types'
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  Polyline,
} from 'react-google-maps'
import { extendBoundsByOffset } from 'utils/map'
import { MAP_SETTINGS } from 'constants/constants'
import dotIcon from 'assets/images/dot-marker.png'
import destinationIconActive from 'assets/images/destination-marker-active.png'
import style from './mapStyles.json'

const {
  DEFAULT_ZOOM,
  DEFAULT_CENTER,
  DEFAULT_MAP_OPTIONS,
  MARKER_SIZE,
  POLYLINE_OPTIONS,
} = MAP_SETTINGS

const getLatLngForPolyline = ({ origin, destination }) => [
  { lat: origin.lat, lng: origin.lon },
  { lat: destination.lat, lng: destination.lon },
]

const Map = ({ destination, originLocations }) => {
  const mapRef = React.useRef(null)
  React.useEffect(() => {
    const bounds = new window.google.maps.LatLngBounds()
    bounds.extend(
      new window.google.maps.LatLng(
        destination.coordinates.lat,
        destination.coordinates.lon
      )
    )
    originLocations.forEach(({ coordinates: { lat, lon } }) => {
      bounds.extend(new window.google.maps.LatLng(lat, lon))
    })
    // Prevent maximum zoom for no origin locations
    if (originLocations.length === 0) {
      extendBoundsByOffset(bounds, 0.01)
    }
    mapRef.current.fitBounds(bounds)
  }, [
    destination.coordinates.lat,
    destination.coordinates.lon,
    originLocations,
  ])

  return (
    <GoogleMap
      defaultZoom={DEFAULT_ZOOM}
      defaultCenter={DEFAULT_CENTER}
      defaultOptions={{ ...DEFAULT_MAP_OPTIONS, styles: style }}
      ref={mapRef}
    >
      {originLocations.map(({ id, coordinates: { lat, lon: lng } }) => (
        <Marker
          key={id}
          position={{ lat, lng }}
          icon={{
            url: dotIcon,
            scaledSize: new window.google.maps.Size(
              MARKER_SIZE.EXTRA_SMALL,
              MARKER_SIZE.EXTRA_SMALL
            ),
          }}
        />
      ))}
      <Marker
        position={{
          lat: destination.coordinates.lat,
          lng: destination.coordinates.lon,
        }}
        icon={{
          url: destinationIconActive,
          scaledSize: new window.google.maps.Size(
            MARKER_SIZE.SMALL,
            MARKER_SIZE.SMALL
          ),
        }}
      />
      {originLocations.map(({ id, coordinates }) => (
        <Polyline
          key={id}
          path={getLatLngForPolyline({
            origin: coordinates,
            destination: destination.coordinates,
          })}
          options={
            destination.availableOriginLocationIds.includes(id)
              ? POLYLINE_OPTIONS.REGULAR
              : POLYLINE_OPTIONS.DASHED
          }
        />
      ))}
    </GoogleMap>
  )
}

Map.propTypes = {
  destination: PropTypes.shape({
    coordinates: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
    }).isRequired,
    availableOriginLocationIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  originLocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lon: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
}

export default withScriptjs(withGoogleMap(Map))
