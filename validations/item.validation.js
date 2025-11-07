import Joi from 'joi';

import { objectIdSchema } from './common.validation.js';

const monetarySchema = Joi.number().precision(2).min(0);

const baseItemSchema = {
  name: Joi.string().trim().min(2).max(120),
  image: Joi.string().uri().trim().optional(),
  description: Joi.string().trim().allow('', null).optional(),
  taxApplicability: Joi.boolean().optional(),
  tax: monetarySchema.optional(),
  baseAmount: monetarySchema.optional(),
  discount: monetarySchema.optional(),
  totalAmount: monetarySchema.optional()
};

export const createItemSchema = Joi.object({
  categoryId: objectIdSchema.required(),
  subCategoryId: objectIdSchema.allow(null).optional(),
  ...baseItemSchema,
  name: baseItemSchema.name.required(),
  taxApplicability: Joi.boolean().optional(),
  tax: monetarySchema.optional(),
  baseAmount: monetarySchema.required(),
  discount: monetarySchema.default(0),
  totalAmount: monetarySchema.optional()
});

export const updateItemSchema = Joi.object(baseItemSchema)
  .keys({
    subCategoryId: objectIdSchema.allow(null).optional(),
    categoryId: objectIdSchema.optional()
  })
  .min(1);

export const itemIdParamSchema = Joi.object({
  itemId: objectIdSchema.required()
});

export const categoryIdParamSchema = Joi.object({
  categoryId: objectIdSchema.required()
});

export const subCategoryIdParamSchema = Joi.object({
  subCategoryId: objectIdSchema.required()
});

export const itemDetailQuerySchema = Joi.object({
  id: objectIdSchema.optional(),
  name: Joi.string().trim().optional()
})
  .or('id', 'name')
  .messages({
    'object.missing': 'Either id or name is required.'
  });

export const searchItemQuerySchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  limit: Joi.number().integer().min(1).max(100).default(20)
});
