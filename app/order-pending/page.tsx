"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/UI';

export default function OrderPendingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams?.get('orderId');
    const [orderDetails, setOrderDetails] = useState<any>(null);

    useEffect(() => {
        if (orderId) {
            fetch(`/api/orders/${orderId}`)
                .then(res => res.json())
                .then(data => setOrderDetails(data))
                .catch(err => console.error(err));
        }
    }, [orderId]);

    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
                <div className="bg-yellow-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold mb-4">Order Pending</h1>
                <p className="text-gray-600 mb-2">Your order has been created.</p>

                {orderId && (
                    <p className="text-lg mb-6">
                        Order ID: <strong>#{orderId}</strong>
                    </p>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h2 className="font-semibold mb-3">Payment Instructions:</h2>
                    <p className="text-sm text-gray-700 mb-4">
                        Please complete your Interac e-Transfer payment to the email address provided during checkout.
                    </p>
                    <p className="text-sm text-gray-700">
                        Once we receive your payment, we will confirm your order and begin processing it.
                        You will receive an email confirmation.
                    </p>
                </div>

                <div className="space-y-4">
                    <Button onClick={() => router.push('/products')} className="w-full">
                        Continue Shopping
                    </Button>

                    {orderId && (
                        <Button
                            onClick={() => router.push(`/orders/${orderId}`)}
                            variant="secondary"
                            className="w-full"
                        >
                            View Order Details
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
