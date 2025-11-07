import Joi from 'joi';

import { objectIdSchema } from './common.validation.js';

const taxSchema = Joi.number().min(0);

const baseCategorySchema = {
  name: Joi.string().trim().min(2).max(120),
  image: Joi.string().uri().trim().optional(),
  description: Joi.string().trim().allow('', null).optional(),
  taxApplicability: Joi.boolean().optional(),
  tax: taxSchema.optional(),
  taxType: Joi.string().trim().max(120).allow('', null).optional()
};

export const createCategorySchema = Joi.object({
  ...baseCategorySchema,
  name: baseCategorySchema.name.required(),
  taxApplicability: Joi.boolean().default(false),
  tax: taxSchema.when('taxApplicability', {
    is: true,
    then: taxSchema.required(),
    otherwise: taxSchema.default(0)
  })
});

export const updateCategorySchema = Joi.object(baseCategorySchema)
  .min(1)
  .keys({
    tax: taxSchema.when('taxApplicability', {
      is: true,
      then: taxSchema.required(),
      otherwise: taxSchema.optional()
    })
  });

export const categoryIdParamSchema = Joi.object({
  categoryId: objectIdSchema.required()
});

export const categoryDetailQuerySchema = Joi.object({
  id: objectIdSchema.optional(),
  name: Joi.string().trim().optional()
})
  .or('id', 'name')
  .messages({
    'object.missing': 'Either id or name is required.'
  });
