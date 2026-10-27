import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tables = ['User', 'Category', 'MenuItem', 'Table', 'Order', 'OrderItem', 'Reservation', 'Payment'];
  
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(
        `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE(MAX(id), 1) + 1, false) FROM "${table}";`
      );
      console.log(`✅ Sequence fixed for ${table}`);
    } catch (e: any) {
      console.log(`❌ Skipped ${table}: ${e.message}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());