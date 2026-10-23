import { Request, Response } from 'express';
import prisma from '../config/db';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Get total orders
    const totalOrders = await prisma.order.count();

    // 2. Get total revenue (Sum of all totalAmount)
    const revenueData = await prisma.order.aggregate({
      _sum: { totalAmount: true },
    });
    const totalRevenue = revenueData._sum.totalAmount || 0;

    // 3. Get table stats
    const totalTables = await prisma.table.count();
    const occupiedTables = await prisma.table.count({
      where: { status: { in: ['OCCUPIED', 'RESERVED'] } },
    });

    // 4. Get recent 5 orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    // 5. Get top selling item (Optional complex query, let's do a simple count)
    const totalMenuItems = await prisma.menuItem.count();

    res.json({
      totalOrders,
      totalRevenue,
      totalTables,
      occupiedTables,
      totalMenuItems,
      recentOrders,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};