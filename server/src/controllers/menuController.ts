// src/controllers/menuController.ts
import { Request, Response } from 'express';
import prisma from '../config/db';

// GET all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { orderIndex: 'asc' } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// GET all menu items
export const getMenu = async (req: Request, res: Response) => {
  try {
    const menu = await prisma.menuItem.findMany({ include: { category: true } });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
};