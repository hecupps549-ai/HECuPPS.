import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all coupons
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const where: any = {};
        if (status) where.status = status;

        const coupons = await prisma.coupon.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ coupons });
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return NextResponse.json(
            { error: 'Failed to fetch coupons' },
            { status: 500 }
        );
    }
}

// POST create new coupon
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            code,
            discountType,
            value,
            minPurchase,
            startDate,
            expiryDate,
            usageLimit,
            status,
            description,
        } = body;

        console.log('[Coupon Creation] Request body:', JSON.stringify(body, null, 2));

        // Validate required fields
        if (!code || !discountType || !value) {
            console.error('[Coupon Creation] Missing required fields:', { code, discountType, value });
            return NextResponse.json(
                { error: 'Missing required fields: code, discountType, and value are required' },
                { status: 400 }
            );
        }

        // Validate discount type
        if (!['flat', 'percentage'].includes(discountType)) {
            return NextResponse.json(
                { error: 'Invalid discount type. Must be either "flat" or "percentage"' },
                { status: 400 }
            );
        }

        // Validate numeric fields
        const parsedValue = parseFloat(value);
        const parsedMinPurchase = parseFloat(minPurchase) || 0;

        if (isNaN(parsedValue)) {
            console.error('[Coupon Creation] Invalid value:', { value });
            return NextResponse.json(
                { error: 'Invalid discount value. Must be a valid number.' },
                { status: 400 }
            );
        }

        // Create coupon
        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                discountType,
                value: parsedValue,
                minPurchase: parsedMinPurchase,
                startDate: startDate ? new Date(startDate) : new Date(),
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                status: status || 'Active',
                description,
            },
        });

        console.log('[Coupon Creation] Successfully created coupon:', coupon.id);
        return NextResponse.json({ coupon }, { status: 201 });
    } catch (error: any) {
        console.error('[Coupon Creation] Error creating coupon:', error);
        console.error('[Coupon Creation] Error details:', {
            message: error.message,
            code: error.code,
            meta: error.meta,
        });

        // Handle unique constraint violation
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'A coupon with this code already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Failed to create coupon' },
            { status: 500 }
        );
    }
}
