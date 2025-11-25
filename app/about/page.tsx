import React from 'react';

export default function AboutPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-playfair font-bold text-brand-dark dark:text-brand-cream mb-6">
                        About HECuPPS
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Curated Luxury, Wrapped with Love
                    </p>
                </div>

                {/* Story Section */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
                        <h2 className="text-3xl font-playfair font-bold text-brand-gold mb-6">Our Story</h2>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                            <p>
                                HECuPPS was born from a simple belief: every gift should be an experience,
                                a moment of joy carefully crafted and beautifully presented.
                            </p>
                            <p>
                                We specialize in creating premium gift hampers that speak the language of luxury
                                and thoughtfulness. Each hamper is meticulously curated with the finest products,
                                ensuring that your gesture of love or appreciation is remembered long after the
                                moment has passed.
                            </p>
                            <p>
                                From birthdays to corporate events, from festivals to weddings, we believe that
                                every occasion deserves a touch of elegance and warmth.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                        <div className="text-4xl mb-4">✨</div>
                        <h3 className="text-xl font-playfair font-semibold text-brand-gold mb-3">Quality</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Only the finest, handpicked products make it into our hampers
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                        <div className="text-4xl mb-4">🎁</div>
                        <h3 className="text-xl font-playfair font-semibold text-brand-gold mb-3">Customization</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Personalized touches to make every gift uniquely yours
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                        <div className="text-4xl mb-4">💝</div>
                        <h3 className="text-xl font-playfair font-semibold text-brand-gold mb-3">Care</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Every hamper is wrapped with love and attention to detail
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-brand-dark text-white rounded-2xl p-12">
                    <h2 className="text-3xl font-playfair font-bold mb-4">Ready to Create Magic?</h2>
                    <p className="text-lg text-gray-300 mb-8">
                        Explore our collection and find the perfect gift hamper
                    </p>
                    <a
                        href="/products"
                        className="inline-block bg-brand-gold text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all"
                    >
                        Browse Hampers
                    </a>
                </div>
            </div>
        </div>
    );
}
