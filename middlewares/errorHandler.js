import { StatusCodes } from 'http-status-codes';

import { errorResponse } from '../utils/response.js';

// Centralized error handler to maintain consistent error responses
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'An unexpected error occurred.';
  const errors = err.errors || undefined;

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return res.status(statusCode).json(errorResponse(message, errors));
};
