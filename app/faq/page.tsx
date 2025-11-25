"use client";

import React, { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQItem[] = [
    {
        category: 'Payment',
        question: 'What payment methods do you accept?',
        answer: 'We accept various payment methods including credit/debit cards, UPI, and net banking through secure payment gateways. For customers in Canada, we accept Stripe payments.',
    },
    {
        category: 'Shipping',
        question: 'How long does delivery take?',
        answer: 'Delivery typically takes 3-5 business days within India and 7-10 business days for international orders. Express shipping options are available for urgent deliveries.',
    },
    {
        category: 'Products',
        question: 'Can I customize my gift hamper?',
        answer: 'Yes! We offer customization options for many of our hampers. Contact us through our support system to discuss your specific requirements.',
    },
    {
        category: 'Returns',
        question: 'What is your return policy?',
        answer: 'We want you to be completely satisfied with your purchase. If you\'re not happy with your order, please contact us within 7 days of delivery to arrange a return or exchange.',
    },
    {
        category: 'Corporate',
        question: 'Do you offer corporate gifting?',
        answer: 'Absolutely! We specialize in corporate gifting solutions with bulk order discounts and customization options. Please contact our team for a personalized quote.',
    },
    {
        category: 'Shipping',
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to Canada and select international locations. Shipping costs and delivery times vary by destination.',
    },
    {
        category: 'Products',
        question: 'Are your products eco-friendly?',
        answer: 'We are committed to sustainability and use eco-friendly packaging wherever possible. Many of our hampers feature organic and sustainably sourced products.',
    },
    {
        category: 'Payment',
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption and secure payment gateways to protect your financial information. We never store your complete card details.',
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];
    const filteredFaqs = selectedCategory === 'All'
        ? faqs
        : faqs.filter(faq => faq.category === selectedCategory);

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-brand-dark dark:text-brand-cream mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Find answers to common questions about our products and services
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${selectedCategory === category
                                    ? 'bg-brand-gold text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* FAQ List */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {filteredFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex-1">
                                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-brand-gold/10 text-brand-gold rounded-full mb-2">
                                        {faq.category}
                                    </span>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {faq.question}
                                    </h3>
                                </div>
                                <svg
                                    className={`w-6 h-6 text-brand-gold transform transition-transform ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-5 text-gray-600 dark:text-gray-400">
                                    <p className="leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-16 text-center bg-brand-dark text-white rounded-2xl p-12">
                    <h2 className="text-2xl font-playfair font-bold mb-4">Still have questions?</h2>
                    <p className="text-gray-300 mb-6">
                        Can't find the answer you're looking for? Our customer support team is here to help.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-brand-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
