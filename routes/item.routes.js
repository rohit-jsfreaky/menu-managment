import { Router } from 'express';

import {
  createItem,
  getAllItems,
  getItemsByCategory,
  getItemsBySubCategory,
  getItemDetails,
  updateItem,
  searchItems
} from '../controllers/item.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  categoryIdParamSchema,
  createItemSchema,
  itemDetailQuerySchema,
  itemIdParamSchema,
  searchItemQuerySchema,
  subCategoryIdParamSchema,
  updateItemSchema
} from '../validations/item.validation.js';

const router = Router();

router.post('/', validateRequest(createItemSchema), createItem);
router.get('/', getAllItems);
router.get('/search', validateRequest(searchItemQuerySchema, 'query'), searchItems);
router.get(
  '/category/:categoryId',
  validateRequest(categoryIdParamSchema, 'params'),
  getItemsByCategory
);
router.get(
  '/subcategory/:subCategoryId',
  validateRequest(subCategoryIdParamSchema, 'params'),
  getItemsBySubCategory
);
router.get('/detail', validateRequest(itemDetailQuerySchema, 'query'), getItemDetails);
router.patch(
  '/:itemId',
  validateRequest(itemIdParamSchema, 'params'),
  validateRequest(updateItemSchema),
  updateItem
);

export default router;
