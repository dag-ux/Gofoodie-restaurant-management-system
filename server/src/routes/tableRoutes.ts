import { Router } from 'express';
import { getTables, updateTableStatus, createReservation, getReservations } from '../controllers/tableController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getTables);
router.post('/reservations', protect, createReservation);
router.get('/reservations', protect, adminOnly, getReservations);
router.put('/:id/status', protect, adminOnly, updateTableStatus);

export default router; // 👈 MUST BE HERE