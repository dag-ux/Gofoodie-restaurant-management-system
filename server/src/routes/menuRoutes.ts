// src/routes/menuRoutes.ts
import { Router } from 'express';
import { getCategories, getMenu } from '../controllers/menuController';

const router = Router();

router.get('/categories', getCategories);
router.get('/menu', getMenu);

export default router;