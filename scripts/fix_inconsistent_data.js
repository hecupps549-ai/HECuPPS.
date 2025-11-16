// scripts/fix_inconsistent_data.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting data consistency check...');

  // Example: Find orders with no associated user and log them
  const orphanedOrders = await prisma.order.findMany({
    where: {
      user: null,
    },
  });

  if (orphanedOrders.length > 0) {
    console.warn(`Found ${orphanedOrders.length} orphaned orders:`);
    orphanedOrders.forEach(order => console.log(`- Order ID: ${order.id}`));
    // Here you could add logic to assign them to a default user or delete them.
  } else {
    console.log('No orphaned orders found.');
  }

  // Example: Ensure all product prices are positive
  const updatedProducts = await prisma.product.updateMany({
    where: {
        price: {
            lt: 0
        }
    },
    data: {
        price: 0
    }
  });

  if(updatedProducts.count > 0) {
      console.log(`Corrected ${updatedProducts.count} products with negative prices.`);
  }

  console.log('Data consistency check finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
