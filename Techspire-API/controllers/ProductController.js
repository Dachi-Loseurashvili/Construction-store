import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { uniqueSlug } from '../utils/slugify.js';

// Normalize brand for filtering (Unicode-safe)
function normalizeBrandKey(brand) {
  return (brand || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
}

// @desc    Fetch all products with optional filtering
// @route   GET /api/products
const getAllProducts = asyncHandler(async (req, res) => {
  const { categoryId, brand, minPrice, maxPrice, inStock, q, page, limit, sort } = req.query;

  const filter = {};

  // Category filter: if main category, expand to subcategory IDs
  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (category) {
      if (category.parentId === null) {
        // Main category: find all subcategories
        const subcategories = await Category.find({ parentId: categoryId });
        const subIds = subcategories.map(c => c._id);
        filter.categoryId = { $in: subIds };
      } else {
        // Subcategory: direct match
        filter.categoryId = categoryId;
      }
    }
  }

  // Brand filter: comma-separated, normalize to brandKey
  if (brand) {
    const brands = brand.split(',').map(b => normalizeBrandKey(b)).filter(Boolean);
    if (brands.length > 0) {
      filter.brandKey = { $in: brands };
    }
  }

  // Price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // In stock
  if (inStock === '1') {
    filter.stock = { $gt: 0 };
  }

  // Search (simple regex on name/description)
  if (q) {
    const regex = new RegExp(q, 'i');
    filter.$or = [
      { name: regex },
      { description: regex }
    ];
  }

  // Build query
  let query = Product.find(filter);

  // Sort
  if (sort === 'newest') {
    query = query.sort({ createdAt: -1 });
  } else {
    query = query.sort({ createdAt: -1 }); // Default sort
  }

  // Pagination (opt-in: only apply if page or limit provided)
  if (page || limit) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    query = query.skip((pageNum - 1) * limitNum).limit(limitNum);
  }

  const products = await query;
  res.json(products);
});

// @desc    Get all unique brands
// @route   GET /api/brands
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Product.aggregate([
    { $match: { brandKey: { $ne: '' } } },
    { $group: { _id: '$brandKey', brand: { $first: '$brand' } } },
    { $sort: { brand: 1 } },
    { $project: { _id: 0, brand: 1, brandKey: '$_id' } }
  ]);
  res.json(brands);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Fetch single product by slug
// @route   GET /api/products/by-slug/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, categoryId, brand, stock, specs } = req.body;

  // Validate categoryId if provided: must be a subcategory (parentId != null)
  if (categoryId) {
    const cat = await Category.findById(categoryId);
    if (!cat) {
      res.status(400);
      throw new Error('Category not found');
    }
    if (cat.parentId === null) {
      res.status(400);
      throw new Error('Products must be assigned to a subcategory, not a main category');
    }
  }

  const slug = await uniqueSlug(name || 'sample-product', Product);
  const brandKey = normalizeBrandKey(brand);

  const product = new Product({
    name: name || 'Sample Name',
    slug,
    price: price || 0,
    image: image || '/images/sample.jpg',
    category: category || 'Sample Category',
    categoryId: categoryId || undefined,
    brand: brand || '',
    brandKey,
    stock: stock || 0,
    description: description || 'Sample description',
    specs: specs || {},
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, categoryId, brand, stock, specs } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Validate categoryId if provided: must be a subcategory
  if (categoryId !== undefined && categoryId !== null) {
    const cat = await Category.findById(categoryId);
    if (!cat) {
      res.status(400);
      throw new Error('Category not found');
    }
    if (cat.parentId === null) {
      res.status(400);
      throw new Error('Products must be assigned to a subcategory, not a main category');
    }
  }

  if (name && name !== product.name) {
    product.name = name;
    product.slug = await uniqueSlug(name, Product, product._id);
  }
  if (price !== undefined) product.price = price;
  if (description !== undefined) product.description = description;
  if (image !== undefined) product.image = image;
  if (category !== undefined) product.category = category;
  if (categoryId !== undefined) product.categoryId = categoryId;
  if (brand !== undefined) {
    product.brand = brand;
    product.brandKey = normalizeBrandKey(brand);
  }
  if (stock !== undefined) product.stock = stock;
  if (specs !== undefined) product.specs = specs;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getBrands
};