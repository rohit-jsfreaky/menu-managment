import { StatusCodes } from 'http-status-codes';

import { errorResponse } from '../utils/response.js';

const validationOptions = {
  abortEarly: false,
  stripUnknown: true,
  convert: true
};

export const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    if (!schema) {
      return next();
    }

    const data = req[property];
    const { value, error } = schema.validate(data, validationOptions);

    if (error) {
      const formattedErrors = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path.join('.')
      }));

      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse('Validation failed.', formattedErrors));
    }

    req[property] = value;
    return next();
  };
};
