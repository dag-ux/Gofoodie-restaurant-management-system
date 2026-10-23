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
    const { 
      tableId, 
      reservationTime, 
      partySize, 
      guestName, 
      guestPhone, 
      guestEmail, 
      specialRequests 
    } = req.body;

    // 1. VALIDATION: Check Name (Only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(guestName)) {
      return res.status(400).json({ error: 'Name must contain only letters.' });
    }

    // 2. VALIDATION: Check Phone (Ethiopian format: 09... or +2519...)
    const phoneRegex = /^(?:\+251|0)(9|7)\d{8}$/;
    if (!phoneRegex.test(guestPhone)) {
      return res.status(400).json({ error: 'Invalid phone number. Use 0911223344 or +251911223344.' });
    }

    // 3. VALIDATION: Check Table Capacity
    const table = await prisma.table.findUnique({ where: { id: Number(tableId) } });
    if (!table) {
      return res.status(404).json({ error: 'Table not found.' });
    }
    if (table.capacity < Number(partySize)) {
      return res.status(400).json({ error: `This table only seats ${table.capacity} people. Please select a larger table.` });
    }

    // 4. VALIDATION: Prevent Double Booking (Within a 2-hour window)
    const requestedTime = new Date(reservationTime);
    const twoHoursBefore = new Date(requestedTime.getTime() - 2 * 60 * 60 * 1000);
    const twoHoursAfter = new Date(requestedTime.getTime() + 2 * 60 * 60 * 1000);

    const existingReservation = await prisma.reservation.findFirst({
      where: {
        tableId: Number(tableId),
        status: 'CONFIRMED',
        reservationTime: {
          gte: twoHoursBefore,
          lte: twoHoursAfter,
        },
      },
    });

    if (existingReservation) {
      return res.status(400).json({ error: 'This table is already booked around this time. Please pick another time or table.' });
    }

    // 5. IF ALL VALIDATIONS PASS, CREATE RESERVATION
    const userId = req.user?.userId || null;

    const newReservation = await prisma.reservation.create({
      data: {
        userId,
        tableId: Number(tableId),
        reservationTime: requestedTime,
        partySize: Number(partySize),
        guestName,
        guestPhone,
        guestEmail,
        specialRequests,
      },
    });

    // Mark table as RESERVED
    await prisma.table.update({
      where: { id: Number(tableId) },
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