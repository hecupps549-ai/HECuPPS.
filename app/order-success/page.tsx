"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/UI';

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams?.get('orderId');
    const [orderDetails, setOrderDetails] = useState<any>(null);

    useEffect(() => {
        if (orderId) {
            // Optionally fetch order details
            fetch(`/api/orders/${orderId}`)
                .then(res => res.json())
                .then(data => setOrderDetails(data))
                .catch(err => console.error(err));
        }
    }, [orderId]);

    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
                <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
                <p className="text-gray-600 mb-2">Thank you for your purchase.</p>

                {orderId && (
                    <p className="text-lg mb-6">
                        Order ID: <strong>#{orderId}</strong>
                    </p>
                )}

                <p className="text-gray-600 mb-8">
                    You will receive a confirmation email shortly with your order details.
                </p>

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
