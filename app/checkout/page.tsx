"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Textarea, Button } from '@/components/UI';
import Script from 'next/script';

declare global {
    interface Window {
        Razorpay: any;
        Stripe: any;
    }
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    priceINR?: number;
    priceCAD?: number;
    quantity: number;
    image?: string;
}

interface PaymentSettings {
    razorpayEnabled: boolean;
    razorpayKeyId: string | null;
    stripeEnabled: boolean;
    stripePublishableKey: string | null;
    interacEnabled: boolean;
    interacEmail: string | null;
    interacInstructions: string | null;
}

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [currency, setCurrency] = useState<'INR' | 'CAD'>('INR');
    const [loading, setLoading] = useState(false);
    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'razorpay' | 'stripe' | 'interac' | null>(null);

    // Form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        const savedCurrency = localStorage.getItem('currency') as 'INR' | 'CAD';

        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }

        if (savedCurrency) {
            setCurrency(savedCurrency);
        }

        // Fetch payment settings
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                const ps = data.paymentSettings;
                setPaymentSettings({
                    razorpayEnabled: ps?.razorpayEnabled || false,
                    razorpayKeyId: ps?.razorpayKeyId || null,
                    stripeEnabled: ps?.stripeEnabled || false,
                    stripePublishableKey: ps?.stripePublishableKey || null,
                    interacEnabled: ps?.interacEnabled || false,
                    interacEmail: ps?.interacEmail || null,
                    interacInstructions: ps?.interacInstructions || null,
                });
            })
            .catch((error) => {
                console.error('Failed to fetch payment settings:', error);
            });
    }, []);

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const itemPrice = currency === 'CAD' ? (item.priceCAD || item.price) : (item.priceINR || item.price);
            return total + (itemPrice * item.quantity);
        }, 0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const createOrder = async () => {
        const orderData = {
            items: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: currency === 'CAD' ? (item.priceCAD || item.price) : (item.priceINR || item.price),
            })),
            totalAmount: calculateTotal(),
            currency,
            shippingName: formData.name,
            shippingEmail: formData.email,
            shippingPhone: formData.phone,
            shippingAddress: formData.address,
            paymentGateway: selectedPaymentMethod,
        };

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create order');
        }

        return await response.json();
    };

    const handleRazorpayPayment = async () => {
        try {
            setLoading(true);

            // Create order in database
            const { order } = await createOrder();

            // Create Razorpay order
            const razorpayResponse = await fetch('/api/payment/razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: order.totalAmount,
                    currency: order.currency,
                    orderId: order.id.toString(),
                }),
            });

            const { orderId, amount, currency: rzpCurrency } = await razorpayResponse.json();

            // Initialize Razorpay
            const options = {
                key: paymentSettings?.razorpayKeyId,
                amount,
                currency: rzpCurrency,
                name: 'HEcUPPS',
                description: `Order #${order.id}`,
                order_id: orderId,
                handler: async function (response: any) {
                    // Verify payment
                    await fetch('/api/payment/razorpay', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            orderId: order.id,
                        }),
                    });

                    // Clear cart
                    localStorage.removeItem('cart');

                    // Redirect to success page
                    router.push(`/order-success?orderId=${order.id}`);
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
            setLoading(false);
        } catch (error: any) {
            alert(error.message || 'Payment failed');
            setLoading(false);
        }
    };

    const handleStripePayment = async () => {
        try {
            setLoading(true);

            // Create order in database
            const { order } = await createOrder();

            // Create Stripe payment intent
            const stripeResponse = await fetch('/api/payment/stripe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: order.totalAmount,
                    currency: order.currency,
                    orderId: order.id.toString(),
                }),
            });

            const { clientSecret, paymentIntentId } = await stripeResponse.json();

            // Initialize Stripe
            const stripe = window.Stripe(paymentSettings?.stripePublishableKey);

            const { error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: {
                        // This is a simplified version - you'll need Stripe Elements for a real implementation
                    },
                    billing_details: {
                        name: formData.name,
                        email: formData.email,
                    },
                },
            });

            if (error) {
                throw new Error(error.message);
            }

            // Update order status
            await fetch('/api/payment/stripe', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentIntentId,
                    orderId: order.id,
                }),
            });

            // Clear cart
            localStorage.removeItem('cart');

            // Redirect to success page
            router.push(`/order-success?orderId=${order.id}`);
            setLoading(false);
        } catch (error: any) {
            alert(error.message || 'Payment failed');
            setLoading(false);
        }
    };

    const handleInteracPayment = async () => {
        try {
            setLoading(true);

            // Create order with PENDING payment status
            const { order } = await createOrder();

            // Clear cart
            localStorage.removeItem('cart');

            // Redirect to pending order page
            router.push(`/order-pending?orderId=${order.id}`);
            setLoading(false);
        } catch (error: any) {
            alert(error.message || 'Order creation failed');
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        // Validation
        if (!formData.name || !formData.email || !formData.address) {
            alert('Please fill in all required fields');
            return;
        }

        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
        }

        if (selectedPaymentMethod === 'razorpay') {
            await handleRazorpayPayment();
        } else if (selectedPaymentMethod === 'stripe') {
            await handleStripePayment();
        } else if (selectedPaymentMethod === 'interac') {
            await handleInteracPayment();
        }
    };

    const totalAmount = calculateTotal();
    const hasPaymentMethod = paymentSettings && (
        (paymentSettings.razorpayEnabled && currency === 'INR') ||
        (paymentSettings.stripeEnabled && currency === 'CAD') ||
        (paymentSettings.interacEnabled && currency === 'CAD')
    );

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="text-6xl mb-4">🛒</div>
                    <h1 className="text-xl font-outfit font-bold text-brand-black uppercase tracking-wide mb-4">Your cart is empty</h1>
                    <button onClick={() => router.push('/products')} className="bg-brand-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <Script src="https://js.stripe.com/v3/" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                <div className="mb-8 pb-4 border-b border-brand-border">
                    <h1 className="text-2xl md:text-3xl font-outfit font-bold text-brand-black uppercase tracking-tight">Checkout</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Shipping Details */}
                    <div className="space-y-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-4 pb-3 border-b border-brand-border">Shipping Details</h2>

                        <div className="space-y-4">
                            <Input
                                label="Full Name *"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />

                            <Input
                                label="Email *"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />

                            <Input
                                label="Phone"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />

                            <Textarea
                                label="Shipping Address *"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                rows={4}
                            />
                        </div>

                        {/* Payment Methods */}
                        <div className="mt-8">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-4 pb-3 border-b border-brand-border">Payment Method</h2>

                            {!hasPaymentMethod && (
                                <div className="border border-yellow-300 bg-yellow-50 p-4">
                                    <p className="text-yellow-800 text-sm">
                                        Online ordering is currently unavailable.
                                        Please <a href="/contact" className="underline font-semibold">contact us</a> to place an order.
                                    </p>
                                </div>
                            )}

                            {paymentSettings?.razorpayEnabled && currency === 'INR' && (
                                <label className="flex items-center space-x-3 p-4 border border-brand-border cursor-pointer hover:bg-brand-light transition-colors">
                                    <input type="radio" name="paymentMethod" value="razorpay" checked={selectedPaymentMethod === 'razorpay'} onChange={() => setSelectedPaymentMethod('razorpay')} />
                                    <span className="text-sm font-medium text-brand-black">Razorpay (Cards, UPI, Wallets)</span>
                                </label>
                            )}

                            {paymentSettings?.stripeEnabled && currency === 'CAD' && (
                                <label className="flex items-center space-x-3 p-4 border border-brand-border cursor-pointer hover:bg-brand-light transition-colors mt-2">
                                    <input type="radio" name="paymentMethod" value="stripe" checked={selectedPaymentMethod === 'stripe'} onChange={() => setSelectedPaymentMethod('stripe')} />
                                    <span className="text-sm font-medium text-brand-black">Credit/Debit Card (Stripe)</span>
                                </label>
                            )}

                            {paymentSettings?.interacEnabled && currency === 'CAD' && (
                                <div className="mt-2">
                                    <label className="flex items-center space-x-3 p-4 border border-brand-border cursor-pointer hover:bg-brand-light transition-colors">
                                        <input type="radio" name="paymentMethod" value="interac" checked={selectedPaymentMethod === 'interac'} onChange={() => setSelectedPaymentMethod('interac')} />
                                        <span className="text-sm font-medium text-brand-black">Interac e-Transfer</span>
                                    </label>

                                    {selectedPaymentMethod === 'interac' && (
                                        <div className="mt-3 p-4 border border-brand-accent bg-blue-50">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-black mb-2">Interac e-Transfer Instructions</h3>
                                            <p className="text-sm text-gray-700 mb-1">Send payment to: <strong>{paymentSettings.interacEmail}</strong></p>
                                            <p className="text-sm text-gray-600">{paymentSettings.interacInstructions}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-4 pb-3 border-b border-brand-border">Order Summary</h2>

                        <div className="bg-brand-light border border-brand-border p-6">
                            {cart.map((item) => {
                                const itemPrice = currency === 'CAD' ? (item.priceCAD || item.price) : (item.priceINR || item.price);
                                return (
                                    <div key={item.id} className="flex justify-between mb-4">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">
                                            {currency === 'CAD' ? 'CA$' : '₹'}{(itemPrice * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                );
                            })}

                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total:</span>
                                    <span>{currency === 'CAD' ? 'CA$' : '₹'}{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {hasPaymentMethod && (
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full mt-6 bg-brand-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
