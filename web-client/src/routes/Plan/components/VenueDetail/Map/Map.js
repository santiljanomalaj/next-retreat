import React from 'react'
import PropTypes from 'prop-types'
import {
  Marker,
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  DirectionsRenderer,
} from 'react-google-maps'
import airportIcon from 'assets/images/airport.png'
import venueIconActive from 'assets/images/venue-marker-active.png'
import { delay, directionsRequest } from 'routes/Plan/mapHelpers'
import { extendBoundsByOffset } from 'utils/map'
import { MAP_SETTINGS } from 'constants/constants'
import style from './mapStyles.json'

const {
  DEFAULT_ZOOM,
  DEFAULT_CENTER,
  DEFAULT_MAP_OPTIONS,
  MARKER_SIZE,
  DIRECTIONS_OPTIONS,
} = MAP_SETTINGS

const MapContainer = ({
  venueCoordinates,
  airports,
  isDomesticDestination,
}) => {
  const [directions, setDirections] = React.useState([])
  const mapRef = React.useRef(null)
  React.useEffect(() => {
    const bounds = new window.google.maps.LatLngBounds()
    bounds.extend(
      new window.google.maps.LatLng(venueCoordinates.lat, venueCoordinates.lon)
    )
    airports.forEach(({ coordinates: { lat, lon } }) => {
      bounds.extend(new window.google.maps.LatLng(lat, lon))
    })
    // Prevent maximum zoom for no airports
    if (airports.length === 0) {
      extendBoundsByOffset(bounds, 0.01)
    }
    mapRef.current.fitBounds(bounds)
  }, [airports, venueCoordinates.lat, venueCoordinates.lon])

  React.useEffect(() => {
    if (!isDomesticDestination) {
      const DirectionsService = new window.google.maps.DirectionsService()
      const fetchDirections = async () => {
        const tempDirectionsToVenue = []
        // eslint-disable-next-line no-restricted-syntax
        for (const airport of airports) {
          // eslint-disable-next-line no-await-in-loop
          const direction = await directionsRequest({
            DirectionsService,
            origin: {
              lat: airport.coordinates.lat,
              lon: airport.coordinates.lon,
            },
            destination: {
              lat: venueCoordinates.lat,
              lon: venueCoordinates.lon,
            },
          })
          // eslint-disable-next-line no-await-in-loop
          await delay(300)
          tempDirectionsToVenue.push(direction)
        }
        setDirections(tempDirectionsToVenue)
      }
      fetchDirections()
    }
  }, [
    airports,
    venueCoordinates.lat,
    venueCoordinates.lon,
    isDomesticDestination,
  ])

  return (
    <GoogleMap
      defaultZoom={DEFAULT_ZOOM}
      defaultCenter={DEFAULT_CENTER}
      defaultOptions={{ ...DEFAULT_MAP_OPTIONS, styles: style }}
      ref={mapRef}
    >
      <Marker
        position={{ lat: venueCoordinates.lat, lng: venueCoordinates.lon }}
        icon={{
          url: venueIconActive,
          scaledSize: new window.google.maps.Size(
            MARKER_SIZE.SMALL,
            MARKER_SIZE.SMALL
          ),
        }}
      />
      {!isDomesticDestination &&
        airports.map(({ coordinates: { lat, lon: lng } }, i) => (
          <Marker
            key={i}
            position={{ lat, lng }}
            icon={{
              url: airportIcon,
              scaledSize: new window.google.maps.Size(
                MARKER_SIZE.SMALL,
                MARKER_SIZE.SMALL
              ),
            }}
          />
        ))}
      {directions.map((direction, i) => (
        <DirectionsRenderer
          key={i}
          directions={direction}
          options={DIRECTIONS_OPTIONS}
        />
      ))}
    </GoogleMap>
  )
}

MapContainer.propTypes = {
  venueCoordinates: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }).isRequired,
  airports: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lon: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
  isDomesticDestination: PropTypes.bool,
}

export default withScriptjs(withGoogleMap(MapContainer))
