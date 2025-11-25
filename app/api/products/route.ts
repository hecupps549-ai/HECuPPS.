import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const status = searchParams.get('status');

        const where: any = {};
        if (category) where.category = category;
        if (status) where.status = status;

        const products = await prisma.product.findMany({
            where,
            include: {
                images: {
                    orderBy: { order: 'asc' },
                },
                digitalFiles: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST create new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name,
            description,
            category,
            priceINR,
            priceCAD,
            stock,
            status,
            featured,
            images,
        } = body;

        console.log('[Product Creation] Request body:', JSON.stringify(body, null, 2));

        // Validate required fields
        if (!name || !priceINR || !priceCAD) {
            console.error('[Product Creation] Missing required fields:', { name, priceINR, priceCAD });
            return NextResponse.json(
                { error: 'Missing required fields: name, priceINR, and priceCAD are required' },
                { status: 400 }
            );
        }

        // Validate numeric fields
        const parsedPriceINR = parseFloat(priceINR);
        const parsedPriceCAD = parseFloat(priceCAD);
        const parsedStock = parseInt(stock) || 0;

        if (isNaN(parsedPriceINR) || isNaN(parsedPriceCAD)) {
            console.error('[Product Creation] Invalid price values:', { priceINR, priceCAD });
            return NextResponse.json(
                { error: 'Invalid price values. Prices must be valid numbers.' },
                { status: 400 }
            );
        }

        console.log('[Product Creation] Creating product with data:', {
            name,
            priceINR: parsedPriceINR,
            priceCAD: parsedPriceCAD,
            stock: parsedStock,
            category,
            status: status || 'Active',
            featured: featured || false,
            imageCount: images?.length || 0
        });

        // Create product with default price for backward compatibility
        const product = await prisma.product.create({
            data: {
                name,
                description,
                category,
                priceINR: parsedPriceINR,
                priceCAD: parsedPriceCAD,
                price: parsedPriceINR, // Default to INR
                stock: parsedStock,
                status: status || 'Active',
                featured: featured || false,
                images: {
                    create: images?.map((img: any, index: number) => ({
                        url: img.url,
                        altText: img.altText || name,
                        isPrimary: index === 0,
                        order: index,
                    })) || [],
                },
            },
            include: {
                images: true,
            },
        });

        console.log('[Product Creation] Successfully created product:', product.id);
        return NextResponse.json({ product }, { status: 201 });
    } catch (error: any) {
        console.error('[Product Creation] Error creating product:', error);
        console.error('[Product Creation] Error details:', {
            message: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack
        });
        return NextResponse.json(
            { error: error.message || 'Failed to create product' },
            { status: 500 }
        );
    }
}
