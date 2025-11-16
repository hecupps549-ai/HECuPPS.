// scripts/upload_legacy_media_to_blob.js
require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('@prisma/client');
const { put } = require('@vercel/blob');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting legacy media upload to Vercel Blob...');

  const products = await prisma.product.findMany({
    where: {
      media: {
        some: {
          url: {
            startsWith: '/legacy/images/', // Identify legacy paths
          },
        },
      },
    },
    include: {
      media: true,
    },
  });

  if (products.length === 0) {
    console.log('No products with legacy media paths found.');
    return;
  }

  console.log(`Found ${products.length} products to process.`);

  for (const product of products) {
    for (const media of product.media) {
      if (media.url.startsWith('/legacy/images/')) {
        const fileName = path.basename(media.url);
        const localPath = path.join(__dirname, '../data/legacy_media', fileName);

        try {
          const fileBuffer = await fs.readFile(localPath);
          const blob = await put(fileName, fileBuffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
          });

          // Update the media record with the new URL
          await prisma.productMedia.update({
            where: { id: media.id },
            data: { url: blob.url },
          });

          console.log(`Uploaded ${fileName} to ${blob.url} for product ${product.name}`);
        } catch (error) {
          console.error(`Failed to upload ${fileName} for product ${product.name}:`, error);
        }
      }
    }
  }

  console.log('Media upload process finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
