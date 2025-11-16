import React, { useState, FormEvent } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserLayout } from '../components/Layout';
import { useAppContext } from '../context/AppContext';
import { Button, Card, Input, Textarea, Select, Table, Td, StatusBadge } from '../components/UI';
import { ArrowRightIcon, CheckCircleIcon, ChevronDownIcon, DownloadIcon, TrashIcon, XCircleIcon } from '../components/Icons';
import { TESTIMONIALS, FAQ_ITEMS } from '../constants';
import { CartItem } from '../types';

// Page Components
const HomePage = () => {
    const categories = [
        { name: 'Birthday', img: 'https://picsum.photos/seed/birthday/600/800' },
        { name: 'Festive', img: 'https://picsum.photos/seed/festive/600/800' },
        { name: 'Corporate', img: 'https://picsum.photos/seed/corporate/600/800' },
        { name: 'Wedding', img: 'https://picsum.photos/seed/wedding/600/800' },
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/luxury/1920/1080')" }}>
                <div className="absolute inset-0 bg-brand-dark bg-opacity-50" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                    <h1 className="text-5xl md:text-7xl font-playfair font-bold leading-tight">Curated Luxury, Wrapped with Love</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl font-poppins">Discover our exquisite collection of handcrafted gift hampers, designed to make every occasion memorable.</p>
                    <Link to="/products">
                      <Button className="mt-8 text-xl">Explore Hampers</Button>
                    </Link>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-playfair font-bold text-center mb-12 text-brand-dark dark:text-brand-cream">Our Collections</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map(cat => (
                            <Link to="/products" key={cat.name}>
                                <div className="group relative overflow-hidden rounded-lg shadow-lg aspect-[3/4]">
                                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                                        <h3 className="text-2xl font-playfair font-semibold text-white">{cat.name}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Testimonials */}
            <section className="bg-brand-dark text-brand-cream py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-playfair font-bold text-center mb-12 text-white">Words of Appreciation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <div key={index} className="bg-gray-800 p-8 rounded-lg">
                                <p className="text-lg italic">"{testimonial.quote}"</p>
                                <p className="mt-4 font-semibold text-brand-gold">{testimonial.author}</p>
                                <p className="text-sm text-gray-400">{testimonial.location}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Newsletter Section */}
             <section className="py-20 bg-brand-cream dark:bg-brand-dark">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
                    <h2 className="text-4xl font-playfair font-bold text-brand-dark dark:text-brand-cream">Stay in Touch</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Join our newsletter to receive exclusive offers, new collection announcements, and gifting inspiration straight to your inbox.</p>
                    <form className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Input type="email" placeholder="Enter your email address" className="flex-grow dark:bg-gray-800 dark:text-white dark:placeholder-gray-400" />
                        <Button type="submit" variant="secondary">Subscribe</Button>
                    </form>
                </div>
            </section>
        </>
    );
};

const AboutPage = () => {
    return (
        <div className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl font-playfair font-bold text-center mb-12 text-brand-dark dark:text-brand-cream">Our Story</h1>
                
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <img src="https://picsum.photos/seed/ourstory/800/600" alt="Our Story" className="rounded-lg shadow-xl"/>
                    <div>
                        <h2 className="text-3xl font-playfair text-brand-gold mb-4">From a Passion Project to a Premium Brand</h2>
                        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                            HECuPPS began with a simple idea: to elevate the art of gifting. What started as a passion for creating beautiful, personalized gifts for friends and family has blossomed into a brand synonymous with luxury, elegance, and heartfelt curation. We believe a gift is more than just an item; it's a message, a memory, and a moment of connection.
                        </p>
                    </div>
                </div>

                <div className="bg-brand-dark text-brand-cream rounded-lg p-12 my-16">
                    <h2 className="text-4xl font-playfair font-bold text-center text-brand-gold mb-8">Our Promise</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <h3 className="text-2xl font-semibold mb-2">Exquisite Quality</h3>
                            <p>We source only the finest products from artisans and premium brands to ensure every item in your hamper is exceptional.</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-2">Meticulous Curation</h3>
                            <p>Each hamper is thoughtfully assembled by our team of experts, creating a harmonious and delightful experience for the recipient.</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-2">Unforgettable Unboxing</h3>
                            <p>From our signature packaging to the final ribbon, we design every detail to create a moment of pure joy and surprise.</p>
                        </div>
                    </div>
                </div>

                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-playfair font-bold text-brand-dark dark:text-brand-cream mb-4">Why Choose HECuPPS?</h2>
                    <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                        Choosing HECuPPS means choosing a seamless and sophisticated gifting experience. We handle the details so you can enjoy the gratitude. Whether for a personal celebration or a corporate gesture, our hampers are crafted to leave a lasting impression of thoughtfulness and luxury.
                    </p>
                </div>
            </div>
        </div>
    );
};

const ProductsPage = () => {
    const { products, formatCurrency } = useAppContext();

    return (
        <div className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl font-playfair font-bold text-center mb-4 text-brand-dark dark:text-brand-cream">Our Hampers</h1>
                <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12">Hand-curated collections for every cherished moment.</p>

                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    {/* Filters */}
                    <aside className="md:w-1/4">
                        <h3 className="text-2xl font-semibold mb-4">Filters</h3>
                        <div className="space-y-4">
                            <Input placeholder="Search hampers..." />
                            <Select label="Category">
                                <option>All</option>
                                <option>Birthday</option>
                                <option>Festive</option>
                                <option>Corporate</option>
                            </Select>
                            <Input label="Price Range" type="range" />
                             <Button className="w-full mt-4 text-base py-2">Apply Filters</Button>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        {products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg p-12">
                                <h2 className="text-3xl font-playfair font-semibold text-brand-dark dark:text-brand-cream">Our Collection is Being Prepared</h2>
                                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-md">Our master curators are busy crafting new and exciting hampers. Please check back soon to discover our exclusive collection. Products added by the admin will appear here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map(product => (
                                    <Card key={product.id}>
                                        <Link to={`/products/${product.id}`}>
                                            <img src={product.images[0] || 'https://picsum.photos/400/300'} alt={product.name} className="w-full h-64 object-cover" />
                                            <div className="p-6">
                                                <h3 className="text-xl font-playfair font-bold text-brand-dark dark:text-brand-cream">{product.name}</h3>
                                                <p className="mt-2 text-gray-600 dark:text-gray-400">{product.category}</p>
                                                <p className="mt-4 text-2xl font-semibold text-brand-gold">{formatCurrency(product.price)}</p>
                                            </div>
                                        </Link>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, addToCart, formatCurrency, arePaymentsEnabled } = useAppContext();
    const product = products.find(p => p.id === id);

    const [quantity, setQuantity] = useState(1);
    const [customization, setCustomization] = useState({
        messageCard: '',
        wrapping: 'Signature Brown',
        ribbon: 'Gold',
    });
    const [mainImage, setMainImage] = useState('');
    const [showToast, setShowToast] = useState(false);

    React.useEffect(() => {
        if (product && product.images.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [product]);
    
    const handleCustomizationChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomization(prev => ({ ...prev, [name]: value }));
    };

    const handleAddToCart = () => {
        if (!product || !arePaymentsEnabled) return;
        
        const cartItem: CartItem = {
            ...product,
            quantity,
            customization,
        };
        addToCart(cartItem);

        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            navigate('/cart');
        }, 2000);
    };

    const handleBuyNow = () => {
        if (!product || !arePaymentsEnabled) return;
        
        const cartItem: CartItem = {
            ...product,
            quantity,
            customization,
        };
        addToCart(cartItem);
        navigate('/checkout');
    };
    
    if (!product) {
        return (
            <div className="py-16">
                <div className="container mx-auto text-center px-4">
                    <h1 className="text-3xl font-playfair font-bold">Product Not Found</h1>
                    <p className="mt-4">We couldn't find the product you're looking for.</p>
                    <Link to="/products"><Button className="mt-8">Back to Hampers</Button></Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-16">
             {showToast && (
                <div className="fixed top-24 right-4 z-50 bg-brand-dark text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
                    ✅ Item added to your cart!
                </div>
            )}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
                    {/* Image Carousel */}
                    <div>
                        <div className="aspect-square w-full overflow-hidden rounded-lg shadow-lg mb-4">
                            <img src={mainImage || 'https://picsum.photos/600'} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {product.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    onClick={() => setMainImage(img)}
                                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-colors ${mainImage === img ? 'border-brand-gold' : 'border-transparent hover:border-brand-gold/50'}`}
                                />
                            ))}
                        </div>
                        {product.videoUrl && (
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4">Product Video</h3>
                                <video src={product.videoUrl} controls className="w-full rounded-lg shadow-lg"></video>
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div>
                        <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">{product.category}</p>
                        <h1 className="text-4xl lg:text-5xl font-playfair font-bold my-2 text-brand-dark dark:text-brand-cream">{product.name}</h1>
                        <p className="text-3xl font-semibold text-brand-gold mb-4">{formatCurrency(product.price)}</p>
                         {!arePaymentsEnabled && <p className="text-brand-coral mb-4">❤️ Online payments are currently unavailable. Please order via our Instagram page.</p>}
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{product.description}</p>
                        
                        {/* Customization */}
                        <div className="space-y-4 mb-6">
                            <h3 className="text-xl font-semibold border-b pb-2 dark:border-gray-600">Personalize Your Hamper</h3>
                            <Textarea label="Personalized Message" name="messageCard" placeholder="E.g., Happy Birthday, Sarah!" rows={3} value={customization.messageCard} onChange={handleCustomizationChange} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Select label="Wrapping Paper" name="wrapping" value={customization.wrapping} onChange={handleCustomizationChange}>
                                    <option>Signature Brown</option>
                                    <option>Festive Red</option>
                                    <option>Elegant White</option>
                                </Select>
                                <Select label="Ribbon Color" name="ribbon" value={customization.ribbon} onChange={handleCustomizationChange}>
                                    <option>Gold</option>
                                    <option>Silver</option>
                                    <option>Coral Red</option>
                                    <option>Royal Blue</option>
                                </Select>
                            </div>
                        </div>

                        {/* Quantity & Actions */}
                         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                             <div className="flex items-center border rounded-lg dark:border-gray-600 p-1">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-xl font-bold rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">-</button>
                                <span className="px-5 text-lg font-semibold w-16 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-4 py-2 text-xl font-bold rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">+</button>
                            </div>
                            {arePaymentsEnabled ? (
                                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Button onClick={handleAddToCart} className="w-full text-base py-2.5">Add to Cart</Button>
                                    <Button onClick={handleBuyNow} variant="secondary" className="w-full text-base py-2.5">Buy Now</Button>
                                </div>
                            ) : (
                                <div className="flex-grow">
                                    <a href="https://www.instagram.com/hecupps_6" target="_blank" rel="noopener noreferrer"
                                    className="block w-full text-center px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-brand-gold text-white hover:bg-opacity-90 focus:ring-brand-gold text-base py-2.5"
                                    >
                                        Order via Instagram
                                    </a>
                                </div>
                            )}
                        </div>
                         {quantity >= product.stock && <p className="text-red-500 text-sm mt-2">Maximum stock reached.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CartPage = () => {
    const { cart, formatCurrency, updateCartQuantity, removeFromCart, settings, arePaymentsEnabled } = useAppContext();
    const [toastMessage, setToastMessage] = useState('');
    
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * (settings.taxRate / 100);
    const total = subtotal + tax;

    const handleRemoveItem = (productId: string, productName: string) => {
        removeFromCart(productId);
        setToastMessage(`🗑️ "${productName}" removed from your cart.`);
        setTimeout(() => setToastMessage(''), 3000);
    };
    
    if (!arePaymentsEnabled) {
        return (
            <div className="py-16 bg-gray-50 dark:bg-gray-900 min-h-[80vh] flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Card className="max-w-lg mx-auto p-10">
                        <h2 className="text-4xl font-playfair font-bold text-brand-dark dark:text-brand-cream mb-4">🛒 Cart Unavailable</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Online checkout is currently disabled. Please place your orders via our Instagram page ❤️
                        </p>
                        <a href="https://www.instagram.com/hecupps_6" target="_blank" rel="noopener noreferrer" className="inline-block">
                            <Button>
                                Order via Instagram
                            </Button>
                        </a>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="py-16 bg-gray-50 dark:bg-gray-900 min-h-[80vh]">
            {toastMessage && (
                <div className="fixed top-24 right-4 z-50 bg-brand-dark text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
                    {toastMessage}
                </div>
            )}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl font-playfair font-bold text-center mb-12 text-brand-dark dark:text-brand-cream">Your Shopping Cart</h1>
                {cart.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-2xl mb-4 text-gray-600 dark:text-gray-400">Your cart is feeling a little empty.</p>
                        <Link to="/products"><Button>Discover Our Hampers</Button></Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                        {/* Cart Items */}
                        <div className="flex-grow lg:w-2/3">
                            <div className="space-y-4">
                            {cart.map(item => (
                                <Card key={item.id} className="p-4 flex flex-col sm:flex-row items-center gap-4 transition-shadow duration-300 hover:shadow-xl">
                                    <img src={item.images[0] || 'https://picsum.photos/128'} alt={item.name} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md flex-shrink-0"/>
                                    <div className="flex-grow text-center sm:text-left">
                                        <h3 className="text-xl font-semibold font-playfair">{item.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                                        <p className="text-lg font-bold text-brand-gold mt-1">{formatCurrency(item.price)}</p>
                                    </div>
                                    <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-800">
                                                <button 
                                                    onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))} 
                                                    className="p-2 text-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition w-10 h-10 flex items-center justify-center rounded-l-md"
                                                    aria-label={`Decrease quantity of ${item.name}`}
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 text-lg font-semibold w-12 text-center" aria-live="polite">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateCartQuantity(item.id, Math.min(item.stock, item.quantity + 1))} 
                                                    className="p-2 text-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition w-10 h-10 flex items-center justify-center rounded-r-md"
                                                    aria-label={`Increase quantity of ${item.name}`}
                                                    disabled={item.quantity >= item.stock}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            {item.quantity >= item.stock && <p className="text-red-500 text-xs mt-1">Max stock reached</p>}
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveItem(item.id, item.name)} 
                                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                                            aria-label={`Remove ${item.name} from cart`}
                                        >
                                            <TrashIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                </Card>
                            ))}
                            </div>
                        </div>
                        {/* Summary */}
                        <div className="lg:w-1/3 w-full">
                            <div className="lg:sticky lg:top-24">
                                <Card className="p-6">
                                    <h2 className="text-2xl font-playfair font-bold mb-4 border-b pb-2 dark:border-gray-600">Order Summary</h2>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax ({settings.taxRate}%)</span>
                                            <span>{formatCurrency(tax)}</span>
                                        </div>
                                        <div className="border-t pt-4 mt-2 dark:border-gray-600 flex justify-between font-bold text-xl">
                                            <span>Total</span>
                                            <span>{formatCurrency(total)}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <div className="flex gap-2">
                                            <Input placeholder="Coupon Code" />
                                            <Button variant="secondary" className="text-base py-2 px-4 whitespace-nowrap">Apply</Button>
                                        </div>
                                    </div>
                                     {arePaymentsEnabled ? (
                                        <Link to="/checkout">
                                            <Button className="w-full mt-6">Proceed to Checkout</Button>
                                        </Link>
                                     ) : (
                                        <Button className="w-full mt-6" disabled>Checkout Unavailable</Button>
                                     )}
                                </Card>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CheckoutPage = () => {
    const { cart, user, settings, formatCurrency, placeOrder, arePaymentsEnabled } = useAppContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: user?.address || '',
    });

    React.useEffect(() => {
        if (!arePaymentsEnabled) {
            navigate('/');
        }
    }, [arePaymentsEnabled, navigate]);


    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * (settings.taxRate / 100);
    const total = subtotal + tax;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await placeOrder(shippingDetails, cart, total);

        setIsLoading(false);
        if (result.success && result.order) {
            navigate(`/order-success/${result.order.id}`);
        } else {
            navigate('/order-failed');
        }
    };
    
    if (cart.length === 0 && !isLoading) {
        return <Navigate to="/products" />;
    }

    return (
        <div className="py-16 bg-gray-50 dark:bg-gray-900">
            {isLoading && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-t-brand-gold border-gray-200 rounded-full animate-spin"></div>
                    <p className="text-white mt-4 text-lg">Processing your payment...</p>
                </div>
            )}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl font-playfair font-bold text-center mb-12 text-brand-dark dark:text-brand-cream">Checkout</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Shipping Details */}
                        <div className="lg:col-span-3">
                            <Card className="p-8">
                                <h2 className="text-2xl font-playfair font-bold mb-6">Shipping Information</h2>
                                <div className="space-y-4">
                                    <Input label="Full Name" name="name" value={shippingDetails.name} onChange={handleChange} required />
                                    <Input label="Email" name="email" type="email" value={shippingDetails.email} onChange={handleChange} required />
                                    <Input label="Phone Number" name="phone" type="tel" value={shippingDetails.phone} onChange={handleChange} required />
                                    <Textarea label="Full Address" name="address" rows={4} value={shippingDetails.address} onChange={handleChange} required />
                                </div>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-2">
                            <Card className="p-8 sticky top-24">
                                <h2 className="text-2xl font-playfair font-bold mb-6">Your Order</h2>
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-4 border-b pb-4 dark:border-gray-600">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <span className="font-semibold">{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                                            <span>{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                                    <div className="flex justify-between"><span>Tax ({settings.taxRate}%)</span><span>{formatCurrency(tax)}</span></div>
                                    <div className="border-t pt-2 mt-2 dark:border-gray-600"></div>
                                    <div className="flex justify-between font-bold text-xl"><span>Total</span><span>{formatCurrency(total)}</span></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">You will be redirected to our secure payment partner to complete your purchase.</p>
                                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                                    {isLoading ? 'Processing...' : `Pay ${formatCurrency(total)}`}
                                </Button>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const OrderSuccessPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { orders, formatCurrency } = useAppContext();
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return (
            <div className="py-16 text-center">
                <h1 className="text-2xl font-semibold">Order not found.</h1>
                <Link to="/profile/orders"><Button className="mt-4">View My Orders</Button></Link>
            </div>
        );
    }
    
    return (
        <div className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                <Card className="p-8 text-center">
                    <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-playfair font-bold text-brand-dark dark:text-brand-cream">Payment Successful!</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Thank you for your purchase. Your order has been placed.</p>
                    
                    <div className="text-left bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mt-8 space-y-3">
                        <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
                        <p><strong>Order ID:</strong> {order.id}</p>
                        <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                        <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
                        <p><strong>Total Amount:</strong> <span className="font-bold text-brand-gold">{formatCurrency(order.totalAmount)}</span></p>
                        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    </div>

                    <p className="mt-6 text-sm text-gray-500">An email confirmation has been sent to {order.shippingAddress.email} with your order details.</p>

                    <div className="mt-8 flex justify-center gap-4">
                        <Link to="/products"><Button variant="secondary">Continue Shopping</Button></Link>
                        <Link to="/profile/orders"><Button>View My Orders</Button></Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const OrderFailedPage = () => {
    return (
         <div className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                <Card className="p-8 text-center">
                    <XCircleIcon className="h-20 w-20 text-red-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-playfair font-bold text-brand-dark dark:text-brand-cream">Payment Failed</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Unfortunately, we were unable to process your payment.</p>
                    <p className="mt-2 text-gray-500">Please check your payment details and try again. If the problem persists, please contact our support team.</p>
                    
                    <div className="mt-8 flex justify-center gap-4">
                        <Link to="/checkout"><Button>Try Again</Button></Link>
                        <Link to="/contact"><Button variant="secondary">Contact Support</Button></Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const ContactPage = () => {
    const { addSupportTicket, user } = useAppContext();
    const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await addSupportTicket({
                userName: formData.name,
                userEmail: formData.email,
                subject: formData.subject,
                message: formData.message,
            });
            setIsSubmitted(true);
            alert(`Confirmation email sent to ${formData.email}. \nSubject: Your message has been received – HECuPPS Support`);
            setFormData({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
            setTimeout(() => setIsSubmitted(false), 5000);
        } catch (error) {
            console.error(error);
            alert("There was an error sending your message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-5xl font-playfair font-bold text-brand-dark dark:text-brand-cream">We’re Here to Help</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Have questions about your order or a product? Send us a message below and we’ll get back to you soon.</p>
                </div>
                
                <div className="max-w-5xl mx-auto mt-12 grid lg:grid-cols-3 gap-16 items-start">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-1">
                        <h3 className="text-2xl font-playfair font-semibold mb-4">Contact Information</h3>
                        <div className="space-y-2 text-gray-700 dark:text-gray-400">
                            <p><strong>Email:</strong><br/> hecupps549@gmail.com</p>
                            <p><strong>Phone:</strong><br/> +91 123 456 7890</p>
                            <p><strong>Address:</strong><br/> 123 Luxury Lane, New Delhi, India</p>
                        </div>
                        <h3 className="text-2xl font-playfair font-semibold mt-8 mb-4">Business Hours</h3>
                        <div className="space-y-1 text-gray-700 dark:text-gray-400">
                            <p>Mon - Fri: 9am - 6pm IST</p>
                            <p>Saturday: 10am - 4pm IST</p>
                            <p>Sunday: Closed</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2">
                        <Card className="p-8">
                             {isSubmitted ? (
                                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md text-left" role="alert">
                                    <p className="font-bold">✅ Thank you! Your message has been sent.</p>
                                    <p>Our support team will contact you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Input label="Full Name" id="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                                    <Input label="Email Address" id="email" type="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleChange} required />
                                    <Input label="Subject" id="subject" type="text" placeholder="Question about my order" value={formData.subject} onChange={handleChange} required />
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                        <textarea id="message" rows={5} value={formData.message} onChange={handleChange} required className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"></textarea>
                                    </div>
                                    <Button type="submit" className="w-full bg-brand-coral hover:bg-opacity-90 focus:ring-brand-coral" disabled={isLoading}>
                                        {isLoading ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </form>
                            )}
                        </Card>
                        <div className="mt-6 text-center">
                            <Link to="/faq" className="text-brand-gold font-semibold hover:underline">
                                Have a question? Check our FAQ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FaqPage = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <h1 className="text-5xl font-playfair font-bold text-center mb-12 text-brand-dark dark:text-brand-cream">Frequently Asked Questions</h1>
                <div className="space-y-4">
                    {FAQ_ITEMS.map((item, index) => (
                        <div key={index} className="border-b dark:border-gray-700">
                            <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center text-left py-4">
                                <span className="text-lg font-semibold">{item.question}</span>
                                <ChevronDownIcon className={`h-6 w-6 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                            </button>
                            {openFaq === index && (
                                <div className="pb-4 text-gray-600 dark:text-gray-300">
                                    <p>{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const UserPrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAppContext();
    const location = useLocation();
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
};

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginUser } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/profile";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const result = await loginUser(email, password);
        if (result === 'success') {
            navigate(from, { replace: true });
        } else if (result === 'blocked') {
            setError('Your account has been temporarily blocked. Please contact support.');
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="flex items-center justify-center py-16">
            <Card className="w-full max-w-md p-8">
                <h1 className="text-3xl font-playfair font-bold text-center mb-6">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <Input label="Email" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <Input label="Password" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <div className="text-right">
                        <a href="#" className="text-sm text-brand-gold hover:underline">Forgot Password?</a>
                    </div>
                    <Button type="submit" className="w-full">Login</Button>
                </form>
                <div className="mt-6 text-center">
                    <p className="dark:text-gray-300">Don't have an account? <Link to="/signup" className="text-brand-gold font-semibold hover:underline">Sign up</Link></p>
                </div>
                 <div className="mt-4 text-center text-sm border-t pt-4 dark:border-gray-600">
                    <Link to="/master-key-login" className="text-gray-500 hover:text-brand-gold hover:underline">Admin Access (Master Key Required)</Link>
                </div>
            </Card>
        </div>
    );
};

const MasterKeyLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { apiRequest } = useAppContext(); // Note: Not in context, but assuming a similar helper exists or we can add it. For now, using the one from context/AppContext.tsx. This won't work directly.
    // Let's assume this component is wrapped in AppProvider.
    // The AppContext isn't exported. I need to get the apiRequest function from there.
    // I will just use the global one I defined in AppContext.tsx
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await apiRequest('/auth/admin-master', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            sessionStorage.setItem('masterKeyPassed', 'true');
            navigate('/admin/login');
        } catch (err) {
            setError((err as Error).message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-16">
            <Card className="w-full max-w-md p-8">
                <h1 className="text-3xl font-playfair font-bold text-center mb-6">Master Key Access</h1>
                <p className="text-center text-gray-500 dark:text-gray-400 -mt-4 mb-6">Enter the master key to proceed to the admin login.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <Input label="Username" id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                    <Input label="Password" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Unlock'}
                    </Button>
                </form>
                <div className="mt-6 text-center text-sm">
                    <Link to="/login" className="text-gray-500 hover:text-brand-gold hover:underline">Return to User Login</Link>
                </div>
            </Card>
        </div>
    );
};

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { signupUser } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        const success = await signupUser(name, email, password);
        if (success) {
            navigate('/profile');
        } else {
            setError('An account with this email already exists.');
        }
    };
    
    return (
         <div className="flex items-center justify-center py-16">
            <Card className="w-full max-w-md p-8">
                <h1 className="text-3xl font-playfair font-bold text-center mb-6">Create Account</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <Input label="Full Name" id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
                    <Input label="Email" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <Input label="Password" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <Input label="Confirm Password" id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                    <Button type="submit" className="w-full">Sign Up</Button>
                </form>
                <div className="mt-6 text-center">
                    <p className="dark:text-gray-300">Already have an account? <Link to="/login" className="text-brand-gold font-semibold hover:underline">Login</Link></p>
                </div>
            </Card>
        </div>
    );
};

const ProfilePage = () => {
    const { user, orders, formatCurrency } = useAppContext();

    if (!user) return null;
    const userOrders = orders.filter(o => o.userId === user.id);

    return (
        <div className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-playfair font-bold mb-8 text-brand-dark dark:text-brand-cream">Welcome, {user.name}</h1>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
                            <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Address:</strong> {user.address || 'Not set'}</p>
                            </div>
                            <div className="mt-6 space-x-2">
                                <Button variant="secondary" className="text-sm py-2 px-4">Edit Profile</Button>
                                <Button variant="secondary" className="text-sm py-2 px-4">Change Password</Button>
                            </div>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                         <Card className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">Order History</h2>
                            {userOrders.length === 0 ? (
                                <p className="text-gray-600 dark:text-gray-400">You have not placed any orders yet.</p>
                            ) : (
                                <Table headers={['Order ID', 'Date', 'Total', 'Status', 'Actions']}>
                                    {userOrders.map(order => (
                                        <tr key={order.id}>
                                            <Td>{order.id.substring(0,8)}...</Td>
                                            <Td>{new Date(order.date).toLocaleDateString()}</Td>
                                            <Td>{formatCurrency(order.totalAmount)}</Td>
                                            <Td><StatusBadge status={order.status} /></Td>
                                            <Td>
                                                {/* FIX: Use import.meta.env for Vite and cast to any to avoid TS error */}
                                                <a href={`${(import.meta as any).env.VITE_API_URL}/api/orders/${order.id}/invoice`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                                                    <DownloadIcon className="w-5 h-5" /> Invoice
                                                </a>
                                            </Td>
                                        </tr>
                                    ))}
                                </Table>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileRoutes = () => (
    <Routes>
        <Route path="/" element={<ProfilePage />} />
        <Route path="/orders" element={<ProfilePage />} />
    </Routes>
);


export const UserPages = () => (
    <UserLayout>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<UserPrivateRoute><CheckoutPage /></UserPrivateRoute>} />
            <Route path="/order-success/:orderId" element={<UserPrivateRoute><OrderSuccessPage /></UserPrivateRoute>} />
            <Route path="/order-failed" element={<UserPrivateRoute><OrderFailedPage /></UserPrivateRoute>} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/master-key-login" element={<MasterKeyLoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile/*" element={
                <UserPrivateRoute>
                    <ProfileRoutes />
                </UserPrivateRoute>
            } />
        </Routes>
    </UserLayout>
);