const { createError } = require('apollo-errors')

const InternalError = createError('InternalError', {
  message: 'Something went wrong',
})

const ValidationError = createError('ValidationError', {
  message: 'Invalid request',
})

const NotFoundError = createError('NotFoundError', {
  message: 'Resource not found',
})

const AuthError = createError('AuthError', {
  message: 'Unauthorized',
})

module.exports = {
  InternalError,
  ValidationError,
  NotFoundError,
  AuthError,
}
