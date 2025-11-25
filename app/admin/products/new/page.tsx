"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Textarea, Button, Select, Card } from '@/components/UI';

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        priceINR: '',
        priceCAD: '',
        stock: '0',
        status: 'Active',
        featured: false,
    });
    const [imageUrls, setImageUrls] = useState<string[]>(['']);

    const categories = ['Birthday', 'Festive', 'Corporate', 'Wedding', 'Anniversary', 'Thank You', 'Get Well Soon'];
    const statuses = ['Active', 'Inactive', 'OutOfStock'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleImageUrlChange = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const addImageUrl = () => {
        setImageUrls([...imageUrls, '']);
    };

    const removeImageUrl = (index: number) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const images = imageUrls
                .filter(url => url.trim())
                .map(url => ({ url, altText: formData.name }));

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    images,
                }),
            });

            if (response.ok) {
                alert('Product created successfully!');
                router.push('/admin/products');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
                    Add New Product
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Create a new gift hamper product
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Basic Information
                        </h2>
                        <div className="space-y-4">
                            <Input
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Premium Birthday Hamper"
                            />

                            <Textarea
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Describe the hamper contents and what makes it special..."
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <Select
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </Select>

                                <Select
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* Pricing */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Pricing & Inventory
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Input
                                label="Price (INR)"
                                name="priceINR"
                                type="number"
                                step="0.01"
                                value={formData.priceINR}
                                onChange={handleChange}
                                required
                                placeholder="2999.00"
                            />

                            <Input
                                label="Price (CAD)"
                                name="priceCAD"
                                type="number"
                                step="0.01"
                                value={formData.priceCAD}
                                onChange={handleChange}
                                required
                                placeholder="49.99"
                            />

                            <Input
                                label="Stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                placeholder="10"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Feature this product on homepage
                                </span>
                            </label>
                        </div>
                    </Card>

                    {/* Images */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Product Images
                        </h2>
                        <div className="space-y-3">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        label={index === 0 ? 'Primary Image URL' : `Image ${index + 1} URL`}
                                        value={url}
                                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="flex-1"
                                    />
                                    {imageUrls.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImageUrl(index)}
                                            className="mt-7 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addImageUrl}
                                className="text-brand-gold hover:underline text-sm font-medium"
                            >
                                + Add Another Image
                            </button>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Tip: You can use free image hosting services like Imgur or upload to your own CDN
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
                            {loading ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
