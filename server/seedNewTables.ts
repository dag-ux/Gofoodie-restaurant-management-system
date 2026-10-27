import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Clearing old tables and reservations...");

  // 1. Clear existing reservations and tables to avoid foreign key errors
  await prisma.reservation.deleteMany();
  await prisma.table.deleteMany();

  console.log("Creating the new restaurant floor plan...");

  // 2. Create all 26 tables
  await prisma.table.createMany({
    data: [
      // 4 Tables with 1 Seat
      { tableNumber: 'T1', capacity: 1 },
      { tableNumber: 'T2', capacity: 1 },
      { tableNumber: 'T3', capacity: 1 },
      { tableNumber: 'T4', capacity: 1 },

      // 4 Tables with 2 Seats
      { tableNumber: 'T5', capacity: 2 },
      { tableNumber: 'T6', capacity: 2 },
      { tableNumber: 'T7', capacity: 2 },
      { tableNumber: 'T8', capacity: 2 },

      // 4 Tables with 3 Seats
      { tableNumber: 'T9', capacity: 3 },
      { tableNumber: 'T10', capacity: 3 },
      { tableNumber: 'T11', capacity: 3 },
      { tableNumber: 'T12', capacity: 3 },

      // 4 Tables with 4 Seats
      { tableNumber: 'T13', capacity: 4 },
      { tableNumber: 'T14', capacity: 4 },
      { tableNumber: 'T15', capacity: 4 },
      { tableNumber: 'T16', capacity: 4 },

      // 4 Tables with 5 Seats
      { tableNumber: 'T17', capacity: 5 },
      { tableNumber: 'T18', capacity: 5 },
      { tableNumber: 'T19', capacity: 5 },
      { tableNumber: 'T20', capacity: 5 },

      // 2 Tables with 6 Seats
      { tableNumber: 'T21', capacity: 6 },
      { tableNumber: 'T22', capacity: 6 },

      // 2 Tables with 7 Seats
      { tableNumber: 'T23', capacity: 7 },
      { tableNumber: 'T24', capacity: 7 },

      // 2 VIP Tables for Couples (2 Seats)
      { tableNumber: 'VIP-1', capacity: 2 },
      { tableNumber: 'VIP-2', capacity: 2 },
    ],
  });

  console.log("✅ Success: 26 Tables created successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding tables:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });