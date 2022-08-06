require('dotenv').config()
const { GraphQLServer } = require('graphql-yoga')
const {
  isInstance: isApolloErrorInstance,
  formatError: formatApolloError,
} = require('apollo-errors')
const monitoring = require('./utils/monitoring')
const logger = require('./utils/logger')
const db = require('./utils/db')
const { InternalError } = require('./utils/graphqlErrors')
const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')

const port = process.env.PORT

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  middlewares: [monitoring.middleware],
  context: (request) => request,
})

db.init(server.express)

function formatError(error) {
  if (
    process.env.NODE_ENV !== 'development' &&
    !isApolloErrorInstance(error.originalError)
  ) {
    logger.error('formatError:originalError', error.originalError, {
      isCaptureExceptionDisabled: true,
    })
    return formatApolloError(new InternalError())
  }
  return formatApolloError(error)
}

server.start(
  { port, formatError, tracing: process.env.NODE_ENV === 'development' },
  () => {
    logger.info(`Server is running on ${port} port.`)
  }
)
