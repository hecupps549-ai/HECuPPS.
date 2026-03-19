"use client";

import React from 'react';
import { Card } from '@/components/UI';

export default function AdminOrdersPage() {
    return (
        <div>
            <div className="mb-8 pb-4 border-b border-brand-border">
                <h1 className="text-2xl font-outfit font-bold text-brand-black uppercase tracking-tight">
                    Orders
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage customer orders and transactions
                </p>
            </div>

            {/* Empty State */}
            <div className="p-16 text-center border border-brand-border bg-white">
                <div className="mb-6">
                    <span className="text-5xl text-gray-300">🛒</span>
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-2">
                    No orders yet
                </h2>
                <p className="text-sm text-gray-500">
                    Orders from customers will appear here
                </p>
            </div>
        </div>
    );
}
