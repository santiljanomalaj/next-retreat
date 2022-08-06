import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { hotjar } from 'react-hotjar'
import { Cookies } from 'react-cookie-consent'
import { toast } from 'react-toastify'
import Drift from 'react-driftjs'
import {ErrorBoundary} from 'react-error-boundary'
import { theme, GlobalStyles } from 'Theme'
import ROUTES from 'constants/routes'
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from 'constants/constants'
import NotFound from 'routes/NotFound'
import InternalServerError from "./routes/InternalServerError"
import Plan from 'routes/Plan'
import Account from 'routes/Account'
import Terms from 'routes/Terms'
import Trip from 'routes/Trip'
import TripShared from 'routes/TripShared'
import CurrencyProvider from 'CurrencyProvider'
import AuthProvider from 'AuthProvider'
import TripManagementProvider from 'TripManagementProvider'
import ConsentBar from 'sharedComponents/ConsentBar'
import TripManagementModals from 'sharedComponents/TripManagement/TripManagementModals'
import ToastContainer from 'components/ToastContainer'
import { useGoogleTracking, GTM_EVENTS } from './hooks/useGoogleTracking'

const COOKIE_CONSENT_NAME = 'CookieConsent'

const ALLOWED_ERRORS = [
  'InternalError',
  'ValidationError',
  'NotFoundError',
  'AuthError',
]

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)
  return {
    headers: {
      ...headers,
      'x-auth-token': token || '',
    },
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError) {
    toast.error('Error ocurred')
  }
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, name }) => {
      if (name && ALLOWED_ERRORS.includes(name)) {
        return toast.error(message)
      }
      return toast.error('Error ocurred')
    })
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    authLink,
    errorLink,
    createUploadLink({
      uri: process.env.REACT_APP_API_URL,
    }),
  ]),
  fetchOptions: {
    mode: 'no-cors',
  }
})

const registerDriftEvents = (logGTMEvent) => {
  if (window.drift) {
    window.drift.on('startConversation', function() {
      logGTMEvent({ event: GTM_EVENTS.chatConversationStarted })
    })
    window.drift.on('message:sent', function() {
      logGTMEvent({ event: GTM_EVENTS.chatMessageSent })
    })
    window.drift.on('message', function() {
      logGTMEvent({ event: GTM_EVENTS.chatMessageReceived })
    })
    window.drift.on('conversation:firstInteraction', function() {
      logGTMEvent({ event: GTM_EVENTS.chatFirstInteraction })
    })
  }
}

const ErrorFallback = ({error, resetErrorBoundary}) => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <InternalServerError />
      </ThemeProvider>
    </Router>
  )
}

const App = () => {
  const [hasConsent, setHasConsent] = React.useState(
    Cookies.get(COOKIE_CONSENT_NAME)
  )
  const { logGTMEvent } = useGoogleTracking()

  React.useEffect(() => {
    registerDriftEvents(logGTMEvent)
  }, [logGTMEvent])

  React.useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty(
        '--nr-100vh',
        `${window.innerHeight}px`
      )
    }

    window.addEventListener('resize', handleResize)
    document.documentElement.style.setProperty(
      '--nr-100vh',
      `${window.innerHeight}px`
    )

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  React.useEffect(() => {
    const hotjarID = process.env.REACT_APP_HOTJAR_ID
    if (hotjarID !== undefined && hasConsent) {
      hotjar.initialize(hotjarID, 6)
    }
  }, [hasConsent])

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ApolloProvider client={client}>
          <Router>
            <CurrencyProvider>
              <AuthProvider>
                <TripManagementProvider>
                  <ThemeProvider theme={theme}>
                    <GlobalStyles />
                    <ConsentBar
                      cookieName={COOKIE_CONSENT_NAME}
                      onAccept={() => {
                        setHasConsent(true)
                      }}
                    />
                    <TripManagementModals />
                    <ToastContainer />
                    <Switch>
                      <Redirect exact from="/" to={`/${ROUTES.PLAN}/`} />
                      <Route path={`/${ROUTES.PLAN}/`} component={Plan} />
                      <Route path={`/${ROUTES.ACCOUNT}/`} component={Account} />
                      <Route path={`/${ROUTES.TERMS}/`} component={Terms} />
                      <Route
                        path={`/${ROUTES.TRIP_SHARED}/:shareToken`}
                        component={TripShared}
                      />
                      <Route path={`/${ROUTES.TRIP}/:id`} component={Trip} />
                      <Route path={'/internal-server-error'} component={InternalServerError} />
                      <Route component={NotFound} />
                    </Switch>
                    <Drift appId={process.env.DRIFT_ID || 'vwb78yhmah4e'} />
                  </ThemeProvider>
                </TripManagementProvider>
              </AuthProvider>
            </CurrencyProvider>
          </Router>
        </ApolloProvider>
      </ErrorBoundary>
    </>
  )
}

export default App
