"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

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

interface PaymentSettings {
    razorpayEnabled: boolean;
    stripeEnabled: boolean;
    paypalEnabled: boolean;
    interacEnabled: boolean;
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = (params?.id ?? '') as string;

    const { addToCart: addToCartContext } = useAppContext();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartSuccess, setCartSuccess] = useState(false);

    useEffect(() => {
        fetchProductAndSettings();
    }, [productId]);

    const fetchProductAndSettings = async () => {
        try {
            setLoading(true);
            const [productRes, settingsRes] = await Promise.all([
                fetch(`/api/products/${productId}`),
                fetch('/api/settings')
            ]);

            if (!productRes.ok) {
                setError(productRes.status === 404 ? 'Product not found' : 'Failed to load product');
                return;
            }

            const productData = await productRes.json();
            const settingsData = await settingsRes.json();

            setProduct(productData.product);
            setPaymentSettings(settingsData.paymentSettings);

            if (productData.product.images.length > 0) {
                const primaryImage = productData.product.images.find((img: ProductImage) => img.isPrimary);
                setSelectedImage(primaryImage?.url || productData.product.images[0]?.url);
            }
        } catch (err) {
            setError('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const arePaymentsEnabled = paymentSettings
        ? (paymentSettings.razorpayEnabled || paymentSettings.stripeEnabled ||
            paymentSettings.paypalEnabled || paymentSettings.interacEnabled)
        : false;

    const handleAddToCart = () => {
        if (!product) return;
        setAddingToCart(true);
        const cartItem = {
            id: product.id.toString(),
            name: product.name,
            description: product.description || '',
            price: product.priceINR || 0,
            category: product.category || '',
            stock: product.stock,
            images: product.images.map(img => img.url),
            quantity: quantity,
            customization: { messageCard: '', wrapping: '', ribbon: '' }
        };
        addToCartContext(cartItem);
        setCartSuccess(true);
        setTimeout(() => setCartSuccess(false), 2000);
        setAddingToCart(false);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        setTimeout(() => router.push('/cart'), 300);
    };

    const handleContactToBuy = () => {
        window.open('https://www.instagram.com/hecupps_6?igsh=MWh2cXYyem40MjVtcA==', '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-brand-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <div className="text-center max-w-sm">
                    <p className="text-4xl mb-4">📦</p>
                    <h2 className="text-xl font-outfit font-bold text-brand-black mb-2">{error || 'Product Not Found'}</h2>
                    <p className="text-gray-500 text-sm mb-6">The product you're looking for doesn't exist or has been removed.</p>
                    <Link href="/products" className="inline-block bg-brand-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 uppercase tracking-wider">
                    <Link href="/" className="hover:text-brand-black transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-brand-black transition-colors">Hampers</Link>
                    <span>/</span>
                    <span className="text-brand-black font-semibold">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* Image Gallery */}
                    <div className="space-y-3">
                        <div className="relative aspect-square overflow-hidden bg-brand-light border border-brand-border">
                            {selectedImage ? (
                                <Image
                                    src={selectedImage}
                                    alt={product.name}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-300">
                                    <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            {product.featured && (
                                <div className="absolute top-3 left-3 bg-brand-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                    Featured
                                </div>
                            )}
                        </div>

                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.map((image) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(image.url)}
                                        className={`relative aspect-square overflow-hidden border-2 transition-all ${selectedImage === image.url ? 'border-brand-black' : 'border-brand-border hover:border-gray-400'}`}
                                    >
                                        <Image src={image.url} alt={image.altText || product.name} fill className="object-cover" sizes="25vw" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {product.category && (
                            <p className="text-xs font-bold uppercase tracking-widest text-brand-accent">{product.category}</p>
                        )}

                        <h1 className="text-3xl md:text-4xl font-outfit font-bold text-brand-black leading-tight">{product.name}</h1>

                        {/* Pricing */}
                        <div className="border border-brand-border p-5 bg-brand-light space-y-2">
                            {product.priceINR && (
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">INR</span>
                                    <span className="text-3xl font-bold text-brand-black">₹{product.priceINR.toFixed(2)}</span>
                                </div>
                            )}
                            {product.priceCAD && (
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">CAD</span>
                                    <span className="text-xl font-semibold text-gray-600">${product.priceCAD.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        {/* Stock */}
                        <div className="flex items-center gap-2">
                            {product.stock > 0 ? (
                                <>
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span className="text-sm text-green-700 font-medium">
                                        In Stock ({product.stock} available)
                                        {product.stock < 10 && <span className="ml-2 text-xs text-red-600 font-bold">— Only {product.stock} left!</span>}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-3">Description</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        {/* Quantity */}
                        {arePaymentsEnabled && product.stock > 0 && (
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-brand-black">Quantity</span>
                                <div className="flex items-center border border-brand-border">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-brand-black hover:bg-brand-light transition-colors text-lg font-light">−</button>
                                    <span className="w-12 text-center text-sm font-semibold text-brand-black">{quantity}</span>
                                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-brand-black hover:bg-brand-light transition-colors text-lg font-light">+</button>
                                </div>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="space-y-3 pt-2">
                            {arePaymentsEnabled && product.stock > 0 ? (
                                <>
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={addingToCart}
                                        className="w-full bg-brand-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
                                    >
                                        Buy Now
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={addingToCart}
                                        className="w-full border-2 border-brand-black bg-white text-brand-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-brand-black hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        {cartSuccess ? '✓ Added to Cart' : 'Add to Cart'}
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-3">
                                    {product.stock === 0 ? (
                                        <div className="border border-red-200 bg-red-50 p-4 text-center">
                                            <p className="text-red-600 text-sm font-medium">This product is currently out of stock</p>
                                        </div>
                                    ) : (
                                        <div className="border border-brand-border bg-brand-light p-4 text-center">
                                            <p className="text-gray-600 text-sm">Online ordering is being set up. Contact us to place your order.</p>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleContactToBuy}
                                        className="w-full bg-brand-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                                    >
                                        Contact HECuPPS to Buy
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Back Link */}
                        <div className="pt-4 border-t border-brand-border">
                            <Link href="/products" className="inline-flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider hover:text-brand-black transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Hampers
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
