import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
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

// Helper to generate unique slug (Unicode-safe: supports Georgian, Cyrillic, etc.)
function generateSlug(name) {
  return (name || "")
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(baseName, excludeId = null) {
  let base = generateSlug(baseName);

  // Fallback if base is empty (e.g., name is only symbols/emoji)
  if (!base) {
    base = `item-${Date.now().toString(36)}`;
  }

  let slug = base;
  let suffix = 2;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Product.findOne(query);
    if (!exists) return slug;
    slug = `${base}-${suffix++}`;
  }
}

// @desc    Create a product
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, stock, specs } = req.body;

  const slug = await uniqueSlug(name || 'sample-product');

  const product = new Product({
    name: name || 'Sample Name',
    slug,
    price: price || 0,
    image: image || '/images/sample.jpg',
    category: category || 'Sample Category',
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
  const { name, price, description, image, category, stock, specs } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    if (name && name !== product.name) {
      product.name = name;
      product.slug = await uniqueSlug(name, product._id);
    }
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (image !== undefined) product.image = image;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (specs !== undefined) product.specs = specs;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
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
  deleteProduct
};