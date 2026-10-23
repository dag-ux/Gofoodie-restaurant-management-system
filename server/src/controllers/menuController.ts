import { Request, Response } from 'express';
import prisma from '../config/db';

// 1. GET all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { orderIndex: 'asc' } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// 2. GET all menu items
export const getMenu = async (req: Request, res: Response) => {
  try {
    const menu = await prisma.menuItem.findMany({ 
      include: { category: true } 
    });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
};

// 3. CREATE a new menu item
export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, categoryId } = req.body;
    const newItem = await prisma.menuItem.create({
      data: { 
        name, 
        description, 
        price, 
        imageUrl, 
        categoryId 
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
};

// 4. UPDATE a menu item
export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const updatedItem = await prisma.menuItem.update({
      where: { id: Number(id) },
      data,
    });
    
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

// 5. DELETE a menu item
export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.menuItem.delete({ 
      where: { id: Number(id) } 
    });
    
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};