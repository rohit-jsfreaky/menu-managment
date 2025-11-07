import Joi from 'joi';

export const objectIdSchema = Joi.string()
  .hex()
  .length(24)
  .message('Must be a valid 24-character hex string.');
