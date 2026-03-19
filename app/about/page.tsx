import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
    const values = [
        { icon: '✨', title: 'Quality', desc: 'Only the finest, handpicked products make it into our hampers' },
        { icon: '🎁', title: 'Customization', desc: 'Personalized touches to make every gift uniquely yours' },
        { icon: '💝', title: 'Care', desc: 'Every hamper is wrapped with love and attention to detail' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-brand-black text-white py-20 md:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-4">Our Story</p>
                    <h1 className="text-4xl md:text-6xl font-outfit font-bold leading-tight mb-6">About HECuPPS</h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">Curated Luxury, Wrapped with Love</p>
                </div>
            </section>

            {/* Story */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-outfit font-bold text-brand-black mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>HECuPPS was born from a simple belief: every gift should be an experience, a moment of joy carefully crafted and beautifully presented.</p>
                                <p>We specialize in creating premium gift hampers that speak the language of luxury and thoughtfulness. Each hamper is meticulously curated with the finest products, ensuring that your gesture of love or appreciation is remembered long after the moment has passed.</p>
                                <p>From birthdays to corporate events, from festivals to weddings, we believe that every occasion deserves a touch of elegance and warmth.</p>
                            </div>
                        </div>
                        <div className="aspect-square bg-brand-light border border-brand-border flex items-center justify-center text-8xl">
                            🎁
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-14 bg-brand-light">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-outfit font-bold text-center text-brand-black mb-10 uppercase tracking-tight">What Sets Us Apart</h2>
                    <div className="grid md:grid-cols-3 gap-0 border border-brand-border divide-y md:divide-y-0 md:divide-x divide-brand-border">
                        {values.map((v) => (
                            <div key={v.title} className="p-10 bg-white text-center">
                                <div className="text-4xl mb-4">{v.icon}</div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-3">{v.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-outfit font-bold text-brand-black mb-4">Ready to Create Magic?</h2>
                    <p className="text-gray-500 mb-8">Explore our collection and find the perfect gift hamper</p>
                    <Link href="/products" className="inline-block bg-brand-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                        Browse Hampers
                    </Link>
                </div>
            </section>
        </div>
    );
}
