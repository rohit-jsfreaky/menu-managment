import { StatusCodes } from 'http-status-codes';

import { errorResponse } from '../utils/response.js';

export const notFoundHandler = (req, res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json(errorResponse('The requested resource was not found.'));
};
