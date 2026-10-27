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
    const { tableId, reservationTime, partySize, guestName, guestPhone, guestEmail, specialRequests } = req.body;

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(guestName)) return res.status(400).json({ error: 'Name must contain only letters.' });

    const phoneRegex = /^(?:\+251|0)(9|7)\d{8}$/;
    if (!phoneRegex.test(guestPhone)) return res.status(400).json({ error: 'Invalid phone number. Use 0911223344 or +251911223344.' });

    const table = await prisma.table.findUnique({ where: { id: Number(tableId) } });
    if (!table) return res.status(404).json({ error: 'Table not found.' });
    if (table.capacity < Number(partySize)) return res.status(400).json({ error: `This table only seats ${table.capacity} people.` });

    // 4. VALIDATION: CHECK OPERATING HOURS (6:00 AM to 10:00 PM)
    const timePart = reservationTime.split('T')[1]; // e.g. "14:00:00.000Z"
    const requestedHour = parseInt(timePart.split(':')[0], 10); // extracts 14

    if (requestedHour < 6 || requestedHour >= 22) {
      return res.status(400).json({ error: 'Reservations are only available between 6:00 AM and 10:00 PM.' });
    }

    // 5. VALIDATION: Prevent Double Booking (Within a 2-hour window)
    const requestedTime = new Date(reservationTime);
    const twoHoursBefore = new Date(requestedTime.getTime() - 2 * 60 * 60 * 1000);
    const twoHoursAfter = new Date(requestedTime.getTime() + 2 * 60 * 60 * 1000);

    const existingReservation = await prisma.reservation.findFirst({
      where: {
        tableId: Number(tableId),
        status: 'CONFIRMED',
        reservationTime: { gte: twoHoursBefore, lte: twoHoursAfter },
      },
    });

    if (existingReservation) return res.status(400).json({ error: 'This table is already booked around this time.' });

    const userId = req.user?.userId || null;

    const newReservation = await prisma.reservation.create({
      data: { userId, tableId: Number(tableId), reservationTime: requestedTime, partySize: Number(partySize), guestName, guestPhone, guestEmail, specialRequests },
    });

    await prisma.table.update({
      where: { id: Number(tableId) },
      data: { status: 'RESERVED' },
    });

    res.status(201).json({ message: 'Reservation confirmed', reservation: newReservation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

// 4. GET ALL RESERVATIONS
export const getReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { table: true },
      orderBy: { reservationTime: 'asc' },
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

// 5. CANCEL A RESERVATION
export const cancelReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = await prisma.reservation.findUnique({ where: { id: Number(id) } });

    if (!reservation) return res.status(404).json({ error: 'Reservation not found.' });

    await prisma.reservation.update({ where: { id: Number(id) }, data: { status: 'CANCELLED' } });
    await prisma.table.update({ where: { id: reservation.tableId }, data: { status: 'FREE' } });

    res.json({ message: 'Reservation cancelled and table is now FREE.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel reservation.' });
  }
};

// 6. CHECK-IN RESERVATION
export const checkInReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = await prisma.reservation.findUnique({ where: { id: Number(id) } });

    if (!reservation) return res.status(404).json({ error: 'Reservation not found.' });

    await prisma.reservation.update({ where: { id: Number(id) }, data: { status: 'COMPLETED' } });
    await prisma.table.update({ where: { id: reservation.tableId }, data: { status: 'OCCUPIED' } });

    res.json({ message: 'Guest checked in. Table is now OCCUPIED.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check in guest.' });
  }
};
// 7. CREATE A NEW TABLE (Admin Only)
export const createTable = async (req: Request, res: Response) => {
  try {
    const { tableNumber, capacity } = req.body;

    if (!tableNumber || !capacity) {
      return res.status(400).json({ error: 'Table number and capacity are required.' });
    }

    const existingTable = await prisma.table.findUnique({
      where: { tableNumber: tableNumber.toUpperCase() },
    });

    if (existingTable) {
      return res.status(400).json({ error: 'A table with this number already exists.' });
    }

    const newTable = await prisma.table.create({
      data: {
        tableNumber: tableNumber.toUpperCase(),
        capacity: Number(capacity),
        status: 'FREE',
      },
    });

    res.status(201).json(newTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create table.' });
  }
};