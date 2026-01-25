"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductImage {
    id: number;
    url: string;
    altText: string | null;
    isPrimary: boolean;
    order: number;
}

interface Product {
    id: number;
    name: string;
    description: string | null;
    category: string | null;
    priceINR: number | null;
    priceCAD: number | null;
    stock: number;
    status: string;
    featured: boolean;
    images: ProductImage[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products?status=Active');
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Get unique categories
    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

    // Filter products by category
    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    const getPrimaryImage = (product: Product) => {
        const primaryImage = product.images.find(img => img.isPrimary);
        return primaryImage?.url || product.images[0]?.url || '/placeholder-product.jpg';
    };

    return (
        <div className="min-h-screen py-12 bg-gradient-to-br from-brand-cream via-white to-brand-gold/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-brand-dark dark:text-brand-cream mb-4">
                        Our Premium Hampers
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Discover our curated collection of luxury gift hampers
                    </p>
                </div>

                {/* Category Filter */}
                {categories.length > 1 && !loading && (
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${selectedCategory === category
                                        ? 'bg-brand-gold text-white shadow-lg scale-105'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-brand-gold/10 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {category === 'all' ? 'All Products' : category}
                            </button>
                        ))}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-gold mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-center max-w-md">
                            <div className="mb-6">
                                <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-playfair font-semibold text-gray-900 dark:text-white mb-2">
                                {selectedCategory === 'all' ? 'No Products Available' : 'No Products in This Category'}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {selectedCategory === 'all'
                                    ? 'Our exquisite collection of gift hampers is being prepared. Check back soon!'
                                    : 'Try selecting a different category to view available products.'}
                            </p>
                            {selectedCategory !== 'all' && (
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className="inline-block bg-brand-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all mb-4"
                                >
                                    View All Products
                                </button>
                            )}
                            <Link
                                href="/"
                                className="inline-block bg-white dark:bg-gray-800 text-brand-dark dark:text-brand-cream border-2 border-brand-gold px-6 py-3 rounded-lg font-semibold hover:bg-brand-gold hover:text-white transition-all"
                            >
                                Return Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Product Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:scale-105"
                            >
                                {/* Product Image */}
                                <div className="relative h-64 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                    <Image
                                        src={getPrimaryImage(product)}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                    {/* Featured Badge */}
                                    {product.featured && (
                                        <div className="absolute top-4 left-4 bg-brand-gold text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                            ⭐ Featured
                                        </div>
                                    )}
                                    {/* Stock Warning */}
                                    {product.stock < 10 && product.stock > 0 && (
                                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                            Only {product.stock} left!
                                        </div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="p-6">
                                    {/* Category */}
                                    {product.category && (
                                        <p className="text-xs uppercase tracking-wider text-brand-gold font-semibold mb-2">
                                            {product.category}
                                        </p>
                                    )}

                                    {/* Product Name */}
                                    <h3 className="text-xl font-playfair font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>

                                    {/* Description */}
                                    {product.description && (
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                            {product.description}
                                        </p>
                                    )}

                                    {/* Pricing */}
                                    <div className="mb-4 space-y-1">
                                        {product.priceINR && (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">INR:</span>
                                                <span className="text-2xl font-bold text-brand-dark dark:text-brand-cream">
                                                    ₹{product.priceINR.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        {product.priceCAD && (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">CAD:</span>
                                                <span className="text-xl font-semibold text-brand-dark dark:text-brand-cream">
                                                    ${product.priceCAD.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="block w-full bg-brand-gold text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
