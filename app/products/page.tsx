import React from 'react';
import Link from 'next/link';

export default function ProductsPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-brand-dark dark:text-brand-cream mb-4">
                        Our Premium Hampers
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Discover our curated collection of luxury gift hampers
                    </p>
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="text-center max-w-md">
                        <div className="mb-6">
                            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-playfair font-semibold text-gray-900 dark:text-white mb-2">
                            Coming Soon
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Our exquisite collection of gift hampers is being prepared. Check back soon for premium offerings!
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-brand-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
