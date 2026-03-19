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
            <div className="flex justify-between items-end mb-8 pb-4 border-b border-brand-border">
                <div>
                    <h1 className="text-2xl font-outfit font-bold text-brand-black uppercase tracking-tight">
                        Coupons
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage discount coupons and promotional codes ({coupons.length} total)
                    </p>
                </div>
                <Link href="/admin/coupons/new">
                    <Button>+ ADD COUPON</Button>
                </Link>
            </div>

            {loading ? (
                <div className="p-12 text-center text-sm text-gray-400 uppercase tracking-widest border border-brand-border bg-white">
                    Loading coupons...
                </div>
            ) : coupons.length === 0 ? (
                <div className="p-16 text-center border border-brand-border bg-white">
                    <div className="mb-6">
                        <span className="text-5xl text-gray-300">🎫</span>
                    </div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-2">
                        No coupons yet
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Get started by creating your first discount coupon
                    </p>
                    <Link href="/admin/coupons/new">
                        <Button>CREATE YOUR FIRST COUPON</Button>
                    </Link>
                </div>
            ) : (
                <div className="border border-brand-border bg-white overflow-hidden">
                    <Table headers={['Code', 'Discount', 'Min Purchase', 'Usage', 'Expiry', 'Status', 'Actions']}>
                        {coupons.map(coupon => (
                            <tr key={coupon.id} className="hover:bg-brand-light transition-colors border-b border-brand-border last:border-0">
                                <Td>
                                    <div className="font-mono font-bold text-brand-black tracking-widest">
                                        {coupon.code}
                                    </div>
                                    {coupon.description && (
                                        <div className="text-xs text-brand-accent mt-1">
                                            {coupon.description}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <div className="font-semibold text-brand-black">
                                        {formatDiscount(coupon)}
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                                        {coupon.discountType === 'percentage' ? 'Perc.' : 'Flat'}
                                    </div>
                                </Td>
                                <Td>
                                    <span className="text-sm text-brand-black font-medium">
                                        ₹{coupon.minPurchase.toFixed(2)}
                                    </span>
                                </Td>
                                <Td>
                                    <div className="text-sm text-brand-black">
                                        <span className="font-semibold">
                                            {coupon.timesUsed}
                                        </span>
                                        {coupon.usageLimit && (
                                            <span className="text-gray-500">
                                                /{coupon.usageLimit}
                                            </span>
                                        )}
                                        {!coupon.usageLimit && (
                                            <span className="text-gray-400 text-xs ml-1 uppercase">uses</span>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    {coupon.expiryDate ? (
                                        <div className={isExpired(coupon.expiryDate) ? 'text-red-500' : 'text-gray-600'}>
                                            <div className="text-sm">{formatDate(coupon.expiryDate)}</div>
                                            {isExpired(coupon.expiryDate) && (
                                                <div className="text-xs font-bold uppercase tracking-widest mt-1">Expired</div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">No Expiry</span>
                                    )}
                                </Td>
                                <Td>
                                    <button onClick={() => toggleStatus(coupon)}>
                                        <StatusBadge status={coupon.status} />
                                    </button>
                                </Td>
                                <Td>
                                    <div className="flex gap-4">
                                        <Link href={`/admin/coupons/${coupon.id}/edit`}>
                                            <button className="text-xs font-bold uppercase tracking-widest text-brand-black hover:text-brand-accent transition-colors">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(coupon.id, coupon.code)}
                                            className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </Td>
                            </tr>
                        ))}
                    </Table>
                </div>
            )}
        </div>
    );
}
