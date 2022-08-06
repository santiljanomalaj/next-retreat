import React from 'react'
import PropTypes from 'prop-types'
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
  DirectionsRenderer,
} from 'react-google-maps'
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel'
import { space, fontWeights, fontSizes, COLORS } from 'Theme'
import { MAP_SETTINGS } from 'constants/constants'
import { scrollIntoView, getScrollName } from 'utils/scroll'
import dotIcon from 'assets/images/dot-marker.png'
import destinationIconInactive from 'assets/images/destination-marker-inactive.png'
import destinationIconActive from 'assets/images/destination-marker-active.png'
import { delay, directionsRequest } from 'routes/Plan/mapHelpers'
import style from './mapStyles.json'
import InfoWindowContent from './InfoWindow'
import { TRAVEL_TYPES } from '../constants'

const labelStyle = {
  color: '#616161',
  padding: `0 ${space.s}`,
  fontWeight: fontWeights.bold,
  fontSize: fontSizes.s,
  letterSpacing: 0,
  textShadow: `
    0 0.1em ${COLORS.WHITE},
    0.1em 0 ${COLORS.WHITE},
    0 -0.1em ${COLORS.WHITE},
    -0.1em 0 ${COLORS.WHITE}`,
  transform: 'translateX(-50%)',
}

const {
  DEFAULT_ZOOM,
  DEFAULT_CENTER,
  DEFAULT_MAP_OPTIONS,
  MARKER_SIZE,
  PIXEL_OFFSET,
  POLYLINE_OPTIONS,
  DIRECTIONS_OPTIONS,
} = MAP_SETTINGS

const getLatLngForPolyline = ({ origin, destination }) => [
  { lat: origin.lat, lng: origin.lon },
  { lat: destination.lat, lng: destination.lon },
]

const getGeodesicLineCenter = ({ origin, destination }) =>
  window.google.maps.geometry.spherical.interpolate(
    new window.google.maps.LatLng(origin.lat, origin.lon),
    new window.google.maps.LatLng(destination.lat, destination.lon),
    1 / 2
  )

const getCenterPositionOfDirection = (direction, index) => {
  const { overview_path: overviewPath } = direction[index].routes[0]
  return overviewPath[Math.floor(overviewPath.length / 2)]
}

const Map = ({
  destinations,
  originLocations,
  hoveredDestinationId,
  swipedDestinationId,
  setSwipedDestinationId,
}) => {
  const [clickedDestinationId, setClickedDestinationId] = React.useState(null)
  const [directions, setDirections] = React.useState({})
  const mapRef = React.useRef(null)

  React.useEffect(() => {
    if (hoveredDestinationId || swipedDestinationId) {
      setClickedDestinationId(null)
    }
  }, [hoveredDestinationId, swipedDestinationId])

  const selectedDestination = destinations.find(
    ({ id }) =>
      swipedDestinationId === id ||
      clickedDestinationId === id ||
      hoveredDestinationId === id
  )
  const { isDomestic, id: selectedDestinationId } = selectedDestination ?? {}
  const selectedDestinationDirections = directions[selectedDestinationId]

  React.useEffect(() => {
    const bounds = new window.google.maps.LatLngBounds()
    destinations.forEach(({ coordinates: { lat, lon } }) => {
      bounds.extend(new window.google.maps.LatLng(lat, lon))
    })
    originLocations.forEach(({ coordinates: { lat, lon } }) => {
      bounds.extend(new window.google.maps.LatLng(lat, lon))
    })
  }, [destinations, originLocations])

  React.useEffect(() => {
    if (isDomestic && !selectedDestinationDirections) {
      const DirectionsService = new window.google.maps.DirectionsService()
      const fetchDirections = async () => {
        const { coordinates } = selectedDestination
        const filteredOriginLocations = selectedDestination.travelDurations?.filter(
          ({ type }) => type === TRAVEL_TYPES.DRIVING
        )
        const tempDirectionsToVenue = []

        // eslint-disable-next-line no-restricted-syntax
        for (const location of filteredOriginLocations) {
          // eslint-disable-next-line no-await-in-loop
          const direction = await directionsRequest({
            DirectionsService,
            origin: {
              lat: location.coordinates.lat,
              lon: location.coordinates.lon,
            },
            destination: { lat: coordinates.lat, lon: coordinates.lon },
          })

          // eslint-disable-next-line no-await-in-loop
          await delay(300)
          tempDirectionsToVenue.push(direction)
        }
        setDirections((prevState) => ({
          ...prevState,
          [selectedDestinationId]: tempDirectionsToVenue,
        }))
      }
      fetchDirections()
    }
  }, [
    isDomestic,
    originLocations,
    selectedDestination,
    selectedDestinationId,
    selectedDestinationDirections,
  ])

  const durationBadgeOptions = {
    pixelOffset: new window.google.maps.Size(
      PIXEL_OFFSET.LINE.X,
      PIXEL_OFFSET.LINE.Y
    ),
  }

  return (
    <GoogleMap
      defaultZoom={DEFAULT_ZOOM}
      defaultCenter={DEFAULT_CENTER}
      defaultOptions={{ ...DEFAULT_MAP_OPTIONS, styles: style }}
      ref={mapRef}
    >
      {originLocations.map(({ id, name, coordinates: { lat, lon: lng } }) => (
        <MarkerWithLabel
          key={id}
          position={{ lat, lng }}
          labelAnchor={new window.google.maps.Point(0, 0)}
          labelStyle={labelStyle}
          icon={{
            url: dotIcon,
            scaledSize: new window.google.maps.Size(
              MARKER_SIZE.EXTRA_SMALL,
              MARKER_SIZE.EXTRA_SMALL
            ),
          }}
        >
          <span>{name}</span>
        </MarkerWithLabel>
      ))}
      {destinations.map(({ coordinates: { lat, lon: lng }, id }) => (
        <Marker
          key={id}
          position={{ lat, lng }}
          icon={{
            url:
              id === selectedDestinationId
                ? destinationIconActive
                : destinationIconInactive,
            scaledSize: new window.google.maps.Size(
              MARKER_SIZE.SMALL,
              MARKER_SIZE.SMALL
            ),
          }}
          onClick={() => {
            setClickedDestinationId(id)
            setSwipedDestinationId(id)
            scrollIntoView(getScrollName(id), -130)
          }}
        />
      ))}
      {selectedDestination?.travelDurations
        .filter(({ type }) =>
          [
            TRAVEL_TYPES.FLIGHT,
            TRAVEL_TYPES.UNAVAILABLE,
            TRAVEL_TYPES.NONE,
          ].includes(type)
        )
        .map(({ type, originLocation, coordinates, duration }) => (
          <React.Fragment key={originLocation}>
            <Polyline
              path={getLatLngForPolyline({
                origin: coordinates,
                destination: selectedDestination.coordinates,
              })}
              options={
                [TRAVEL_TYPES.FLIGHT, TRAVEL_TYPES.NONE].includes(type)
                  ? POLYLINE_OPTIONS.REGULAR
                  : POLYLINE_OPTIONS.DASHED
              }
            />
            {[TRAVEL_TYPES.FLIGHT, TRAVEL_TYPES.UNAVAILABLE].includes(type) && (
              <InfoWindow
                position={getGeodesicLineCenter({
                  origin: coordinates,
                  destination: selectedDestination.coordinates,
                })}
                options={durationBadgeOptions}
              >
                <InfoWindowContent
                  travelTimeInMinutes={duration}
                  isDirectionAvailable={Boolean(duration)}
                />
              </InfoWindow>
            )}
          </React.Fragment>
        ))}
      {selectedDestinationDirections &&
        selectedDestination.travelDurations
          .filter(({ type }) => type === TRAVEL_TYPES.DRIVING)
          .map(({ originLocation, duration }, i) => {
            const drivingBadgePosition = getCenterPositionOfDirection(
              selectedDestinationDirections,
              i
            )

            return (
              <InfoWindow
                key={originLocation}
                position={drivingBadgePosition}
                options={durationBadgeOptions}
              >
                <InfoWindowContent
                  bgColor={COLORS.CHUN_LI_BLUE}
                  travelTimeInMinutes={duration}
                  isDirectionAvailable
                />
              </InfoWindow>
            )
          })}

      {selectedDestinationDirections?.map((direction, i) => (
        <DirectionsRenderer
          key={i}
          directions={direction}
          options={DIRECTIONS_OPTIONS}
        />
      ))}
    </GoogleMap>
  )
}

Map.propTypes = {
  destinations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lon: PropTypes.number.isRequired,
      }).isRequired,
      flightDurations: PropTypes.arrayOf(
        PropTypes.shape({
          originLocation: PropTypes.string.isRequired,
          duration: PropTypes.number.isRequired,
        })
      ),
    }).isRequired
  ).isRequired,
  originLocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lon: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
  swipedDestinationId: PropTypes.string,
  hoveredDestinationId: PropTypes.string,
  setSwipedDestinationId: PropTypes.func.isRequired,
}

export default withScriptjs(withGoogleMap(Map))
