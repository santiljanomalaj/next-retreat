const { Model, ValidationError: ValidationErrorType } = require('objection')
const { ValidationError } = require('../utils/graphqlErrors')

const handleError = (error) => {
  if (error instanceof ValidationErrorType) {
    throw new ValidationError({ message: error.message })
  } else if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    throw new ValidationError({
      message:
        'Cannot delete or update, some other model is using this row as a reference.',
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
