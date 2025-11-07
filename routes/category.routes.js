import { Router } from 'express';

import {
  createCategory,
  getAllCategories,
  getCategoryDetails,
  updateCategory
} from '../controllers/category.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  categoryDetailQuerySchema,
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema
} from '../validations/category.validation.js';

const router = Router();

router.post('/', validateRequest(createCategorySchema), createCategory);
router.get('/', getAllCategories);
router.get('/detail', validateRequest(categoryDetailQuerySchema, 'query'), getCategoryDetails);
router.patch(
  '/:categoryId',
  validateRequest(categoryIdParamSchema, 'params'),
  validateRequest(updateCategorySchema),
  updateCategory
);

export default router;
