import { Request, Response } from 'express';
import prisma from '../config/db';

// 1. CREATE AN ORDER (Public - Customers)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerName, phone, address, orderType, totalAmount, cartItems } = req.body;

    const newOrder = await prisma.order.create({
      data: {
        customerName,
        phone,
        address,
        orderType,
        totalAmount,
        // Nested write: Prisma will create the OrderItems automatically!
        items: {
          create: cartItems.map((item: any) => ({
            menuItemId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        },
      },
      include: { items: true }, // Return the created items in the response
    });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// 2. GET ALL ORDERS (Admin/Kitchen)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { menuItem: true } // Include the actual food details
        }
      },
      orderBy: { createdAt: 'desc' } // Newest orders first
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// 3. UPDATE ORDER STATUS (Admin/Kitchen)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};