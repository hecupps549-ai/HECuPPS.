"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input, Textarea, Button, Select, Card } from '@/components/UI';

interface Theme {
    label: string;
}

interface Addon {
    emoji: string;
    label: string;
    priceINR: number;
    priceCAD: number;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    // Advanced Experience Options state
    const [whatsIncluded, setWhatsIncluded] = useState<string[]>(['']);
    const [themes, setThemes] = useState<Theme[]>([{ label: '' }]);
    const [addons, setAddons] = useState<Addon[]>([{ emoji: '', label: '', priceINR: 0, priceCAD: 0 }]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [peaceOfMind, setPeaceOfMind] = useState('');

    const categories = ['Birthday', 'Festive', 'Corporate', 'Wedding', 'Anniversary', 'Thank You', 'Get Well Soon'];
    const statuses = ['Active', 'Inactive', 'OutOfStock'];

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${productId}`);
            if (!response.ok) throw new Error('Product not found');
            
            const data = await response.json();
            const product = data.product;
            
            setFormData({
                name: product.name || '',
                description: product.description || '',
                category: product.category || '',
                priceINR: product.priceINR?.toString() || '',
                priceCAD: product.priceCAD?.toString() || '',
                stock: product.stock?.toString() || '0',
                status: product.status || 'Active',
                featured: product.featured || false,
            });
            
            if (product.images && product.images.length > 0) {
                setImageUrls(product.images.map((img: any) => img.url));
            } else {
                setImageUrls(['']);
            }

            // Load advanced experience options
            if (product.whatsIncluded && product.whatsIncluded.length > 0) {
                setWhatsIncluded(product.whatsIncluded);
            }
            if (product.productExtras) {
                const extras = product.productExtras;
                if (extras.themes && extras.themes.length > 0) setThemes(extras.themes);
                if (extras.addons && extras.addons.length > 0) setAddons(extras.addons);
                if (extras.showDatePicker) setShowDatePicker(true);
                if (extras.peaceOfMind) setPeaceOfMind(extras.peaceOfMind);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Failed to load product details');
            router.push('/admin/products');
        } finally {
            setLoading(false);
        }
    };

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

    const addImageUrl = () => { setImageUrls([...imageUrls, '']); };
    const removeImageUrl = (index: number) => { setImageUrls(imageUrls.filter((_, i) => i !== index)); };

    // What's Included helpers
    const updateIncludedItem = (i: number, val: string) => {
        const arr = [...whatsIncluded]; arr[i] = val; setWhatsIncluded(arr);
    };
    const addIncludedItem = () => setWhatsIncluded([...whatsIncluded, '']);
    const removeIncludedItem = (i: number) => setWhatsIncluded(whatsIncluded.filter((_, idx) => idx !== i));

    // Themes helpers
    const updateTheme = (i: number, val: string) => {
        const arr = [...themes]; arr[i] = { label: val }; setThemes(arr);
    };
    const addTheme = () => setThemes([...themes, { label: '' }]);
    const removeTheme = (i: number) => setThemes(themes.filter((_, idx) => idx !== i));

    // Add-ons helpers
    const updateAddon = (i: number, field: keyof Addon, val: string | number) => {
        const arr = [...addons];
        arr[i] = { ...arr[i], [field]: field === 'emoji' || field === 'label' ? val : Number(val) };
        setAddons(arr);
    };
    const addAddon = () => setAddons([...addons, { emoji: '', label: '', priceINR: 0, priceCAD: 0 }]);
    const removeAddon = (i: number) => setAddons(addons.filter((_, idx) => idx !== i));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('authToken');
            const images = imageUrls
                .filter(url => url.trim())
                .map(url => ({ url, altText: formData.name }));

            // Build extras payload
            const cleanedIncluded = whatsIncluded.filter(s => s.trim());
            const cleanedThemes = themes.filter(t => t.label.trim());
            const cleanedAddons = addons.filter(a => a.label.trim());

            const productExtras = {
                themes: cleanedThemes.length > 0 ? cleanedThemes : undefined,
                addons: cleanedAddons.length > 0 ? cleanedAddons : undefined,
                showDatePicker: showDatePicker || undefined,
                peaceOfMind: peaceOfMind.trim() || undefined,
            };
            const hasExtras = Object.values(productExtras).some(v => v !== undefined);

            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    images,
                    whatsIncluded: cleanedIncluded.length > 0 ? cleanedIncluded : null,
                    productExtras: hasExtras ? productExtras : null,
                }),
            });

            if (response.ok) {
                alert('Product updated successfully!');
                router.push('/admin/products');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg font-medium text-gray-500 animate-pulse">
                    Loading product details...
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
                    Edit Product
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Update details for &ldquo;{formData.name}&rdquo;
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
                            Pricing &amp; Inventory
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
                                Upload New Images
                            </label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-brand-gold transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={async (e) => {
                                        const files = e.target.files;
                                        if (!files || files.length === 0) return;

                                        setSaving(true);
                                        try {
                                            const token = localStorage.getItem('authToken');
                                            const uploadedUrls: string[] = [];
                                            for (const file of Array.from(files)) {
                                                const formData = new FormData();
                                                formData.append('file', file);
                                                formData.append('folder', 'products/images');

                                                const response = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Authorization': `Bearer ${token}`
                                                    },
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

                                            setImageUrls(prev => {
                                                const filtered = prev.filter(url => url.trim());
                                                return [...filtered, ...uploadedUrls, ''];
                                            });

                                            alert(`Successfully uploaded ${uploadedUrls.length} image(s)`);
                                        } catch (error) {
                                            console.error('Upload error:', error);
                                            alert(error instanceof Error ? error.message : 'Failed to upload images');
                                        } finally {
                                            setSaving(false);
                                            e.target.value = '';
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
                                Image URLs (existing or uploaded)
                            </label>
                            {imageUrls.map((url, index) => (
                                <div key={index} className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            label={index === 0 ? 'Primary Image URL' : `Image ${index + 1} URL`}
                                            value={url}
                                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                            placeholder="https://example.com/image.jpg"
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
                                            className="mt-7 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 h-[42px]"
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

                    {/* ════════════════════════════════════════
                        ADVANCED EXPERIENCE OPTIONS
                    ════════════════════════════════════════ */}
                    <Card className="p-6 border-2 border-dashed border-gray-200">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                ✨ Advanced Experience Options
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Optional. These power the interactive features on the product detail page (theme selector, add-ons, etc.)
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* What's Included */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                    📋 What&apos;s Included (Checklist)
                                </label>
                                <div className="space-y-2">
                                    {whatsIncluded.map((item, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <span className="text-green-500 text-lg flex-shrink-0">✓</span>
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={e => updateIncludedItem(i, e.target.value)}
                                                placeholder={`e.g., Fairy Light Canopy`}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-brand-black"
                                            />
                                            {whatsIncluded.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeIncludedItem(i)}
                                                    className="text-red-400 hover:text-red-600 font-bold text-lg leading-none px-1"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addIncludedItem} className="mt-2 text-sm text-brand-black hover:underline font-medium">
                                    + Add Item
                                </button>
                            </div>

                            {/* Theme Selector */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    🎨 Theme Options
                                </label>
                                <p className="text-xs text-gray-400 mb-3">These appear as toggle buttons on the product page (e.g., &quot;Boho Chic&quot;, &quot;Minimalist White&quot;)</p>
                                <div className="space-y-2">
                                    {themes.map((theme, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                value={theme.label}
                                                onChange={e => updateTheme(i, e.target.value)}
                                                placeholder={`e.g., Boho Chic`}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-brand-black"
                                            />
                                            {themes.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTheme(i)}
                                                    className="text-red-400 hover:text-red-600 font-bold text-lg leading-none px-1"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addTheme} className="mt-2 text-sm text-brand-black hover:underline font-medium">
                                    + Add Theme
                                </button>
                            </div>

                            {/* Date Picker Toggle */}
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={showDatePicker}
                                        onChange={e => setShowDatePicker(e.target.checked)}
                                        className="w-4 h-4 text-brand-black border-gray-300 rounded"
                                    />
                                    <div>
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">📅 Show Date &amp; Time Picker</span>
                                        <p className="text-xs text-gray-400">Lets customers pick their preferred event date</p>
                                    </div>
                                </label>
                            </div>

                            {/* Aesthetic Add-ons */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    🛒 Aesthetic Add-ons
                                </label>
                                <p className="text-xs text-gray-400 mb-3">Optional extras customers can toggle. Prices are added to the running total.</p>
                                <div className="space-y-3">
                                    {addons.map((addon, i) => (
                                        <div key={i} className="grid grid-cols-12 gap-2 items-start p-3 border border-gray-200 rounded-lg bg-gray-50">
                                            <div className="col-span-1">
                                                <label className="block text-xs text-gray-500 mb-1">Emoji</label>
                                                <input
                                                    type="text"
                                                    value={addon.emoji}
                                                    onChange={e => updateAddon(i, 'emoji', e.target.value)}
                                                    placeholder="🌹"
                                                    className="w-full px-2 py-2 border border-gray-300 rounded text-sm text-center focus:outline-none focus:border-brand-black"
                                                    maxLength={2}
                                                />
                                            </div>
                                            <div className="col-span-5">
                                                <label className="block text-xs text-gray-500 mb-1">Label</label>
                                                <input
                                                    type="text"
                                                    value={addon.label}
                                                    onChange={e => updateAddon(i, 'label', e.target.value)}
                                                    placeholder="Premium Roses (12)"
                                                    className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-black"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs text-gray-500 mb-1">+₹ (INR)</label>
                                                <input
                                                    type="number"
                                                    value={addon.priceINR}
                                                    onChange={e => updateAddon(i, 'priceINR', e.target.value)}
                                                    placeholder="500"
                                                    min="0"
                                                    className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-black"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs text-gray-500 mb-1">+$ (CAD)</label>
                                                <input
                                                    type="number"
                                                    value={addon.priceCAD}
                                                    onChange={e => updateAddon(i, 'priceCAD', e.target.value)}
                                                    placeholder="8"
                                                    min="0"
                                                    className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-black"
                                                />
                                            </div>
                                            <div className="col-span-2 flex items-end justify-end pb-0.5">
                                                {addons.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAddon(i)}
                                                        className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded text-xs font-bold"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addAddon} className="mt-2 text-sm text-brand-black hover:underline font-medium">
                                    + Add Add-on
                                </button>
                            </div>

                            {/* Peace of Mind */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    🛡️ Peace of Mind Guarantee
                                </label>
                                <p className="text-xs text-gray-400 mb-2">A short guarantee message shown in a green callout box on the product page.</p>
                                <textarea
                                    value={peaceOfMind}
                                    onChange={e => setPeaceOfMind(e.target.value)}
                                    rows={2}
                                    placeholder="e.g., Secure payment. Free rescheduling up to 48 hours before. 100% money-back guarantee if we can't deliver."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-brand-black"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                        >
                            Cancel
                        </button>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Updating...' : 'Update Product'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
