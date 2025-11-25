"use client";

import React from 'react';
import { Card } from '@/components/UI';

export default function AdminOrdersPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
                    Orders
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage customer orders and transactions
                </p>
            </div>

            {/* Empty State */}
            <Card className="p-12">
                <div className="text-center">
                    <div className="mb-6">
                        <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        No orders yet
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Orders from customers will appear here
                    </p>
                </div>
            </Card>
        </div>
    );
}
