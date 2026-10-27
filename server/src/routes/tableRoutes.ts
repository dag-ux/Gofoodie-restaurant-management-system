import { Router } from 'express';
import { 
  getTables, 
  updateTableStatus, 
  createReservation, 
  getReservations, 
  cancelReservation,
  checkInReservation,
  createTable // 👈 Import this
} from '../controllers/tableController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// Public Routes
router.get('/', getTables);
router.post('/reservations', createReservation);

// Admin Routes
router.get('/reservations', protect, adminOnly, getReservations);
router.put('/:id/status', protect, adminOnly, updateTableStatus);
router.delete('/reservations/:id', protect, adminOnly, cancelReservation);
router.put('/reservations/:id/checkin', protect, adminOnly, checkInReservation);
router.post('/', protect, adminOnly, createTable); 

export default router;