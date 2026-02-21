import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { uniqueSlug } from '../utils/slugify.js';

// @desc    Get all categories
// @route   GET /api/categories
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ sortOrder: 1, name: 1 });
  res.json(categories);
});

// @desc    Create a category
// @route   POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
  const { name, parentId, sortOrder } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error('Category name is required');
  }

  // Validate parentId if provided
  if (parentId) {
    const parent = await Category.findById(parentId);
    if (!parent) {
      res.status(400);
      throw new Error('Parent category not found');
    }
    // Enforce two-level hierarchy: parent must be a main category (parentId = null)
    if (parent.parentId !== null) {
      res.status(400);
      throw new Error('Cannot create subcategory under another subcategory (max depth is 2)');
    }
  }

  const slug = await uniqueSlug(name, Category);

  const category = new Category({
    name: name.trim(),
    slug,
    parentId: parentId || null,
    sortOrder: sortOrder || 0
  });

  const created = await category.save();
  res.status(201).json(created);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const { name, parentId, sortOrder } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Validate parentId if changing
  if (parentId !== undefined && parentId !== null) {
    if (parentId === req.params.id) {
      res.status(400);
      throw new Error('Category cannot be its own parent');
    }
    const parent = await Category.findById(parentId);
    if (!parent) {
      res.status(400);
      throw new Error('Parent category not found');
    }
    if (parent.parentId !== null) {
      res.status(400);
      throw new Error('Cannot move category under a subcategory (max depth is 2)');
    }
    // If this category has children, it cannot become a subcategory
    const hasChildren = await Category.findOne({ parentId: req.params.id });
    if (hasChildren) {
      res.status(400);
      throw new Error('Cannot make a main category with subcategories into a subcategory');
    }
  }

  if (name && name !== category.name) {
    category.name = name.trim();
    category.slug = await uniqueSlug(name, Category, category._id);
  }

  if (parentId !== undefined) {
    category.parentId = parentId;
  }

  if (sortOrder !== undefined) {
    category.sortOrder = sortOrder;
  }

  const updated = await category.save();
  res.json(updated);
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check if category has children
  const hasChildren = await Category.findOne({ parentId: req.params.id });
  if (hasChildren) {
    res.status(409);
    throw new Error('Cannot delete category that has subcategories. Delete subcategories first.');
  }

  // Check if any products reference this category
  const hasProducts = await Product.findOne({ categoryId: req.params.id });
  if (hasProducts) {
    res.status(409);
    throw new Error('Cannot delete category that has products. Reassign or delete products first.');
  }

  await category.deleteOne();
  res.json({ message: 'Category deleted' });
});

export {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
