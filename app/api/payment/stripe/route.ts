import { NextRequest, NextResponse } from 'next/server';
import { createStripePaymentIntent } from '@/lib/payment';
import prisma from '@/lib/prisma';

// POST /api/payment/stripe - Create Stripe payment intent
export async function POST(request: NextRequest) {
    try {
        const { amount, currency, orderId } = await request.json();

        if (!amount || !orderId) {
            return NextResponse.json(
                { error: 'Amount and orderId are required' },
                { status: 400 }
            );
        }

        const paymentIntent = await createStripePaymentIntent(
            amount,
            currency || 'cad',
            orderId
        );

        return NextResponse.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error: any) {
        console.error('Stripe payment intent error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create payment intent' },
            { status: 500 }
        );
    }
}

// PUT /api/payment/stripe - Confirm payment and update order
export async function PUT(request: NextRequest) {
    try {
        const { paymentIntentId, orderId } = await request.json();

        if (!paymentIntentId || !orderId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                paymentStatus: 'PAID',
                paymentGateway: 'stripe',
                transactionId: paymentIntentId,
            },
        });

        return NextResponse.json({
            success: true,
            order: updatedOrder,
        });
    } catch (error: any) {
        console.error('Stripe confirmation error:', error);
        return NextResponse.json(
            { error: error.message || 'Payment confirmation failed' },
            { status: 500 }
        );
    }
}
