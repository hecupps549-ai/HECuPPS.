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
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                <Button onClick={() => router.push('/products')}>
                    Continue Shopping
                </Button>
            </div>
        );
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <Script src="https://js.stripe.com/v3/" />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Shipping Details */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>

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
                            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>

                            {!hasPaymentMethod && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-yellow-800">
                                        Online ordering is currently unavailable.
                                        Please <a href="/contact" className="underline">contact us</a> to place an order.
                                    </p>
                                </div>
                            )}

                            {paymentSettings?.razorpayEnabled && currency === 'INR' && (
                                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="razorpay"
                                        checked={selectedPaymentMethod === 'razorpay'}
                                        onChange={() => setSelectedPaymentMethod('razorpay')}
                                    />
                                    <span className="font-medium">Razorpay (Cards, UPI, Wallets)</span>
                                </label>
                            )}

                            {paymentSettings?.stripeEnabled && currency === 'CAD' && (
                                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 mt-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="stripe"
                                        checked={selectedPaymentMethod === 'stripe'}
                                        onChange={() => setSelectedPaymentMethod('stripe')}
                                    />
                                    <span className="font-medium">Credit/Debit Card (Stripe)</span>
                                </label>
                            )}

                            {paymentSettings?.interacEnabled && currency === 'CAD' && (
                                <div className="mt-2">
                                    <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="interac"
                                            checked={selectedPaymentMethod === 'interac'}
                                            onChange={() => setSelectedPaymentMethod('interac')}
                                        />
                                        <span className="font-medium">Interac e-Transfer</span>
                                    </label>

                                    {selectedPaymentMethod === 'interac' && (
                                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <h3 className="font-semibold mb-2">Interac e-Transfer Instructions:</h3>
                                            <p className="text-sm mb-2">
                                                Send payment to: <strong>{paymentSettings.interacEmail}</strong>
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                {paymentSettings.interacInstructions}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

                        <div className="bg-gray-50 rounded-lg p-6">
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
                            <Button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full mt-6"
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
