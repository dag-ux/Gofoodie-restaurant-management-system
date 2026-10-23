import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. GET ALL TABLES
export const getTables = async (req: Request, res: Response) => {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { tableNumber: 'asc' }
    });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
};

// 2. UPDATE TABLE STATUS
export const updateTableStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const updatedTable = await prisma.table.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json({ message: 'Table status updated', table: updatedTable });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update table' });
  }
};

// 3. CREATE A RESERVATION
export const createReservation = async (req: AuthRequest, res: Response) => {
  try {
    const { tableId, reservationTime, partySize } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const newReservation = await prisma.reservation.create({
      data: {
        userId,
        tableId,
        reservationTime: new Date(reservationTime),
        partySize,
      },
    });

    await prisma.table.update({
      where: { id: tableId },
      data: { status: 'RESERVED' },
    });

    res.status(201).json({ message: 'Reservation confirmed', reservation: newReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

// 4. GET ALL RESERVATIONS
export const getReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        user: { select: { name: true, phone: true } },
        table: true,
      },
      orderBy: { reservationTime: 'asc' },
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};