import express from 'express';
const router = express.Router();
// Import the standardized controller functions
import { 
  getAllProducts, 
  getProductById, 
  getProductBySlug,
  createProduct, 
  updateProduct, 
  deleteProduct,
  getBrands
} from '../controllers/ProductController.js';

// Import the standardized auth middleware
import { protect, admin } from '../middlewares/auth.js';

// PUBLIC: Access for everyone
router.get('/', getAllProducts);
router.get('/by-slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// PROTECTED: Requires valid token and admin privileges
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;