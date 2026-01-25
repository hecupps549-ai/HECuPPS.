"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

export default function CartPage() {
    const { cart, updateCartQuantity, removeFromCart, clearCart, formatCurrency } = useAppContext();

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="min-h-screen py-12 bg-gradient-to-br from-brand-cream via-white to-brand-gold/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-playfair font-bold text-brand-dark dark:text-brand-cream">
                        Shopping Cart
                    </h1>
                    {cart.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-red-600 hover:text-red-700 font-semibold"
                        >
                            Clear Cart
                        </button>
                    )}
                </div>

                {cart.length === 0 ? (
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
                        <div className="md:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md flex gap-6"
                                >
                                    {/* Product Image */}
                                    <div className="relative w-24 h-24 flex-shrink-0">
                                        {item.images && item.images.length > 0 ? (
                                            <Image
                                                src={item.images[0]}
                                                alt={item.name}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                            {item.name}
                                        </h3>
                                        {item.category && (
                                            <p className="text-sm text-brand-gold mb-2">{item.category}</p>
                                        )}
                                        <p className="text-xl font-bold text-brand-dark dark:text-brand-cream">
                                            {formatCurrency(item.price)}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-600 hover:text-red-700 text-sm font-semibold"
                                        >
                                            Remove
                                        </button>

                                        <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg">
                                            <button
                                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md h-fit sticky top-4">
                            <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal ({cart.length} items)</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                                    <span>Total</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="block w-full bg-brand-gold text-white text-center px-6 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl mb-3"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                href="/products"
                                className="block w-full text-center text-brand-gold hover:text-brand-gold/80 font-semibold py-2 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
