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

                        {/* Upload Section */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Upload Images
                            </label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-brand-gold transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={async (e) => {
                                        const files = e.target.files;
                                        if (!files || files.length === 0) return;

                                        setLoading(true);
                                        try {
                                            const uploadedUrls: string[] = [];
                                            for (const file of Array.from(files)) {
                                                const formData = new FormData();
                                                formData.append('file', file);
                                                formData.append('folder', 'products/images');

                                                const response = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    body: formData,
                                                });

                                                if (response.ok) {
                                                    const data = await response.json();
                                                    uploadedUrls.push(data.url);
                                                } else {
                                                    const error = await response.json();
                                                    throw new Error(error.message || 'Upload failed');
                                                }
                                            }

                                            // Add uploaded URLs to existing URLs
                                            setImageUrls(prev => {
                                                const filtered = prev.filter(url => url.trim());
                                                return [...filtered, ...uploadedUrls, ''];
                                            });

                                            alert(`Successfully uploaded ${uploadedUrls.length} image(s)`);
                                        } catch (error) {
                                            console.error('Upload error:', error);
                                            alert(error instanceof Error ? error.message : 'Failed to upload images');
                                        } finally {
                                            setLoading(false);
                                            e.target.value = ''; // Reset input
                                        }
                                    }}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer inline-flex flex-col items-center"
                                >
                                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Click to upload or drag and drop
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        PNG, JPG, GIF up to 10MB
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Image URLs Section */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Image URLs (or use upload above)
                            </label>
                            {imageUrls.map((url, index) => (
                                <div key={index} className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            label={index === 0 ? 'Primary Image URL' : `Image ${index + 1} URL`}
                                            value={url}
                                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                            placeholder="https://example.com/image.jpg or upload above"
                                            className="flex-1"
                                        />
                                        {url && (
                                            <div className="mt-2">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
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
                                + Add Another Image URL
                            </button>
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
