import { COLORS } from 'Theme'

export const GOOGLE_MAP_URL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&language=en&key=${process.env.REACT_APP_GOOGLE_KEY}`

export const MAP_SETTINGS = {
  DEFAULT_MAP_OPTIONS: {
    scrollwheel: false,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  },
  DEFAULT_CENTER: { lat: 57, lng: 20 },
  DEFAULT_ZOOM: 4,
  MARKER_SIZE: {
    EXTRA_SMALL: 10,
    SMALL: 30,
    MEDIUM: 40,
  },
  PIXEL_OFFSET: {
    MARKER: {
      X: 0,
      Y: -35,
    },
    LINE: {
      X: 0,
      Y: 20,
    },
  },
  POLYLINE_OPTIONS: {
    DASHED: {
      geodesic: true,
      strokeOpacity: 0,
      strokeWeight: 2,
      strokeColor: COLORS.BLUEBERRY_SODA,
      icons: [
        {
          icon: {
            path: 'M 0,0 0,1',
            strokeOpacity: 1,
            strokeWeight: 2,
            scale: 3,
          },
          offset: '0',
          repeat: '10px',
        },
      ],
    },
    REGULAR: {
      geodesic: true,
      strokeOpacity: 1,
      strokeWeight: 2,
      strokeColor: COLORS.EXPLORATION_GREEN,
    },
  },
  DIRECTIONS_OPTIONS: { suppressMarkers: true, preserveViewport: true },
}

export const PHONE_REGEX = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

export const LOCAL_STORAGE_ACCESS_TOKEN_KEY = 'accessToken'
export const LOCAL_STORAGE_CURRENCY_KEY = 'nr-currency'
export const DEFAULT_CURRENCY_ISO_CODE = 'EUR'
export const DEFAULT_CURRENCY_SYMBOL = '€'
export const ENABLED_CURRENCIES = ['EUR', 'GBP', 'USD']
