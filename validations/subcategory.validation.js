import Joi from 'joi';

import { objectIdSchema } from './common.validation.js';

const taxSchema = Joi.number().min(0);

const baseSubCategorySchema = {
  name: Joi.string().trim().min(2).max(120),
  image: Joi.string().uri().trim().optional(),
  description: Joi.string().trim().allow('', null).optional(),
  taxApplicability: Joi.boolean().optional(),
  tax: taxSchema.optional()
};

export const createSubCategorySchema = Joi.object({
  categoryId: objectIdSchema.required(),
  ...baseSubCategorySchema,
  name: baseSubCategorySchema.name.required(),
  taxApplicability: Joi.boolean().optional(),
  tax: taxSchema.optional()
});

export const updateSubCategorySchema = Joi.object(baseSubCategorySchema)
  .min(1)
  .keys({
    tax: taxSchema.when('taxApplicability', {
      is: true,
      then: taxSchema.required(),
      otherwise: taxSchema.optional()
    })
  });

export const subCategoryIdParamSchema = Joi.object({
  subCategoryId: objectIdSchema.required()
});

export const categoryIdParamSchema = Joi.object({
  categoryId: objectIdSchema.required()
});

export const subCategoryDetailQuerySchema = Joi.object({
  id: objectIdSchema.optional(),
  name: Joi.string().trim().optional(),
  categoryId: objectIdSchema.optional()
})
  .or('id', 'name')
  .messages({
    'object.missing': 'Either id or name is required.'
  });
