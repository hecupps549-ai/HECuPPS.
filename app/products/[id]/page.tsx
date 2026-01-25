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
    const productId = params.id as string;

    // Use unified cart context
    const { addToCart: addToCartContext } = useAppContext();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
    const [addingToCart, setAddingToCart] = useState(false);

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
                if (productRes.status === 404) {
                    setError('Product not found');
                } else {
                    setError('Failed to load product');
                }
                return;
            }

            const productData = await productRes.json();
            const settingsData = await settingsRes.json();

            setProduct(productData.product);
            setPaymentSettings(settingsData.paymentSettings);

            // Set initial selected image
            if (productData.product.images.length > 0) {
                const primaryImage = productData.product.images.find((img: ProductImage) => img.isPrimary);
                setSelectedImage(primaryImage?.url || productData.product.images[0]?.url);
            }
        } catch (err) {
            console.error('Error fetching product:', err);
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
            customization: {
                messageCard: '',
                wrapping: '',
                ribbon: ''
            }
        };

        // Use unified cart context
        addToCartContext(cartItem);

        // Show success message
        alert(`Added ${quantity} ${product.name} to cart!`);
        setAddingToCart(false);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        setTimeout(() => {
            router.push('/cart');
        }, 500);
    };

    const handleContactToBuy = () => {
        window.open('https://www.instagram.com/hecupps_6?igsh=MWh2cXYyem40MjVtcA==', '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-cream via-white to-brand-gold/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-gold mb-4 mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-cream via-white to-brand-gold/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center max-w-md px-4">
                    <div className="mb-6">
                        <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 dark:text-white mb-2">
                        {error || 'Product Not Found'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The product you're looking for doesn't exist or has been removed.
                    </p>
                    <Link
                        href="/products"
                        className="inline-block bg-brand-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                    >
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 bg-gradient-to-br from-brand-cream via-white to-brand-gold/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-brand-gold transition-colors">Products</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{product.name}</span>
                </nav>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery Section */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
                            {selectedImage ? (
                                <Image
                                    src={selectedImage}
                                    alt={product.name}
                                    fill
                                    className="object-cover hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <svg className="w-32 h-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}

                            {/* Featured Badge */}
                            {product.featured && (
                                <div className="absolute top-4 left-4 bg-brand-gold text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-10">
                                    ⭐ Featured
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {product.images.map((image) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(image.url)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === image.url
                                            ? 'border-brand-gold shadow-lg scale-105'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-brand-gold/50'
                                            }`}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.altText || product.name}
                                            fill
                                            className="object-cover"
                                            sizes="25vw"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-6">
                        {/* Category */}
                        {product.category && (
                            <p className="text-sm uppercase tracking-wider text-brand-gold font-semibold">
                                {product.category}
                            </p>
                        )}

                        {/* Product Name */}
                        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-brand-dark dark:text-brand-cream">
                            {product.name}
                        </h1>

                        {/* Pricing */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            {product.priceINR && (
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">INR:</span>
                                    <span className="text-4xl font-bold text-brand-dark dark:text-brand-cream">
                                        ₹{product.priceINR.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            {product.priceCAD && (
                                <div className="flex items-baseline gap-3">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">CAD:</span>
                                    <span className="text-2xl font-semibold text-brand-dark dark:text-brand-cream">
                                        ${product.priceCAD.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-3">
                            {product.stock > 0 ? (
                                <>
                                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-green-600 dark:text-green-400 font-semibold">
                                        In Stock ({product.stock} available)
                                    </span>
                                    {product.stock < 10 && (
                                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                            Only {product.stock} left!
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    <span className="text-red-600 dark:text-red-400 font-semibold">Out of Stock</span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Quantity Selector (only if payments enabled and in stock) */}
                        {arePaymentsEnabled && product.stock > 0 && (
                            <div className="flex items-center gap-4">
                                <label className="text-gray-700 dark:text-gray-300 font-semibold">Quantity:</label>
                                <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Smart Purchase Buttons */}
                        <div className="space-y-4 pt-4">
                            {arePaymentsEnabled && product.stock > 0 ? (
                                // Scenario A: Payment Gateways Enabled
                                <>
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={addingToCart}
                                        className="w-full bg-brand-gold text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {addingToCart ? 'Adding...' : '🛒 Buy Now'}
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={addingToCart}
                                        className="w-full bg-white dark:bg-gray-800 text-brand-dark dark:text-brand-cream border-2 border-brand-gold px-8 py-4 rounded-lg font-semibold text-lg hover:bg-brand-gold hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {addingToCart ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                </>
                            ) : (
                                // Scenario B: All Payment Gateways Disabled or Out of Stock
                                <div className="space-y-4">
                                    {product.stock === 0 ? (
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                                            <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
                                                This product is currently out of stock
                                            </p>
                                            <p className="text-sm text-red-500 dark:text-red-300">
                                                Contact us to check when it will be available again
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center mb-4">
                                            <p className="text-blue-600 dark:text-blue-400 text-sm">
                                                Payment gateways are currently being set up. Contact us directly to place your order.
                                            </p>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleContactToBuy}
                                        className="w-full bg-brand-gold text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
                                    >
                                        📧 Contact HEcUPPs to Buy
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Back Link */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold/80 transition-colors font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
