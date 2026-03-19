"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

export default function CartPage() {
    const { cart, updateCartQuantity, removeFromCart, clearCart, formatCurrency } = useAppContext();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                {/* Page Header */}
                <div className="flex justify-between items-baseline mb-8 pb-4 border-b border-brand-border">
                    <h1 className="text-2xl md:text-3xl font-outfit font-bold text-brand-black uppercase tracking-tight">
                        Shopping Cart
                    </h1>
                    {cart.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-xs text-gray-400 hover:text-red-600 font-semibold uppercase tracking-wider transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="text-6xl mb-6">🛒</div>
                        <h2 className="text-xl font-outfit font-bold text-brand-black mb-2 uppercase tracking-wide">Your cart is empty</h2>
                        <p className="text-gray-500 text-sm mb-8">Discover our curated gift hampers</p>
                        <Link
                            href="/products"
                            className="bg-brand-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                        >
                            Browse Hampers
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-5 p-5 border border-brand-border bg-white">
                                    {/* Image */}
                                    <div className="relative w-24 h-24 flex-shrink-0 bg-brand-light">
                                        {item.images && item.images.length > 0 ? (
                                            <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">📦</div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-grow">
                                        <h3 className="text-sm font-bold text-brand-black mb-0.5">{item.name}</h3>
                                        {item.category && <p className="text-xs text-brand-accent uppercase tracking-wider mb-2">{item.category}</p>}
                                        <p className="text-base font-bold text-brand-black">{formatCurrency(item.price)}</p>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-xs text-gray-400 hover:text-red-600 font-semibold uppercase tracking-wider transition-colors"
                                        >
                                            Remove
                                        </button>
                                        <div className="flex items-center border border-brand-border">
                                            <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-brand-black hover:bg-brand-light transition-colors">−</button>
                                            <span className="w-10 text-center text-sm font-semibold text-brand-black">{item.quantity}</span>
                                            <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-brand-black hover:bg-brand-light transition-colors">+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="border border-brand-border p-6 bg-brand-light sticky top-24">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-6 pb-4 border-b border-brand-border">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-gray-400">Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="border-t border-brand-border pt-4 mb-6">
                                    <div className="flex justify-between font-bold text-brand-black">
                                        <span className="uppercase tracking-wider text-sm">Total</span>
                                        <span className="text-xl">{formatCurrency(subtotal)}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="block w-full bg-brand-black text-white text-center py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors mb-3"
                                >
                                    Proceed to Checkout
                                </Link>
                                <Link
                                    href="/products"
                                    className="block w-full text-center text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-brand-black transition-colors py-2"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
