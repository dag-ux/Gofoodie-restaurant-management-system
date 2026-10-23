import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting full menu seed...");

  // 1. Clear existing data safely
  await prisma.orderItem.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  // 2. Create Categories
  const categoryNames = [
    'Breakfast', 'Lunch', 'Dinner', 'Chicken', 
    'Burgers & Sandwiches', 'Pizza', 'Special Combo', 
    'Soft Drinks', 'Hot Drinks', 'Mojito', 'Traditional Food'
  ];

  const categoryMap: Record<string, number> = {};
  for (const name of categoryNames) {
    const cat = await prisma.category.create({ data: { name } });
    categoryMap[name] = cat.id;
  }
  console.log("Categories created!");

  // 3. Create Menu Items
  const menuData = [
    // --- BREAKFAST ---
    { name: 'Injera & Wot (Veg/Meat)', price: 80, category: 'Breakfast', description: 'Traditional Ethiopian breakfast', imageUrl: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=500' },
    { name: 'Egg Omelette', price: 70, category: 'Breakfast', description: 'Fluffy eggs with fresh veggies', imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500' },
    { name: 'Scrambled Eggs', price: 70, category: 'Breakfast', description: 'Classic scrambled eggs', imageUrl: 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=500' },
    { name: 'Pancakes (with honey)', price: 60, category: 'Breakfast', description: 'Sweet pancakes with honey', imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500' },
    { name: 'French Toast', price: 70, category: 'Breakfast', description: 'Golden brown french toast', imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500' },
    { name: 'Oatmeal with Fruits', price: 60, category: 'Breakfast', description: 'Healthy oats with fresh fruits', imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500' },
    { name: 'Sandwich (Egg/Tuna/Chicken)', price: 60, category: 'Breakfast', description: 'Freshly made breakfast sandwich', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500' },

    // --- LUNCH ---
    { name: 'Chicken Curry with Rice', price: 120, category: 'Lunch', description: 'Spicy chicken curry and rice', imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500' },
    { name: 'Beef Stew with Injera', price: 130, category: 'Lunch', description: 'Tender beef stew with injera', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500' },
    { name: 'Fish with Rice', price: 120, category: 'Lunch', description: 'Grilled fish served with rice', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500' },
    { name: 'Vegetable Stir Fry with Rice', price: 90, category: 'Lunch', description: 'Healthy veggies and rice', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500' },
    { name: 'Pasta (Chicken/Beef/Veg)', price: 100, category: 'Lunch', description: 'Classic pasta with your choice of protein', imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500' },
    { name: 'Fried Rice (Chicken/Veg)', price: 90, category: 'Lunch', description: 'Flavorful fried rice', imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500' },

    // --- DINNER ---
    { name: 'Grilled Chicken Plate', price: 150, category: 'Dinner', description: 'Juicy grilled chicken with sides', imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=500' },
    { name: 'Beef Steak', price: 180, category: 'Dinner', description: 'Premium cooked beef steak', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500' },
    { name: 'Fish Fillet', price: 160, category: 'Dinner', description: 'Delicate fish fillet', imageUrl: 'https://images.unsplash.com/photo-1535400255456-984241443b29?w=500' },
    { name: 'Pasta Alfredo', price: 120, category: 'Dinner', description: 'Creamy Alfredo pasta', imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500' },
    { name: 'Mixed Grill', price: 200, category: 'Dinner', description: 'Assorted grilled meats', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500' },
    { name: 'Soup (Lentil/Chicken)', price: 70, category: 'Dinner', description: 'Warm and comforting soup', imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500' },

    // --- CHICKEN ---
    { name: 'Grilled Chicken', price: 130, category: 'Chicken', description: 'Healthy grilled chicken', imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=500' },
    { name: 'Fried Chicken (2 pcs)', price: 120, category: 'Chicken', description: 'Crispy fried chicken', imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500' },
    { name: 'Chicken Wings (6 pcs)', price: 100, category: 'Chicken', description: 'Spicy chicken wings', imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500' },
    { name: 'Chicken Curry', price: 120, category: 'Chicken', description: 'Rich chicken curry', imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500' },
    { name: 'Spicy Chicken', price: 130, category: 'Chicken', description: 'Extra spicy chicken', imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500' },

    // --- BURGERS & SANDWICHES ---
    { name: 'Classic Beef Burger', price: 120, category: 'Burgers & Sandwiches', description: 'Beef patty with fresh lettuce and tomato', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
    { name: 'Cheese Burger', price: 140, category: 'Burgers & Sandwiches', description: 'Classic burger with melted cheese', imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500' },
    { name: 'Chicken Burger', price: 130, category: 'Burgers & Sandwiches', description: 'Crispy chicken patty burger', imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500' },
    { name: 'Double Burger', price: 170, category: 'Burgers & Sandwiches', description: 'Double the meat, double the joy', imageUrl: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=500' },
    { name: 'Club Sandwich', price: 120, category: 'Burgers & Sandwiches', description: 'Triple decker classic sandwich', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500' },
    { name: 'Tuna Sandwich', price: 100, category: 'Burgers & Sandwiches', description: 'Fresh tuna salad sandwich', imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500' },
    { name: 'Veggie Sandwich', price: 90, category: 'Burgers & Sandwiches', description: 'Healthy vegetable sandwich', imageUrl: 'https://images.unsplash.com/photo-1539252554935-80c8cabfdb10?w=500' },

    // --- PIZZA ---
    { name: 'Margherita Pizza', price: 120, category: 'Pizza', description: 'Classic cheese and tomato pizza', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500' },
    { name: 'Pepperoni Pizza', price: 150, category: 'Pizza', description: 'Pizza with spicy pepperoni', imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500' },
    { name: 'Chicken Pizza', price: 160, category: 'Pizza', description: 'Topped with grilled chicken', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500' },
    { name: 'Beef Pizza', price: 160, category: 'Pizza', description: 'Topped with seasoned beef', imageUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500' },
    { name: 'Vegetable Pizza', price: 130, category: 'Pizza', description: 'Loaded with fresh veggies', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },

    // --- SPECIAL COMBO ---
    { name: 'Any Burger + Fries + Soft Drink', price: 180, category: 'Special Combo', description: 'The ultimate meal deal', imageUrl: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?w=500' },

    // --- SOFT DRINKS ---
    { name: 'Coca Cola', price: 40, category: 'Soft Drinks', description: 'Chilled Coca Cola', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500' },
    { name: 'Fanta', price: 40, category: 'Soft Drinks', description: 'Chilled Fanta Orange', imageUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=500' },
    { name: 'Sprite', price: 40, category: 'Soft Drinks', description: 'Chilled Sprite', imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500' },
    { name: 'Pepsi', price: 40, category: 'Soft Drinks', description: 'Chilled Pepsi', imageUrl: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=500' },
    { name: 'Water (Small)', price: 20, category: 'Soft Drinks', description: 'Bottled water 500ml', imageUrl: 'https://images.unsplash.com/photo-1608885898957-a559228e8747?w=500' },
    { name: 'Water (Large)', price: 30, category: 'Soft Drinks', description: 'Bottled water 1L', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500' },

    // --- HOT DRINKS ---
    { name: 'Ethiopian Coffee (Buna)', price: 40, category: 'Hot Drinks', description: 'Authentic Ethiopian coffee', imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500' },
    { name: 'Americano', price: 50, category: 'Hot Drinks', description: 'Hot black coffee', imageUrl: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500' },
    { name: 'Cappuccino', price: 60, category: 'Hot Drinks', description: 'Espresso with milk foam', imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500' },
    { name: 'Latte', price: 60, category: 'Hot Drinks', description: 'Smooth milk coffee', imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500' },
    { name: 'Mocha', price: 70, category: 'Hot Drinks', description: 'Coffee with chocolate', imageUrl: 'https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?w=500' },
    { name: 'Black Tea', price: 30, category: 'Hot Drinks', description: 'Classic hot tea', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500' },
    { name: 'Herbal Tea', price: 30, category: 'Hot Drinks', description: 'Healthy herbal infusion', imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500' },

    // --- MOJITO ---
    { name: 'Classic Mojito', price: 70, category: 'Mojito', description: 'Mint and lime refreshing drink', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500' },
    { name: 'Strawberry Mojito', price: 80, category: 'Mojito', description: 'Sweet strawberry and mint', imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500' },
    { name: 'Passion Fruit Mojito', price: 80, category: 'Mojito', description: 'Tropical passion fruit flavor', imageUrl: 'https://images.unsplash.com/photo-1587223962930-cb7f31384c19?w=500' },
    { name: 'Blue Lagoon Mojito', price: 80, category: 'Mojito', description: 'Blue curacao and mint', imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500' },
    { name: 'Mango Mojito', price: 80, category: 'Mojito', description: 'Sweet mango and mint', imageUrl: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=500' },

    // --- TRADITIONAL FOOD ---
    { name: 'Injera & Wot (Doro Wat)', price: 100, category: 'Traditional Food', description: 'Spicy chicken stew with injera', imageUrl: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=500' },
    { name: 'Injera & Kitfo', price: 120, category: 'Traditional Food', description: 'Minced raw beef with mitmita', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500' },
    { name: 'Tibs (Beef / Lamb)', price: 120, category: 'Traditional Food', description: 'Sautéed meat with onions and peppers', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500' },
    { name: 'Shiro', price: 90, category: 'Traditional Food', description: 'Chickpea stew', imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500' },
    { name: 'Misir Wot', price: 80, category: 'Traditional Food', description: 'Spicy red lentil stew', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500' },
    { name: 'Chechebsa', price: 70, category: 'Traditional Food', description: 'Shredded flatbread with berbere', imageUrl: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=500' }
  ];

  // 4. Insert all items
  for (const item of menuData) {
    await prisma.menuItem.create({
      data: {
        name: item.name,
        price: item.price,
        description: item.description,
        imageUrl: item.imageUrl,
        categoryId: categoryMap[item.category]
      }
    });
  }

  console.log(`✅ Successfully added ${menuData.length} dishes to the database!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });