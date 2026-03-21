import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { withAdminAuth } from '@/lib/rbac';

// GET single product
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(params.id) },
            include: {
                images: {
                    orderBy: { order: 'asc' },
                },
                digitalFiles: true,
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Parse JSON fields safely
        const parsed = {
            ...product,
            whatsIncluded: product.whatsIncluded ? JSON.parse(product.whatsIncluded) : null,
            productExtras: product.productExtras ? JSON.parse(product.productExtras) : null,
        };

        return NextResponse.json({ product: parsed });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PUT update product
async function putHandler(
    request: NextRequest,
    params: any
) {
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
            whatsIncluded,
            productExtras,
        } = body;

        const productId = parseInt(params.params.id);

        // Build update data
        const updateData: any = {
            name,
            description,
            category,
            priceINR: parseFloat(priceINR),
            priceCAD: parseFloat(priceCAD),
            price: parseFloat(priceINR),
            stock: parseInt(stock),
            status,
            featured,
            whatsIncluded: whatsIncluded !== undefined ? (whatsIncluded ? JSON.stringify(whatsIncluded) : null) : undefined,
            productExtras: productExtras !== undefined ? (productExtras ? JSON.stringify(productExtras) : null) : undefined,
        };

        // Handle images if provided
        if (images && Array.isArray(images)) {
            updateData.images = {
                deleteMany: {}, // Delete all existing images for this product
                create: images.map((img: any, index: number) => ({
                    url: img.url,
                    altText: img.altText || name,
                    isPrimary: index === 0,
                    order: index,
                })),
            };
        }

        // Update product with nested images
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: updateData,
            include: {
                images: true,
            },
        });

        return NextResponse.json({ product: updatedProduct });
    } catch (error: any) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update product' },
            { status: 500 }
        );
    }
}

export const PUT = withAdminAuth(['SUPER_ADMIN', 'PRODUCT_MANAGER'], putHandler);

// DELETE product
async function deleteHandler(
    request: NextRequest,
    params: any
) {
    try {
        const productId = parseInt(params.params.id);

        await prisma.product.delete({
            where: { id: productId },
        });

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}

export const DELETE = withAdminAuth(['SUPER_ADMIN'], deleteHandler);
