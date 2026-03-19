"use client";

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/UI';

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Products', value: '0', icon: '📦', trend: '+0%' },
        { label: 'Total Orders', value: '0', icon: '🛒', trend: '+0%' },
        { label: 'Total Users', value: '0', icon: '👥', trend: '+0%' },
        { label: 'Revenue', value: '₹0', icon: '💰', trend: '+0%' },
    ];

    const quickActions = [
        { name: 'Add Product', href: '/admin/products/new', icon: '📦' },
        { name: 'View Orders', href: '/admin/orders', icon: '🛒' },
        { name: 'Manage Users', href: '/admin/users', icon: '👥' },
        { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
    ];

    return (
        <div>
            {/* Page Heading */}
            <div className="mb-8 pb-6 border-b border-brand-border">
                <h1 className="text-2xl font-outfit font-bold text-brand-black uppercase tracking-tight">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your HECuPPS store</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.trend}</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-black mb-1">{stat.value}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</p>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {quickActions.map((action, i) => (
                        <Link
                            key={i}
                            href={action.href}
                            className="flex items-center gap-3 p-4 bg-white border border-brand-border text-brand-black hover:bg-brand-black hover:text-white hover:border-brand-black transition-all group"
                        >
                            <span className="text-xl">{action.icon}</span>
                            <span className="text-sm font-semibold">{action.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Card className="p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-5 pb-4 border-b border-brand-border">
                        Recent Orders
                    </h3>
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">No orders yet</p>
                        <p className="text-xs mt-1">Orders will appear once customers start purchasing</p>
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-5 pb-4 border-b border-brand-border">
                        Low Stock Products
                    </h3>
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">No low-stock products</p>
                        <p className="text-xs mt-1">Add products to start tracking inventory</p>
                    </div>
                </Card>
            </div>

            {/* Getting Started */}
            <div className="border-l-4 border-brand-accent bg-white border border-brand-border p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-4">🚀 Getting Started</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>✓ Configure payment gateways in Settings</p>
                    <p>✓ Add your first product</p>
                    <p>✓ Set up coupons and discounts</p>
                    <p>✓ Customize site settings</p>
                </div>
                <Link href="/admin/settings" className="inline-block bg-brand-black text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-gray-800 transition-colors">
                    Go to Settings
                </Link>
            </div>
        </div>
    );
}
