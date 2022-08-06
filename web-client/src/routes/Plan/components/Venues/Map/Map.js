import React from 'react'
import PropTypes from 'prop-types'
import OutsideClickHandler from 'react-outside-click-handler'
import {
  Marker,
  GoogleMap,
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  DirectionsRenderer,
} from 'react-google-maps'
import airportIcon from 'assets/images/airport.png'
import venueIconActive from 'assets/images/venue-marker-active.png'
import venueIconInactive from 'assets/images/venue-marker-inactive.png'
import { delay, directionsRequest } from 'routes/Plan/mapHelpers'
import { MAP_SETTINGS } from 'constants/constants'
import InfoWindowContent from './InfoWindow'
import style from './mapStyles.json'

const {
  DEFAULT_ZOOM,
  DEFAULT_CENTER,
  DEFAULT_MAP_OPTIONS,
  MARKER_SIZE,
  PIXEL_OFFSET,
  DIRECTIONS_OPTIONS,
} = MAP_SETTINGS

const MapContainer = ({
  venues,
  airports,
  hoveredVenueId,
  getDetailUrlByVenueId,
  isDomesticDestination,
}) => {
  const [selectedVenueId, setSelectedVenueId] = React.useState(null)
  const [directions, setDirections] = React.useState({})
  const [isClickOutsideDisabled, setIsClickOutsideDisabled] = React.useState(
    false
  )
  const mapRef = React.useRef(null)
  const selectedOrHoveredVenueId = hoveredVenueId || selectedVenueId
  React.useEffect(() => {
    const bounds = new window.google.maps.LatLngBounds()
    venues.forEach(({ coordinates: { lat, lon } }) => {
      bounds.extend(new window.google.maps.LatLng(lat, lon))
    })
    airports.forEach(({ coordinates: { lat, lon } }) => {
      bounds.extend(new window.google.maps.LatLng(lat, lon))
    })
    mapRef.current.fitBounds(bounds)
  }, [airports, venues, selectedOrHoveredVenueId])
  React.useEffect(() => {
    if (hoveredVenueId) {
      setSelectedVenueId(null)
    }
  }, [hoveredVenueId])
  const directionsToSelectedOrClickedVenue =
    directions[selectedOrHoveredVenueId]
  React.useEffect(() => {
    if (
      !isDomesticDestination &&
      selectedOrHoveredVenueId &&
      !directionsToSelectedOrClickedVenue
    ) {
      const DirectionsService = new window.google.maps.DirectionsService()
      const fetchDirections = async () => {
        const selectedOrHoveredVenue = venues.find(
          ({ id }) => selectedOrHoveredVenueId === id
        )
        const { coordinates } = selectedOrHoveredVenue
        const tempDirectionsToVenue = []
        try {
          // eslint-disable-next-line no-restricted-syntax
          for (const airport of airports) {
            // eslint-disable-next-line no-await-in-loop
            const direction = await directionsRequest({
              DirectionsService,
              origin: {
                lat: airport.coordinates.lat,
                lon: airport.coordinates.lon,
              },
              destination: { lat: coordinates.lat, lon: coordinates.lon },
            })
            // eslint-disable-next-line no-await-in-loop
            await delay(300)
            tempDirectionsToVenue.push(direction)
          }
        } catch (error) {
          // do nothing
        }
        setDirections((prevState) => ({
          ...prevState,
          [selectedOrHoveredVenueId]: tempDirectionsToVenue,
        }))
      }
      fetchDirections()
    }
  }, [
    airports,
    directionsToSelectedOrClickedVenue,
    selectedOrHoveredVenueId,
    isDomesticDestination,
    venues,
  ])
  const selectedVenue = venues.find(({ id }) => selectedVenueId === id)
  return (
    <GoogleMap
      defaultZoom={DEFAULT_ZOOM}
      defaultCenter={DEFAULT_CENTER}
      defaultOptions={{ ...DEFAULT_MAP_OPTIONS, styles: style }}
      ref={mapRef}
      onDragStart={() => setIsClickOutsideDisabled(true)}
      onDragEnd={() => setIsClickOutsideDisabled(false)}
    >
      {venues.map(({ coordinates: { lat, lon: lng }, id }) => (
        <Marker
          key={id}
          position={{ lat, lng }}
          icon={{
            url:
              id === selectedOrHoveredVenueId
                ? venueIconActive
                : venueIconInactive,
            scaledSize: new window.google.maps.Size(
              MARKER_SIZE.SMALL,
              MARKER_SIZE.SMALL
            ),
          }}
          onClick={() => {
            setSelectedVenueId(id)
          }}
        />
      ))}
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
      {selectedVenue && (
        <InfoWindow
          position={{
            lat: selectedVenue.coordinates.lat,
            lng: selectedVenue.coordinates.lon,
          }}
          options={{
            pixelOffset: new window.google.maps.Size(
              PIXEL_OFFSET.MARKER.X,
              PIXEL_OFFSET.MARKER.Y
            ),
          }}
        >
          <OutsideClickHandler
            onOutsideClick={() => {
              setSelectedVenueId(null)
            }}
            disabled={isClickOutsideDisabled}
          >
            <InfoWindowContent
              getDetailUrlByVenueId={getDetailUrlByVenueId}
              {...selectedVenue}
            />
          </OutsideClickHandler>
        </InfoWindow>
      )}
      {directionsToSelectedOrClickedVenue &&
        directionsToSelectedOrClickedVenue.map((direction, i) => (
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
  venues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lon: PropTypes.number.isRequired,
      }).isRequired,
      airportsCoordinates: PropTypes.arrayOf(
        PropTypes.shape({
          lat: PropTypes.number.isRequired,
          lon: PropTypes.number.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired
  ).isRequired,
  hoveredVenueId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  airports: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lon: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
  getDetailUrlByVenueId: PropTypes.func.isRequired,
  isDomesticDestination: PropTypes.bool,
}

export default withScriptjs(withGoogleMap(MapContainer))
