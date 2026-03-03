import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendTemplatedEmail } from '@/lib/email-service';

/**
 * Razorpay Webhook Handler
 * Handles payment events from Razorpay
 * 
 * Events handled:
 * - payment.captured - Payment successfully captured
 * - payment.failed - Payment failed
 * - order.paid - Order paid
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-razorpay-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'No signature found' },
                { status: 400 }
            );
        }

        // Verify webhook signature
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
            return NextResponse.json(
                { error: 'Webhook secret not configured' },
                { status: 500 }
            );
        }

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error('Invalid Razorpay webhook signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        // Parse the webhook event
        const event = JSON.parse(body);
        const eventType = event.event;

        console.log(`[Razorpay Webhook] Event: ${eventType}`);

        switch (eventType) {
            case 'payment.captured':
            case 'order.paid':
                await handlePaymentSuccess(event);
                break;

            case 'payment.failed':
                await handlePaymentFailed(event);
                break;

            default:
                console.log(`[Razorpay Webhook] Unhandled event: ${eventType}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('[Razorpay Webhook] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

async function handlePaymentSuccess(event: any) {
    try {
        const payment = event.payload.payment.entity;
        const orderId = payment.notes?.orderId;

        if (!orderId) {
            console.error('[Razorpay Webhook] No orderId in payment notes');
            return;
        }

        // Update order in database
        const order = await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                paymentStatus: 'PAID',
                status: 'PROCESSING',
                transactionId: payment.id,
                paymentDetails: JSON.stringify({
                    method: payment.method,
                    email: payment.email,
                    contact: payment.contact,
                    amount: payment.amount / 100,
                    captured_at: payment.captured_at,
                }),
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        console.log(`[Razorpay Webhook] Order #${orderId} marked as PAID`);

        // Send confirmation email
        try {
            await sendTemplatedEmail({
                templateName: 'ORDER_CONFIRMATION',
                to: order.shippingEmail,
                variables: {
                    customerName: order.shippingName,
                    orderId: order.id.toString(),
                    orderTotal: order.totalAmount.toString(),
                    currency: order.currency,
                },
            });
        } catch (emailError) {
            console.error('[Razorpay Webhook] Failed to send email:', emailError);
            // Don't fail the webhook if email fails
        }
    } catch (error) {
        console.error('[Razorpay Webhook] Error handling payment success:', error);
        throw error;
    }
}

async function handlePaymentFailed(event: any) {
    try {
        const payment = event.payload.payment.entity;
        const orderId = payment.notes?.orderId;

        if (!orderId) {
            console.error('[Razorpay Webhook] No orderId in payment notes');
            return;
        }

        // Update order status to failed
        await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                paymentStatus: 'FAILED',
                status: 'CANCELLED',
                paymentDetails: JSON.stringify({
                    error_code: payment.error_code,
                    error_description: payment.error_description,
                }),
            },
        });

        console.log(`[Razorpay Webhook] Order #${orderId} marked as FAILED`);
    } catch (error) {
        console.error('[Razorpay Webhook] Error handling payment failure:', error);
        throw error;
    }
}
