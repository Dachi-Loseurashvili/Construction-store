import express from 'express';
const router = express.Router();
import { 
  addOrderItems, 
  getMyOrders, 
  getOrderById 
} from '../controllers/OrderController.js';
import { protect } from '../middlewares/auth.js';

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);

export default router;