import { Router } from 'express';
import { 
  getCategories, 
  getMenu, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '../controllers/menuController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { getMenuItemById } from '../controllers/menuController';

const router = Router();

// Public Routes
router.get('/categories', getCategories);
router.get('/menu', getMenu);

// Protected Routes (Admin Only)
router.post('/menu', protect, adminOnly, createMenuItem);
router.put('/menu/:id', protect, adminOnly, updateMenuItem);
router.delete('/menu/:id', protect, adminOnly, deleteMenuItem);
router.get('/menu/:id', getMenuItemById); 
export default router;