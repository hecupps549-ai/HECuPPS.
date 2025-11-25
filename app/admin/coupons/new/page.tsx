"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Textarea, Button, Select, Card } from '@/components/UI';

export default function NewCouponPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        value: '',
        minPurchase: '0',
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        usageLimit: '',
        status: 'Active',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
                    expiryDate: formData.expiryDate || null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Coupon created successfully!');
                router.push('/admin/coupons');
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
            alert('Failed to create coupon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
                    Add New Coupon
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Create a new discount coupon code
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Coupon Details
                        </h2>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Coupon Code"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., SAVE20"
                                    className="uppercase"
                                />

                                <Select
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Select>
                            </div>

                            <Textarea
                                label="Description (Optional)"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Brief description of the coupon offer"
                            />
                        </div>
                    </Card>

                    {/* Discount Configuration */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Discount Configuration
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Select
                                label="Discount Type"
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                                required
                            >
                                <option value="percentage">Percentage</option>
                                <option value="flat">Flat Amount (INR)</option>
                            </Select>

                            <Input
                                label={formData.discountType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                                name="value"
                                type="number"
                                step="0.01"
                                value={formData.value}
                                onChange={handleChange}
                                required
                                placeholder={formData.discountType === 'percentage' ? '20' : '500'}
                            />

                            <Input
                                label="Minimum Purchase (₹)"
                                name="minPurchase"
                                type="number"
                                step="0.01"
                                value={formData.minPurchase}
                                onChange={handleChange}
                                required
                                placeholder="0"
                            />
                        </div>
                    </Card>

                    {/* Validity & Limits */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Validity & Usage Limits
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Input
                                label="Start Date"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Expiry Date (Optional)"
                                name="expiryDate"
                                type="date"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                min={formData.startDate}
                            />

                            <Input
                                label="Usage Limit (Optional)"
                                name="usageLimit"
                                type="number"
                                value={formData.usageLimit}
                                onChange={handleChange}
                                placeholder="Unlimited if empty"
                            />
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                <strong>Note:</strong> Leave expiry date empty for coupons that never expire.
                                Leave usage limit empty for unlimited uses.
                            </p>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Coupon'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
