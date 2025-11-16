// scripts/migrate_from_php.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration from legacy data...');

  // --- Migrate Users ---
  console.log('Migrating users...');
  const users = [];
  fs.createReadStream(path.join(__dirname, '../data/users.csv'))
    .pipe(csv())
    .on('data', (data) => users.push(data))
    .on('end', async () => {
      for (const user of users) {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            id: user.id, // Assuming legacy ID is present
            name: user.name,
            email: user.email,
            password: user.password_hash, // Assuming password is already hashed
            address: user.address,
            status: user.is_active === '1' ? 'ACTIVE' : 'BLOCKED',
            createdAt: new Date(user.created_at),
          },
        });
      }
      console.log(`${users.length} users processed.`);
    });
  
  // Add similar logic for products, orders, etc.
  // Be mindful of relationships and create related records accordingly.
  
  console.log('Migration script finished. Please check the database.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
