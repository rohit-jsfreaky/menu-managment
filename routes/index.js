import { Router } from 'express';

import categoryRoutes from './category.routes.js';
import subCategoryRoutes from './subcategory.routes.js';
import itemRoutes from './item.routes.js';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/subcategories', subCategoryRoutes);
router.use('/items', itemRoutes);

export default router;
