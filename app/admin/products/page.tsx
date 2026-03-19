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
            <div className="flex justify-between items-end mb-8 pb-4 border-b border-brand-border">
                <div>
                    <h1 className="text-2xl font-outfit font-bold text-brand-black uppercase tracking-tight">
                        Products
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your gift hampers and products ({products.length} total)
                    </p>
                </div>
                <Link href="/admin/products/new">
                    <Button>+ ADD PRODUCT</Button>
                </Link>
            </div>

            {loading ? (
                <div className="p-12 text-center text-sm text-gray-400 uppercase tracking-widest border border-brand-border bg-white">
                    Loading products...
                </div>
            ) : products.length === 0 ? (
                <div className="p-16 text-center border border-brand-border bg-white">
                    <div className="mb-6">
                        <span className="text-5xl text-gray-300">🎁</span>
                    </div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-2">
                        No products yet
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Get started by adding your first product
                    </p>
                    <Link href="/admin/products/new">
                        <Button>CREATE YOUR FIRST PRODUCT</Button>
                    </Link>
                </div>
            ) : (
                <div className="border border-brand-border bg-white overflow-hidden">
                    <Table headers={['Product', 'Category', 'Price (INR)', 'Price (CAD)', 'Stock', 'Status', 'Actions']}>
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-brand-light transition-colors border-b border-brand-border last:border-0">
                                <Td>
                                    <div>
                                        <div className="text-sm font-semibold text-brand-black">
                                            {product.name}
                                        </div>
                                        {product.featured && (
                                            <span className="text-[10px] font-bold tracking-widest text-brand-accent uppercase mt-1 inline-block">
                                                FEATURED
                                            </span>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    <span className="text-sm text-gray-600">
                                        {product.category || '-'}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-sm font-medium text-brand-black">
                                        ₹{product.priceINR?.toFixed(2) || '0.00'}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-sm font-medium text-brand-black">
                                        ${product.priceCAD?.toFixed(2) || '0.00'}
                                    </span>
                                </Td>
                                <Td>
                                    <span className={`text-sm ${product.stock < 10 ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                                        {product.stock}
                                    </span>
                                </Td>
                                <Td>
                                    <button onClick={() => toggleStatus(product)}>
                                        <StatusBadge status={product.status} />
                                    </button>
                                </Td>
                                <Td>
                                    <div className="flex gap-4">
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            <button className="text-xs font-bold uppercase tracking-widest text-brand-black hover:text-brand-accent transition-colors">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
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
