import { Router } from 'express';

import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  getSubCategoryDetails,
  updateSubCategory
} from '../controllers/subcategory.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  createSubCategorySchema,
  subCategoryDetailQuerySchema,
  subCategoryIdParamSchema,
  updateSubCategorySchema,
  categoryIdParamSchema
} from '../validations/subcategory.validation.js';

const router = Router();

router.post('/', validateRequest(createSubCategorySchema), createSubCategory);
router.get('/', getAllSubCategories);
router.get(
  '/category/:categoryId',
  validateRequest(categoryIdParamSchema, 'params'),
  getSubCategoriesByCategory
);
router.get('/detail', validateRequest(subCategoryDetailQuerySchema, 'query'), getSubCategoryDetails);
router.patch(
  '/:subCategoryId',
  validateRequest(subCategoryIdParamSchema, 'params'),
  validateRequest(updateSubCategorySchema),
  updateSubCategory
);

export default router;
