import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// Only admins can see dashboard stats
router.get('/stats', protect, adminOnly, getDashboardStats);

export default router;