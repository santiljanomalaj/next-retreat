require('dotenv').config()
const Knex = require('knex')
const { Model } = require('objection')
const { GraphQLServer } = require('graphql-yoga')
const {
  isInstance: isApolloErrorInstance,
  formatError: formatApolloError,
} = require('apollo-errors')
const dbConfig = require('../config/db')
const monitoring = require('./utils/monitoring')
const logger = require('./utils/logger')
const { InternalError } = require('./utils/graphqlErrors')
const User = require('./models/User')
const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')
const { directiveResolvers } = require('./directives')
const getDataloaders = require('./dataloaders')
const NodeCache = require( "node-cache")
const UsersCache = new NodeCache()

const port = process.env.PORT
const knex = Knex(dbConfig)
Model.knex(knex)

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  middlewares: [monitoring.middleware],
  directiveResolvers,
  context: async (args) => {
    const accessToken = args.request.headers['x-auth-token']
    let user = null
    // this will be replaced with cache
    if (accessToken) {
      user = UsersCache.get(accessToken)
      if(!user){
        user = await User.query().where('is_approved', '=', '1').findOne({ accessToken })
  
        if(user){
          if(user.firstLogin == undefined){
            await User.query().where('id', '=', user.id).update({email: user.email, firstLogin: new Date()})
          }
          UsersCache.set(accessToken, user, 600)
        }
      }
    }
    return { ...args, dataloaders: getDataloaders(), user }
  },
})

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

server.start({ port, formatError }, () => {
  logger.info(`Server is running on ${port} port.`)
})
