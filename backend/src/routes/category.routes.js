import express from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', authorize('ADMIN'), validate(createCategorySchema), createCategory);
router.put('/:id', authorize('ADMIN'), validate(updateCategorySchema), updateCategory);
router.delete('/:id', authorize('ADMIN'), deleteCategory);

export default router;
