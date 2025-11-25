"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Button, Table, Td, StatusBadge } from '@/components/UI';

interface Product {
    id: number;
    name: string;
    category: string | null;
    priceINR: number | null;
    priceCAD: number | null;
    stock: number;
    status: string;
    featured: boolean;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Product deleted successfully');
                fetchProducts();
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product');
        }
    };

    const toggleStatus = async (product: Product) => {
        const newStatus = product.status === 'Active' ? 'Inactive' : 'Active';

        try {
            const response = await fetch(`/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...product, status: newStatus }),
            });

            if (response.ok) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
                        Products
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your gift hampers and products ({products.length} total)
                    </p>
                </div>
                <Link href="/admin/products/new">
                    <Button>+ Add Product</Button>
                </Link>
            </div>

            {loading ? (
                <Card className="p-12">
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        Loading products...
                    </div>
                </Card>
            ) : products.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center">
                        <div className="mb-6">
                            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            No products yet
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Get started by adding your first product
                        </p>
                        <Link href="/admin/products/new">
                            <Button>Create Your First Product</Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <Table headers={['Product', 'Category', 'Price (INR)', 'Price (CAD)', 'Stock', 'Status', 'Actions']}>
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Td>
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {product.name}
                                        </div>
                                        {product.featured && (
                                            <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-1 rounded">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                </Td>
                                <Td>{product.category || '-'}</Td>
                                <Td>₹{product.priceINR?.toFixed(2) || '0.00'}</Td>
                                <Td>${product.priceCAD?.toFixed(2) || '0.00'}</Td>
                                <Td>
                                    <span className={product.stock < 10 ? 'text-red-600 font-semibold' : ''}>
                                        {product.stock}
                                    </span>
                                </Td>
                                <Td>
                                    <button onClick={() => toggleStatus(product)}>
                                        <StatusBadge status={product.status} />
                                    </button>
                                </Td>
                                <Td>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium text-sm">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
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
