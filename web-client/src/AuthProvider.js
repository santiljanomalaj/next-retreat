import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, useHistory } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import queryString from 'query-string'
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from 'constants/constants'
import { useGoogleTracking, GTM_EVENTS } from './hooks/useGoogleTracking'
// import initHelpHero from 'helphero';

// const hlp = initHelpHero(process.env.HELPHERO_ID || 'klwY9nM9yF');

const GET_USER_ME = gql`
  query UserMe {
    userMe {
      trips {
        id
        name
        heroUrl
        logoUrl
        tripVenues {
          id
          venue {
            id
            thumbnailUrls(limit: 1)
            title
            destination
            countryCode
          }
        }
      }
      sharedTrips {
        id
        trips {
          id
          name
          logoUrl
          heroUrl
          tripVenues {
            id
            venue {
              id
              thumbnailUrls(limit: 1)
              title
              destination
              countryCode
            }
          }
        }
      }
    }
  }
`

const LOGIN = gql`
query UserMe {
  userMe {
    id
    email
  }
}
`

export const AuthContext = React.createContext({
  user: null,
  userTrips: [],
  data:[],
  isSignedIn: false,
  signOut: () => {},
  isFirstTripModalOpened: false,
  setIsFirstTripModalOpened: () => {},
  refetchData: async () => {},
  isSigningIn: false,
})

export const useAuth = () => React.useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const history = useHistory()
  const { search } = useLocation()
  const { logGTMEvent } = useGoogleTracking()
  const { token: urlAccessToken, ...urlSearchParams } = queryString.parse(
    search
  )
  const [isSignedInFromUrlToken, setIsSignedInFromUrlToken] = React.useState(
    false
  )
  const [isFirstTripModalOpened, setIsFirstTripModalOpened] = React.useState(
    false
  )
  const [accessToken, setAccessToken] = React.useState(() => {
    const storageAccessToken = localStorage.getItem(
      LOCAL_STORAGE_ACCESS_TOKEN_KEY
    )
    if (urlAccessToken && storageAccessToken !== urlAccessToken) {
      try {
        localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, urlAccessToken)
      } catch {
        // do nothing
      }
    }
    return urlAccessToken || storageAccessToken
  })

  const { data : loginData, loading : loginLoading } = useQuery(LOGIN, {
    skip: !accessToken,
    onCompleted: (response) => {
      if(window.drift){
        window.drift.identify(response?.userMe?.id, { 
          email: response?.userMe?.email
        })
      }
      logGTMEvent({event: GTM_EVENTS.marketingDataPush, uid: response?.userMe?.id})
    },
    fetchPolicy: 'no-cache',
  })


  const { data, refetch, loading } = useQuery(GET_USER_ME, {
    skip: !accessToken,
    onCompleted: (response) => {
      setIsFirstTripModalOpened(
        isSignedInFromUrlToken && response?.userMe?.trips?.length === 0
      )
    },
    fetchPolicy: 'no-cache',
  })

  React.useEffect(() => {
    if (urlAccessToken) {
      if (accessToken !== urlAccessToken) {
        try {
          localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, urlAccessToken)
        } catch {
          // do nothing
        }
        setAccessToken(urlAccessToken)
      }
      setIsSignedInFromUrlToken(true)
      logGTMEvent({event: GTM_EVENTS.appVisit})
      history.replace({
        search: queryString.stringify(urlSearchParams),
      })
    }
  }, [urlAccessToken, accessToken, history, urlSearchParams, logGTMEvent])

  const signOut = React.useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)
    setAccessToken(null)
  }, [])

  const contextValue = React.useMemo(
    () => {
      return {
      user: loginData?.userMe,
      userTrips : data?.userMe?.trips || [],
      isSignedIn: !!accessToken && !!loginData?.userMe,
      signOut,
      data: data || [],
      isFirstTripModalOpened,
      setIsFirstTripModalOpened,
      refetchData: refetch,
      isSigningIn: loginLoading,
      areTripsLoading: loading
    }},
    [
      accessToken,
      data,
      signOut,
      isFirstTripModalOpened,
      setIsFirstTripModalOpened,
      refetch,
      loading,
      loginLoading,
      loginData,
    ]
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthProvider
