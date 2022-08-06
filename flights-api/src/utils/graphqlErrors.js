const { createError } = require('apollo-errors')

const InternalError = createError('InternalError', {
  message: 'Something went wrong',
})

const ValidationError = createError('ValidationError', {
  message: 'Invalid request',
})

const NotFoundError = createError('ValidationError', {
  message: 'Resource not found',
})

module.exports = {
  InternalError,
  ValidationError,
  NotFoundError,
}
