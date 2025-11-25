"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Button, Table, Td, StatusBadge } from '@/components/UI';

interface Coupon {
    id: number;
    code: string;
    discountType: string;
    value: number;
    minPurchase: number;
    startDate: string;
    expiryDate: string | null;
    usageLimit: number | null;
    timesUsed: number;
    status: string;
    description: string | null;
    createdAt: string;
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await fetch('/api/coupons');
            const data = await response.json();
            setCoupons(data.coupons || []);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            setCoupons([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, code: string) => {
        if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;

        try {
            const response = await fetch(`/api/coupons/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Coupon deleted successfully');
                fetchCoupons();
            } else {
                alert('Failed to delete coupon');
            }
        } catch (error) {
            console.error('Error deleting coupon:', error);
            alert('Error deleting coupon');
        }
    };

    const toggleStatus = async (coupon: Coupon) => {
        const newStatus = coupon.status === 'Active' ? 'Inactive' : 'Active';

        try {
            const response = await fetch(`/api/coupons/${coupon.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...coupon, status: newStatus }),
            });

            if (response.ok) {
                fetchCoupons();
            } else {
                alert('Failed to update coupon status');
            }
        } catch (error) {
            console.error('Error updating coupon:', error);
            alert('Error updating coupon status');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDiscount = (coupon: Coupon) => {
        if (coupon.discountType === 'percentage') {
            return `${coupon.value}%`;
        }
        return `₹${coupon.value}`;
    };

    const isExpired = (expiryDate: string | null) => {
        if (!expiryDate) return false;
        return new Date(expiryDate) < new Date();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
                        Coupons
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage discount coupons and promotional codes ({coupons.length} total)
                    </p>
                </div>
                <Link href="/admin/coupons/new">
                    <Button>+ Add Coupon</Button>
                </Link>
            </div>

            {loading ? (
                <Card className="p-12">
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        Loading coupons...
                    </div>
                </Card>
            ) : coupons.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center">
                        <div className="mb-6">
                            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            No coupons yet
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Get started by creating your first discount coupon
                        </p>
                        <Link href="/admin/coupons/new">
                            <Button>Create Your First Coupon</Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <Table headers={['Code', 'Discount', 'Min Purchase', 'Usage', 'Expiry', 'Status', 'Actions']}>
                        {coupons.map(coupon => (
                            <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Td>
                                    <div className="font-mono font-bold text-brand-gold">
                                        {coupon.code}
                                    </div>
                                    {coupon.description && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {coupon.description}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <div className="font-semibold text-gray-900 dark:text-white">
                                        {formatDiscount(coupon)}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {coupon.discountType === 'percentage' ? 'Percentage' : 'Flat'}
                                    </div>
                                </Td>
                                <Td>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        ₹{coupon.minPurchase.toFixed(2)}
                                    </span>
                                </Td>
                                <Td>
                                    <div className="text-sm">
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {coupon.timesUsed}
                                        </span>
                                        {coupon.usageLimit && (
                                            <span className="text-gray-500 dark:text-gray-400">
                                                /{coupon.usageLimit}
                                            </span>
                                        )}
                                        {!coupon.usageLimit && (
                                            <span className="text-gray-500 dark:text-gray-400"> used</span>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    {coupon.expiryDate ? (
                                        <div className={isExpired(coupon.expiryDate) ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                                            <div className="text-sm">{formatDate(coupon.expiryDate)}</div>
                                            {isExpired(coupon.expiryDate) && (
                                                <div className="text-xs">Expired</div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">No expiry</span>
                                    )}
                                </Td>
                                <Td>
                                    <button onClick={() => toggleStatus(coupon)}>
                                        <StatusBadge status={coupon.status} />
                                    </button>
                                </Td>
                                <Td>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/coupons/${coupon.id}/edit`}>
                                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium text-sm">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(coupon.id, coupon.code)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 font-medium text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </Td>
                            </tr>
                        ))}
                    </Table>
                </Card>
            )}
        </div>
    );
}
