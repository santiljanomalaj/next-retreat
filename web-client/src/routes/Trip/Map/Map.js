import React from 'react'
import PropTypes from 'prop-types'
import { withGoogleMap, withScriptjs, GoogleMap } from 'react-google-maps'
import MarkerWithLabel from 'react-google-maps/lib/components/addons/MarkerWithLabel'
import { COLORS, fontSizes } from 'Theme'
import { extendBoundsByOffset } from 'utils/map'
import { MAP_SETTINGS } from 'constants/constants'
import circleActiveIcon from 'assets/images/svg/circle-active.svg'
import circleIcon from 'assets/images/svg/circle.svg'
import style from './mapStyles.json'

const { DEFAULT_ZOOM, DEFAULT_CENTER, DEFAULT_MAP_OPTIONS } = MAP_SETTINGS

const DEFAULT_MARKET_SIZE = 20
const ACTIVE_MARKER_SIZE = 50

const Map = ({ venues, activeVenueId, setActiveVenue }) => {
  const mapRef = React.useRef(null)

  React.useEffect(() => {
    const bounds = new window.google.maps.LatLngBounds()
    venues.forEach(({ coordinates: { lat, lon } }) => {
      bounds.extend(new window.google.maps.LatLng(lat, lon))
    })
    // Prevent maximum zoom for 1 item selected
    if (venues.length === 1) {
      extendBoundsByOffset(bounds, 0.1)
    }
    mapRef.current.fitBounds(bounds)
  }, [venues])

  return (
    <GoogleMap
      defaultZoom={DEFAULT_ZOOM}
      defaultCenter={DEFAULT_CENTER}
      defaultOptions={{ ...DEFAULT_MAP_OPTIONS, styles: style }}
      ref={mapRef}
    >
      {venues.map((venue, index) => {
        const {
          id,
          coordinates: { lat, lon: lng },
        } = venue
        const isActive = id === activeVenueId
        return (
          <MarkerWithLabel
            key={id}
            position={{ lat, lng }}
            labelAnchor={
              new window.google.maps.Point(
                0,
                (isActive ? ACTIVE_MARKER_SIZE : DEFAULT_MARKET_SIZE) / 2
              )
            }
            labelStyle={{
              color: COLORS.WHITE,
              fontSize: fontSizes.s,
              transform: 'translate(-50%, -50%)',
            }}
            icon={{
              url: isActive ? circleActiveIcon : circleIcon,
              scaledSize: isActive
                ? new window.google.maps.Size(
                    ACTIVE_MARKER_SIZE,
                    ACTIVE_MARKER_SIZE
                  )
                : new window.google.maps.Size(
                    DEFAULT_MARKET_SIZE,
                    DEFAULT_MARKET_SIZE
                  ),
            }}
            onClick={() => {
              setActiveVenue(venue)
            }}
          >
            <span>{index + 1}</span>
          </MarkerWithLabel>
        )
      })}
    </GoogleMap>
  )
}

Map.propTypes = {
  venues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lon: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
  activeVenueId: PropTypes.string,
  setActiveVenue: PropTypes.func.isRequired,
}

export default withScriptjs(withGoogleMap(Map))
