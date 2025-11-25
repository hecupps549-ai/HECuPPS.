import Razorpay from 'razorpay';
import Stripe from 'stripe';
import prisma from './prisma';
import crypto from 'crypto';

// Initialize payment gateways
let razorpayInstance: Razorpay | null = null;
let stripeInstance: Stripe | null = null;

export async function getPaymentSettings() {
    const settings = await prisma.paymentSettings.findFirst();
    return settings;
}

export async function getRazorpayInstance() {
    if (razorpayInstance) return razorpayInstance;

    const settings = await getPaymentSettings();

    if (!settings?.razorpayEnabled || !settings.razorpayKeyId || !settings.razorpayKeySecret) {
        return null;
    }

    razorpayInstance = new Razorpay({
        key_id: settings.razorpayKeyId,
        key_secret: settings.razorpayKeySecret,
    });

    return razorpayInstance;
}

export async function getStripeInstance() {
    if (stripeInstance) return stripeInstance;

    const settings = await getPaymentSettings();

    if (!settings?.stripeEnabled || !settings.stripeSecretKey) {
        return null;
    }

    stripeInstance = new Stripe(settings.stripeSecretKey, {
        apiVersion: '2025-02-24.acacia',
    });

    return stripeInstance;
}

export async function createRazorpayOrder(amount: number, currency: string = 'INR', orderId: string) {
    const razorpay = await getRazorpayInstance();

    if (!razorpay) {
        throw new Error('Razorpay is not enabled or configured');
    }

    const options = {
        amount: Math.round(amount * 100), // Amount in paise
        currency,
        receipt: orderId,
        notes: {
            orderId,
        },
    };

    const order = await razorpay.orders.create(options);
    return order;
}

export async function verifyRazorpaySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
): Promise<boolean> {
    const settings = await getPaymentSettings();

    if (!settings?.razorpayKeySecret) {
        throw new Error('Razorpay secret not configured');
    }

    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generated_signature = crypto
        .createHmac('sha256', settings.razorpayKeySecret)
        .update(text)
        .digest('hex');

    return generated_signature === razorpaySignature;
}

export async function createStripePaymentIntent(
    amount: number,
    currency: string = 'cad',
    orderId: string
) {
    const stripe = await getStripeInstance();

    if (!stripe) {
        throw new Error('Stripe is not enabled or configured');
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Amount in cents
        currency: currency.toLowerCase(),
        metadata: {
            orderId,
        },
    });

    return paymentIntent;
}

export async function refundRazorpayPayment(paymentId: string, amount?: number) {
    const razorpay = await getRazorpayInstance();

    if (!razorpay) {
        throw new Error('Razorpay is not enabled or configured');
    }

    const refundData: any = {
        payment_id: paymentId,
    };

    if (amount) {
        refundData.amount = Math.round(amount * 100);
    }

    const refund = await razorpay.payments.refund(paymentId, refundData);
    return refund;
}

export async function refundStripePayment(paymentIntentId: string, amount?: number) {
    const stripe = await getStripeInstance();

    if (!stripe) {
        throw new Error('Stripe is not enabled or configured');
    }

    const refundData: any = {
        payment_intent: paymentIntentId,
    };

    if (amount) {
        refundData.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundData);
    return refund;
}

export async function arePaymentGatewaysEnabled(): Promise<boolean> {
    const settings = await getPaymentSettings();

    if (!settings) return false;

    return (
        settings.razorpayEnabled ||
        settings.stripeEnabled ||
        settings.paypalEnabled ||
        settings.interacEnabled
    );
}
