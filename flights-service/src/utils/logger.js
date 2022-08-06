const { createLogger, format, transports } = require('winston')
const monitoring = require('./monitoring')

const formatData = (item) =>
  item.data ? ` - ${JSON.stringify(item.data)}` : ''
const formatError = (item) => (item.error ? ` - ${item.error}` : '')

const initLogger = () =>
  createLogger({
    level: 'debug',
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      // eslint-disable-next-line prettier/prettier
      format.printf(
        (item) =>
          `${item.timestamp} [${item.level}]: ${item.message}${formatData(
            item
          )}${formatError(item)}`
      )
    ),
    transports: [new transports.Console()],
  })

const logger = initLogger()

module.exports = {
  debug: (...args) => logger.debug(...args),
  info: (...args) => logger.info(...args),
  warn: (...args) => logger.warn(...args),
  error: (message, error, { isCaptureExceptionDisabled = false } = {}) => {
    logger.error(message, { error })
    if (!isCaptureExceptionDisabled) {
      monitoring.captureException(error)
    }
  },
}
