import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { sendTemplatedEmail } from '@/lib/email-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mockkey', {
    apiVersion: '2025-02-24.acacia',
});

/**
 * Stripe Webhook Handler
 * Handles payment events from Stripe
 * 
 * Events handled:
 * - payment_intent.succeeded - Payment successfully completed
 * - payment_intent.payment_failed - Payment failed
 * - charge.refunded - Payment refunded
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'No signature found' },
                { status: 400 }
            );
        }

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('STRIPE_WEBHOOK_SECRET is not configured');
            return NextResponse.json(
                { error: 'Webhook secret not configured' },
                { status: 500 }
            );
        }

        // Verify webhook signature
        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                webhookSecret
            );
        } catch (err: any) {
            console.error('[Stripe Webhook] Signature verification failed:', err.message);
            return NextResponse.json(
                { error: `Webhook signature verification failed: ${err.message}` },
                { status: 400 }
            );
        }

        console.log(`[Stripe Webhook] Event: ${event.type}`);

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
                break;

            case 'charge.refunded':
                await handleRefund(event.data.object as Stripe.Charge);
                break;

            default:
                console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('[Stripe Webhook] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    try {
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
            console.error('[Stripe Webhook] No orderId in payment intent metadata');
            return;
        }

        // Update order in database
        const order = await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                paymentStatus: 'PAID',
                status: 'PROCESSING',
                transactionId: paymentIntent.id,
                paymentDetails: JSON.stringify({
                    payment_method: paymentIntent.payment_method,
                    amount: paymentIntent.amount / 100,
                    currency: paymentIntent.currency,
                    receipt_email: paymentIntent.receipt_email,
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

        console.log(`[Stripe Webhook] Order #${orderId} marked as PAID`);

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
            console.error('[Stripe Webhook] Failed to send email:', emailError);
            // Don't fail the webhook if email fails
        }
    } catch (error) {
        console.error('[Stripe Webhook] Error handling payment success:', error);
        throw error;
    }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    try {
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
            console.error('[Stripe Webhook] No orderId in payment intent metadata');
            return;
        }

        // Update order status to failed
        await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                paymentStatus: 'FAILED',
                status: 'CANCELLED',
                paymentDetails: JSON.stringify({
                    error: paymentIntent.last_payment_error,
                }),
            },
        });

        console.log(`[Stripe Webhook] Order #${orderId} marked as FAILED`);
    } catch (error) {
        console.error('[Stripe Webhook] Error handling payment failure:', error);
        throw error;
    }
}

async function handleRefund(charge: Stripe.Charge) {
    try {
        // Find the order by transaction ID
        const order = await prisma.order.findFirst({
            where: { transactionId: charge.payment_intent as string },
        });

        if (!order) {
            console.error('[Stripe Webhook] Order not found for refund');
            return;
        }

        // Update order status
        await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: 'REFUNDED',
                status: 'REFUNDED',
            },
        });

        console.log(`[Stripe Webhook] Order #${order.id} marked as REFUNDED`);
    } catch (error) {
        console.error('[Stripe Webhook] Error handling refund:', error);
        throw error;
    }
}
