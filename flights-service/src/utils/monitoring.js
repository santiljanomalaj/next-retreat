const Sentry = require('@sentry/node')

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT,
  })
}

const captureException = (error) => {
  Sentry.configureScope((scope) => {
    Sentry.captureException(error)
  })
}

module.exports = {
  captureException,
}
