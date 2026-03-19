"use client";

import Link from 'next/link';
import Image from 'next/image';

const HomePage = () => {
    const categories = [
        { name: 'Birthday', img: 'https://picsum.photos/seed/bday2025/600/600', href: '/products?cat=Birthday' },
        { name: 'Festive', img: 'https://picsum.photos/seed/fest2025/600/600', href: '/products?cat=Festive' },
        { name: 'Corporate', img: 'https://picsum.photos/seed/corp2025/600/600', href: '/products?cat=Corporate' },
        { name: 'Wedding', img: 'https://picsum.photos/seed/wed2025/600/600', href: '/products?cat=Wedding' },
    ];

    const featured = [
        {
            name: 'Signature Luxury Hamper',
            tagline: 'The ultimate gift for someone special',
            img: 'https://picsum.photos/seed/lux2025/900/600',
            href: '/products',
        },
        {
            name: 'Festive Collection',
            tagline: 'Celebrate every occasion in style',
            img: 'https://picsum.photos/seed/col2025/900/600',
            href: '/products',
        },
    ];

    const testimonials = [
        { quote: 'The most beautiful gift hamper I have ever received. Every item was thoughtfully curated.', author: 'Priya S.', location: 'Mumbai' },
        { quote: 'Our corporate clients were absolutely delighted. Professional, luxurious, and on-time delivery.', author: 'Rahul M.', location: 'Bangalore' },
        { quote: "Ordered for my parents' anniversary. They were overjoyed. Will definitely order again!", author: 'Ananya K.', location: 'Delhi' },
    ];


    return (
        <>
            {/* Shop Collections */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-outfit font-semibold text-center text-brand-black mb-8 tracking-tight">
                        Shop Collections
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        {categories.map(cat => (
                            <Link href={cat.href} key={cat.name} className="group relative block overflow-hidden bg-brand-light aspect-square">
                                <Image
                                    src={cat.img}
                                    alt={cat.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-brand-black py-3 px-4">
                                    <span className="text-white text-sm font-semibold uppercase tracking-widest">
                                        {cat.name}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* What's New — 2 large featured cards */}
            <section className="py-10 md:py-14">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-outfit font-semibold text-center text-brand-black mb-8 tracking-tight">
                        What's New
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {featured.map((item) => (
                            <div key={item.name} className="group relative overflow-hidden bg-brand-light aspect-[4/3]">
                                <Image
                                    src={item.img}
                                    alt={item.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                    <h3 className="text-white text-xl md:text-2xl font-outfit font-bold mb-1">{item.name}</h3>
                                    <p className="text-white/80 text-sm mb-4">{item.tagline}</p>
                                    <Link
                                        href={item.href}
                                        className="inline-block bg-white text-brand-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-brand-black hover:text-white transition-colors"
                                    >
                                        Shop Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals — Product Grid (fetched) */}
            <section className="py-10 md:py-14 bg-brand-light">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-outfit font-semibold text-brand-black tracking-tight">
                            New Arrivals
                        </h2>
                        <Link href="/products" className="text-sm font-semibold uppercase tracking-widest text-brand-black underline underline-offset-4 hover:opacity-60 transition-opacity">
                            View All
                        </Link>
                    </div>
                    {/* Static placeholder grid – will be replaced by dynamic data */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <Link href="/products" key={i} className="group">
                                <div className="relative overflow-hidden aspect-square bg-white border border-brand-border mb-3">
                                    <Image
                                        src={`https://picsum.photos/seed/hamper${i}/500/500`}
                                        alt={`Gift Hamper ${i}`}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <p className="text-sm font-semibold text-brand-black mb-1">Luxury Gift Hamper #{i}</p>
                                <p className="text-sm text-gray-500">From ₹{(i * 499 + 500).toLocaleString()}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-14 md:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-outfit font-semibold text-center text-brand-black mb-10 tracking-tight">
                        Words of Appreciation
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="border border-brand-border p-8">
                                <p className="text-gray-600 italic text-base leading-relaxed mb-6">"{t.quote}"</p>
                                <div>
                                    <p className="font-semibold text-brand-black text-sm">{t.author}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{t.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-14 bg-brand-black text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-lg">
                    <h2 className="text-2xl md:text-3xl font-outfit font-bold mb-3">Stay in Touch</h2>
                    <p className="text-gray-400 text-sm mb-8">Get exclusive offers, new collection alerts, and gifting inspiration.</p>
                    <form className="flex flex-col sm:flex-row gap-3" onSubmit={e => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-grow px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white text-sm"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-white text-brand-black font-bold text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default HomePage;
