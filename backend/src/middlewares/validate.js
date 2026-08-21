import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Validation runner middleware.
 * Checks express-validator results and throws ApiError if invalid.
 * Usage: router.post('/path', [...rules], validate, controller)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    throw ApiError.validationError('Validation failed', formattedErrors);
  }
  next();
};

export default validate;
