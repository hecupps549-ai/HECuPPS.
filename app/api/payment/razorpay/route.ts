import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder, verifyRazorpaySignature } from '@/lib/payment';
import prisma from '@/lib/prisma';

// POST /api/payment/razorpay - Create Razorpay order
export async function POST(request: NextRequest) {
    try {
        const { amount, currency, orderId } = await request.json();

        if (!amount || !orderId) {
            return NextResponse.json(
                { error: 'Amount and orderId are required' },
                { status: 400 }
            );
        }

        const razorpayOrder = await createRazorpayOrder(amount, currency || 'INR', orderId);

        return NextResponse.json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        });
    } catch (error: any) {
        console.error('Razorpay order creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create Razorpay order' },
            { status: 500 }
        );
    }
}

// PUT /api/payment/razorpay - Verify Razorpay payment and update order
export async function PUT(request: NextRequest) {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            orderId,
        } = await request.json();

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify signature
        const isValid = await verifyRazorpaySignature(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        );

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                paymentStatus: 'PAID',
                paymentGateway: 'razorpay',
                transactionId: razorpayPaymentId,
            },
        });

        return NextResponse.json({
            success: true,
            order: updatedOrder,
        });
    } catch (error: any) {
        console.error('Razorpay verification error:', error);
        return NextResponse.json(
            { error: error.message || 'Payment verification failed' },
            { status: 500 }
        );
    }
}
