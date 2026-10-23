import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting to seed tables...");
  
  // Clear existing tables to prevent duplicates
  await prisma.reservation.deleteMany();
  await prisma.table.deleteMany();

  await prisma.table.createMany({
    data: [
      { tableNumber: 'T1', capacity: 2 },
      { tableNumber: 'T2', capacity: 4 },
      { tableNumber: 'T3', capacity: 4 },
      { tableNumber: 'T4', capacity: 6 },
      { tableNumber: 'T5', capacity: 8 },
    ],
  });
  
  console.log('✅ Tables seeded successfully!');
}

main()
  .catch((e) => {
    console.error("❌ Error seeding tables:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });