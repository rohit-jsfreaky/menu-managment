import { StatusCodes } from 'http-status-codes';

import { errorResponse } from '../utils/response.js';

// Centralized error handler to maintain consistent error responses
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'An unexpected error occurred.';
  const errors = err.errors || undefined;

  const shouldLog =
    process.env.NODE_ENV !== 'production' || process.env.ENABLE_API_LOGS === 'true';

  if (shouldLog) {
    console.error('[Error Handler]', {
      method: req.method,
      url: req.originalUrl,
      statusCode,
      message,
      errors,
      stack: err.stack
    });
  }

  return res.status(statusCode).json(errorResponse(message, errors));
};
