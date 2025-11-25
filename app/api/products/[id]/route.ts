import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PUT update product
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
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
        } = body;

        const product = await prisma.product.update({
            where: { id: parseInt(params.id) },
            data: {
                name,
                description,
                category,
                priceINR: parseFloat(priceINR),
                priceCAD: parseFloat(priceCAD),
                price: parseFloat(priceINR),
                stock: parseInt(stock),
                status,
                featured,
            },
            include: {
                images: true,
            },
        });

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE product
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.product.delete({
            where: { id: parseInt(params.id) },
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
