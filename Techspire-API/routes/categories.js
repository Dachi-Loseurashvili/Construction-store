import express from 'express';
const router = express.Router();
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/CategoryController.js';
import { protect, admin } from '../middlewares/auth.js';

// PUBLIC: Get all categories
router.get('/', getAllCategories);

// PROTECTED: Admin only
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
