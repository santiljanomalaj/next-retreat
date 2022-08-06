const { AuthError } = require('./utils/graphqlErrors')

const createAuthForRole = (getIsAuthorized) => (
  next,
  source,
  args,
  context
) => {
  if (!getIsAuthorized(context, args)) {
    throw new AuthError()
  }
  return next()
}

const directiveResolvers = {
  isUser: createAuthForRole((context) => context.user),
}

module.exports = {
  directiveResolvers,
}
