import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Clear existing data (Order matters due to foreign keys)
  await prisma.orderItem.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  console.log('Seeding categories...');
  
  // 2. Create Categories
  const breakfast = await prisma.category.create({ data: { name: 'Breakfast', orderIndex: 1 } });
  const traditional = await prisma.category.create({ data: { name: 'Traditional Food', orderIndex: 2 } });
  const cafe = await prisma.category.create({ data: { name: 'Cafe', orderIndex: 3 } });
  const drinks = await prisma.category.create({ data: { name: 'Drinks', orderIndex: 4 } });

  console.log('Seeding menu items...');

  // 3. Create Menu Items linked to Categories one by one
  const items = [
    { 
      name: 'Doro Wat', 
      description: 'Spicy chicken stew with injera', 
      price: 450, 
      categoryId: traditional.id, 
      imageUrl: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=500' 
    },
    { 
      name: 'Kitfo', 
      description: 'Minced raw beef seasoned with mitmita', 
      price: 400, 
      categoryId: traditional.id, 
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500' 
    },
    { 
      name: 'Macchiato', 
      description: 'Freshly brewed Ethiopian coffee with milk', 
      price: 60, 
      categoryId: cafe.id, 
      imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500' 
    },
    { 
      name: 'Chechebsa', 
      description: 'Shredded flatbread with berbere and kibbeh', 
      price: 150, 
      categoryId: breakfast.id, 
      imageUrl: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=500' 
    }
  ];

  for (const item of items) {
    await prisma.menuItem.create({ data: item });
  }
  
  console.log('Database seeded successfully with Categories and Menu Items!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });