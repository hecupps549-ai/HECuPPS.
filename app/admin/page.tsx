"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Table, Td } from '@/components/UI';

interface Stat {
    label: string;
    value: string;
    icon: string;
    trend: string;
}

interface RecentOrder {
    id: number;
    totalAmount: number;
    currency: string;
    status: string;
    createdAt: string;
    user: {
        name: string;
    };
}

interface LowStockProduct {
    id: number;
    name: string;
    stock: number;
    priceINR: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stat[]>([
        { label: 'Total Products', value: '...', icon: '📦', trend: '+0%' },
        { label: 'Total Orders', value: '...', icon: '🛒', trend: '+0%' },
        { label: 'Total Users', value: '...', icon: '👥', trend: '+0%' },
        { label: 'Revenue', value: '...', icon: '💰', trend: '+0%' },
    ]);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
                setRecentOrders(data.recentOrders || []);
                setLowStockProducts(data.lowStockProducts || []);
            } else {
                console.error('Failed to fetch stats:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { name: 'Add Product', href: '/admin/products/new', icon: '📦' },
        { name: 'View Orders', href: '/admin/orders', icon: '🛒' },
        { name: 'Manage Users', href: '/admin/users', icon: '👥' },
        { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
    ];

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED': return 'text-green-600 bg-green-50';
            case 'PENDING': return 'text-yellow-600 bg-yellow-50';
            case 'CANCELLED': return 'text-red-600 bg-red-50';
            default: return 'text-blue-600 bg-blue-50';
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Heading */}
            <div className="pb-6 border-b border-brand-border dark:border-gray-800">
                <h1 className="text-2xl font-outfit font-bold text-brand-black dark:text-white uppercase tracking-tight">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your HECuPPS store</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.trend}</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-black dark:text-white mb-1">
                            {loading ? <span className="animate-pulse">...</span> : stat.value}
                        </p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</p>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-brand-black dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {quickActions.map((action, i) => (
                        <Link
                            key={i}
                            href={action.href}
                            className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-brand-border dark:border-gray-800 text-brand-black dark:text-white hover:bg-brand-black hover:text-white dark:hover:bg-white dark:hover:text-brand-black transition-all group"
                        >
                            <span className="text-xl">{action.icon}</span>
                            <span className="text-sm font-semibold">{action.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-0 overflow-hidden">
                    <div className="p-6 border-b border-brand-border dark:border-gray-800 flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black dark:text-white">
                            Recent Orders
                        </h3>
                        <Link href="/admin/orders" className="text-xs font-semibold text-brand-accent hover:underline">
                            View All
                        </Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <p className="text-sm">No orders yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                                    <tr>
                                        <th className="px-6 py-3 border-b dark:border-gray-700">Order ID</th>
                                        <th className="px-6 py-3 border-b dark:border-gray-700">Customer</th>
                                        <th className="px-6 py-3 border-b dark:border-gray-700">Status</th>
                                        <th className="px-6 py-3 border-b dark:border-gray-700">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 border-b dark:border-gray-800 font-medium dark:text-gray-200">#{order.id}</td>
                                            <td className="px-6 py-4 border-b dark:border-gray-800 dark:text-gray-400">{order.user.name}</td>
                                            <td className="px-6 py-4 border-b dark:border-gray-800">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 border-b dark:border-gray-800 font-semibold dark:text-white">₹{order.totalAmount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                <Card className="p-0 overflow-hidden">
                    <div className="p-6 border-b border-brand-border dark:border-gray-800 flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black dark:text-white">
                            Low Stock Products
                        </h3>
                        <Link href="/admin/products" className="text-xs font-semibold text-brand-accent hover:underline">
                            Inventory
                        </Link>
                    </div>
                    {lowStockProducts.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <p className="text-sm">All products adequately stocked</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                                    <tr>
                                        <th className="px-6 py-3 border-b dark:border-gray-700">Product</th>
                                        <th className="px-6 py-3 border-b dark:border-gray-700 text-center">Stock</th>
                                        <th className="px-6 py-3 border-b dark:border-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 border-b dark:border-gray-800 font-medium dark:text-gray-200">{product.name}</td>
                                            <td className="px-6 py-4 border-b dark:border-gray-800 text-center">
                                                <span className={`font-bold ${product.stock <= 2 ? 'text-red-500' : 'text-yellow-600'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 border-b dark:border-gray-800">
                                                <Link 
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="text-xs font-bold text-brand-black dark:text-white hover:text-brand-accent uppercase tracking-widest"
                                                >
                                                    Restock
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            {/* Getting Started Guide */}
            <div className="bg-brand-black dark:bg-gray-900 text-white p-8 border border-brand-border dark:border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-3">🚀 Store Launch Checklist</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs text-gray-400">
                            <p className="flex items-center gap-2"><span className="text-brand-accent">✓</span> Configure payment gateways</p>
                            <p className="flex items-center gap-2"><span className="text-brand-accent">✓</span> Add your curated hampers</p>
                            <p className="flex items-center gap-2"><span className="text-brand-accent">✓</span> Set up discount codes</p>
                            <p className="flex items-center gap-2"><span className="text-brand-accent">✓</span> Customize brand identity</p>
                        </div>
                    </div>
                    <Link href="/admin/settings" className="whitespace-nowrap bg-brand-accent text-brand-black text-xs font-bold uppercase tracking-widest px-8 py-3.5 hover:bg-white transition-colors">
                        Store Settings
                    </Link>
                </div>
            </div>
        </div>
    );
}
