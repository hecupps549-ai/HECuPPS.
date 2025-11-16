import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiCache } from '@/lib/cache';
import { withAdminAuth } from '@/lib/rbac';
import { createProductSchema } from '@/lib/validator';
import { z } from 'zod';
import { Product } from '@/types';

// GET all products (cached)
export async function GET(req: NextRequest) {
  const cacheKey = 'products:all';
  // FIX: Cast the result of apiCache.get to the correct type to resolve the type mismatch error.
  const cachedProducts = apiCache.get(cacheKey) as Product[] | undefined;
  if (cachedProducts) {
    return NextResponse.json(cachedProducts);
  }

  try {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      include: { media: true, inventory: true },
    });

    const formattedProducts: Product[] = products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        stock: p.inventory?.stock ?? 0,
        images: p.media.filter(m => m.type === 'IMAGE').sort((a, b) => a.order - b.order).map(m => m.url),
        videoUrl: p.media.find(m => m.type === 'VIDEO')?.url
    }));
    
    apiCache.set(cacheKey, formattedProducts, 5 * 60 * 1000); // Cache for 5 minutes
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST a new product (admin only)
const createProductHandler = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const validatedData = createProductSchema.parse(body);

        const { stock, images, videoUrl, ...productData } = validatedData;
        
        const newProduct = await prisma.product.create({
            data: {
                ...productData,
                inventory: {
                    create: {
                        stock,
                    },
                },
                media: {
                    create: [
                        ...images.map((url, index) => ({
                            url,
                            type: 'IMAGE',
                            order: index,
                        })),
                        ...(videoUrl ? [{ url: videoUrl, type: 'VIDEO', order: 99 }] : [])
                    ]
                },
            },
            include: { inventory: true, media: true },
        });

        apiCache.delete('products:all'); // Invalidate cache

        return NextResponse.json(newProduct, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation failed', errors: error.issues }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}

export const POST = withAdminAuth(['SUPER_ADMIN', 'PRODUCT_MANAGER'], createProductHandler);
