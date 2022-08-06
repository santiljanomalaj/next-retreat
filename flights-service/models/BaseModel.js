const { Model, ValidationError: ValidationErrorType } = require('objection')

const handleError = (error) => {
  if (error instanceof ValidationErrorType) {
    throw new Error({
      message: error.message,
      type: error.type,
      data: error.data,
    })
  }
  throw error
}

class BaseModel extends Model {
  static query(...rest) {
    return super.query.apply(this, rest).onError(handleError)
  }
}

module.exports = BaseModel
