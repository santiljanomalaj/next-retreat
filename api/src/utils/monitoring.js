const Sentry = require('@sentry/node')
const { sentry } = require('graphql-middleware-sentry')
const { isInstance: isApolloErrorInstance } = require('apollo-errors')

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT,
  })
}

const captureException = (error, userId) => {
  Sentry.configureScope((scope) => {
    if (userId) {
      scope.setUser({ id: userId })
    }
    Sentry.captureException(error)
  })
}

const middleware = sentry({
  sentryInstance: Sentry,
  forwardErrors: true,
  reportError: (error) => !isApolloErrorInstance(error),
  withScope: (scope, error, { request }) => {
    scope.setExtra('body', request.body)
    scope.setExtra('origin', request.headers.origin)
    scope.setExtra('user-agent', request.headers['user-agent'])
  },
})

module.exports = {
  captureException,
  middleware,
}
