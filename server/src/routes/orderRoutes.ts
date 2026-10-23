import { Router } from 'express';
import { createOrder, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// Public Route (Customers placing orders)
router.post('/', createOrder);

// Protected Routes (Only Admins can view all orders or change status)
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;