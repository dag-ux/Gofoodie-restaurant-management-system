import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧹 Clearing all reservation history...");
  
  // 1. Delete every reservation from the database
  await prisma.reservation.deleteMany();
  
  // 2. Reset every table back to FREE so customers can book them again
  await prisma.table.updateMany({
    data: { status: 'FREE' }
  });

  console.log("✅ Success: All reservations deleted and all tables are now FREE!");
}

main()
  .catch((e) => {
    console.error("❌ Error clearing data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });