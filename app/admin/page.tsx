"use client";

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/UI';

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Products', value: '0', icon: '📦', color: 'bg-blue-500' },
        { label: 'Total Orders', value: '0', icon: '🛒', color: 'bg-green-500' },
        { label: 'Total Users', value: '0', icon: '👥', color: 'bg-purple-500' },
        { label: 'Revenue', value: '₹0', icon: '💰', color: 'bg-yellow-500' },
    ];

    const quickActions = [
        { name: 'Add Product', href: '/admin/products/new', icon: '➕', color: 'bg-brand-gold' },
        { name: 'View Orders', href: '/admin/orders', icon: '📋', color: 'bg-blue-600' },
        { name: 'Manage Users', href: '/admin/users', icon: '👤', color: 'bg-purple-600' },
        { name: 'Settings', href: '/admin/settings', icon: '⚙️', color: 'bg-gray-600' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage your HECuPPS store from here
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`${stat.color} p-4 rounded-lg`}>
                                <span className="text-3xl">{stat.icon}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className={`${action.color} text-white p-6 rounded-xl hover:opacity-90 transition-opacity`}
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl">{action.icon}</span>
                                <span className="font-semibold text-lg">{action.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Orders
                    </h3>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No orders yet</p>
                        <p className="text-sm mt-2">Orders will appear here once customers start purchasing</p>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Low Stock Products
                    </h3>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No products added yet</p>
                        <p className="text-sm mt-2">Add products to start tracking inventory</p>
                    </div>
                </Card>
            </div>

            {/* Getting Started Guide */}
            <Card className="mt-8 p-6 bg-brand-gold/10 border-2 border-brand-gold">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    🚀 Getting Started
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    <p>✓ Configure payment gateways in Settings</p>
                    <p>✓ Add your first product</p>
                    <p>✓ Set up coupons and discounts</p>
                    <p>✓ Customize site settings</p>
                </div>
                <Link
                    href="/admin/settings"
                    className="inline-block mt-4 bg-brand-gold text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                    Go to Settings
                </Link>
            </Card>
        </div>
    );
}
