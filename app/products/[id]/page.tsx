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

interface Addon {
    emoji: string;
    label: string;
    priceINR: number;
    priceCAD: number;
}

interface Theme {
    label: string;
}

interface ProductExtras {
    themes?: Theme[];
    addons?: Addon[];
    showDatePicker?: boolean;
    peaceOfMind?: string;
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
    whatsIncluded?: string[] | null;
    productExtras?: ProductExtras | null;
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

    // New feature states
    const [selectedTheme, setSelectedTheme] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedAddons, setSelectedAddons] = useState<Set<number>>(new Set());

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

            // Auto-select first theme if available
            if (productData.product.productExtras?.themes?.length > 0) {
                setSelectedTheme(productData.product.productExtras.themes[0].label);
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

    const toggleAddon = (index: number) => {
        setSelectedAddons(prev => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const getAddonTotal = () => {
        if (!product?.productExtras?.addons) return 0;
        let total = 0;
        product.productExtras.addons.forEach((addon, i) => {
            if (selectedAddons.has(i)) {
                total += addon.priceINR || 0;
            }
        });
        return total;
    };

    const getEstimatedTotal = () => {
        const base = product?.priceINR || 0;
        return base + getAddonTotal();
    };

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

    const handleAskQuestion = () => {
        window.open('https://www.instagram.com/hecupps_6?igsh=MWh2cXYyem40MjVtcA==', '_blank');
    };

    const hasExtras = product?.productExtras && (
        (product.productExtras.themes && product.productExtras.themes.length > 0) ||
        (product.productExtras.addons && product.productExtras.addons.length > 0) ||
        product.productExtras.showDatePicker ||
        product.productExtras.peaceOfMind
    );

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
                    {/* ── LEFT: Image Gallery ── */}
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

                    {/* ── RIGHT: Product Info + Interactive Sections ── */}
                    <div className="space-y-6">
                        {/* Category badge */}
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

                        {/* ── What's Included ── */}
                        {product.whatsIncluded && product.whatsIncluded.length > 0 && (
                            <div className="border border-brand-border rounded-xl p-5 bg-brand-light">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-4">What's Included</h3>
                                <ul className="space-y-2">
                                    {product.whatsIncluded.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* ── Theme Selector ── */}
                        {product.productExtras?.themes && product.productExtras.themes.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-3">
                                    1. Choose Your Theme
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.productExtras.themes.map((theme, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedTheme(theme.label)}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                                                selectedTheme === theme.label
                                                    ? 'bg-brand-black text-white border-brand-black'
                                                    : 'bg-white text-brand-black border-brand-border hover:border-brand-black'
                                            }`}
                                        >
                                            {theme.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Date & Time Picker ── */}
                        {product.productExtras?.showDatePicker && (
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-3">
                                    {product.productExtras?.themes && product.productExtras.themes.length > 0 ? '2.' : '1.'} Date &amp; Time
                                </h3>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={e => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-4 py-3 border border-brand-border bg-brand-light text-brand-black text-sm rounded-lg focus:outline-none focus:border-brand-black transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── Aesthetic Add-ons ── */}
                        {product.productExtras?.addons && product.productExtras.addons.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-3">
                                    {(() => {
                                        let n = 1;
                                        if (product.productExtras?.themes?.length) n++;
                                        if (product.productExtras?.showDatePicker) n++;
                                        return `${n}.`;
                                    })()} Aesthetic Add-ons <span className="text-gray-400 font-normal normal-case tracking-normal">(Optional)</span>
                                </h3>
                                <div className="space-y-2">
                                    {product.productExtras.addons.map((addon, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => toggleAddon(i)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left ${
                                                selectedAddons.has(i)
                                                    ? 'border-brand-black bg-brand-light'
                                                    : 'border-brand-border bg-white hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{addon.emoji}</span>
                                                <div>
                                                    <div className="text-sm font-semibold text-brand-black">{addon.label}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {addon.priceINR > 0 && `+₹${addon.priceINR}`}
                                                        {addon.priceINR > 0 && addon.priceCAD > 0 && ' / '}
                                                        {addon.priceCAD > 0 && `+$${addon.priceCAD} CAD`}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                                                selectedAddons.has(i)
                                                    ? 'bg-brand-black border-brand-black text-white'
                                                    : 'border-brand-border text-gray-400'
                                            }`}>
                                                {selectedAddons.has(i) ? (
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity — only shown when payments enabled */}
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

                        {/* CTA Buttons — only shown when no extras (extras use the sticky bar instead) */}
                        {!hasExtras && (
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
                        )}

                        {/* ── Peace of Mind ── */}
                        {product.productExtras?.peaceOfMind && (
                            <div className="border border-green-200 bg-green-50 rounded-xl p-5">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl flex-shrink-0">🛡️</span>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-green-800 mb-1">Peace of Mind Guarantee</h4>
                                        <p className="text-sm text-green-700 leading-relaxed">{product.productExtras.peaceOfMind}</p>
                                    </div>
                                </div>
                            </div>
                        )}

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

            {/* ── Sticky Bottom Bar (shown only when product has extras) ── */}
            {hasExtras && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-brand-border shadow-[0_-4px_24px_rgba(0,0,0,0.10)]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4 gap-4">
                            {/* Estimated Total */}
                            <div className="min-w-[120px]">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Est. Total</p>
                                <p className="text-2xl font-bold text-brand-black">
                                    ₹{getEstimatedTotal().toLocaleString('en-IN')}
                                </p>
                                {selectedAddons.size > 0 && (
                                    <p className="text-[10px] text-gray-400">
                                        Base ₹{product.priceINR?.toLocaleString('en-IN')} + {selectedAddons.size} add-on{selectedAddons.size > 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 flex-1 max-w-sm ml-auto">
                                <button
                                    onClick={handleAskQuestion}
                                    className="flex items-center gap-2 px-4 py-3 border-2 border-brand-border text-brand-black text-xs font-bold uppercase tracking-wider hover:border-brand-black transition-colors rounded-lg whitespace-nowrap"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Ask a Question
                                </button>

                                {arePaymentsEnabled && product.stock > 0 ? (
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={addingToCart}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 rounded-lg"
                                    >
                                        {cartSuccess ? '✓ Added!' : 'Book Now'}
                                        {!cartSuccess && (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleContactToBuy}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-lg"
                                    >
                                        Contact to Book
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom padding when sticky bar is shown */}
            {hasExtras && <div className="h-24" />}
        </div>
    );
}
