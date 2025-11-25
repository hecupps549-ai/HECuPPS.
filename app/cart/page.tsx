import React from 'react';
import Link from 'next/link';

export default function CartPage() {
    // Empty cart state for now
    const cartItems: any[] = [];

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-playfair font-bold text-brand-dark dark:text-brand-cream mb-8">
                    Shopping Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-center max-w-md">
                            <div className="mb-6">
                                <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-playfair font-semibold text-gray-900 dark:text-white mb-2">
                                Your cart is empty
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Start shopping to add items to your cart
                            </p>
                            <Link
                                href="/products"
                                className="inline-block bg-brand-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                            >
                                Browse Hampers
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            {/* Cart items will go here */}
                        </div>
                        <div>
                            {/* Order summary will go here */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
