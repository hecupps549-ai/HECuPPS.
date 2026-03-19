"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQItem[] = [
    { category: 'Payment', question: 'What payment methods do you accept?', answer: 'We accept credit/debit cards, UPI, and net banking through secure payment gateways. For customers in Canada, we accept Stripe and Interac e-Transfer.' },
    { category: 'Shipping', question: 'How long does delivery take?', answer: 'Delivery typically takes 3-5 business days within India and 7-10 business days for international orders. Express shipping options are available.' },
    { category: 'Products', question: 'Can I customize my gift hamper?', answer: 'Yes! We offer customization options for many of our hampers. Contact us through our support system to discuss your specific requirements.' },
    { category: 'Returns', question: 'What is your return policy?', answer: "We want you to be completely satisfied. If you're not happy with your order, please contact us within 7 days of delivery to arrange a return or exchange." },
    { category: 'Corporate', question: 'Do you offer corporate gifting?', answer: 'Absolutely! We specialize in corporate gifting with bulk order discounts and customization options. Contact our team for a personalized quote.' },
    { category: 'Shipping', question: 'Do you ship internationally?', answer: 'Yes, we ship to Canada and select international locations. Shipping costs and delivery times vary by destination.' },
    { category: 'Products', question: 'Are your products eco-friendly?', answer: 'We are committed to sustainability and use eco-friendly packaging wherever possible. Many of our hampers feature organic and sustainably sourced products.' },
    { category: 'Payment', question: 'Is my payment information secure?', answer: 'Yes, we use industry-standard encryption and secure payment gateways. We never store your complete card details.' },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category)))];
    const filteredFaqs = selectedCategory === 'All' ? faqs : faqs.filter(f => f.category === selectedCategory);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-brand-black text-white py-16 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-4">Help Centre</p>
                    <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-3">Frequently Asked Questions</h1>
                    <p className="text-gray-400 text-base max-w-xl mx-auto">Find answers to common questions about our products and services</p>
                </div>
            </section>

            <section className="py-14 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${selectedCategory === cat
                                    ? 'bg-brand-black text-white border-brand-black'
                                    : 'bg-white text-gray-500 border-brand-border hover:border-brand-black hover:text-brand-black'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* FAQ Accordion */}
                    <div className="divide-y divide-brand-border border border-brand-border">
                        {filteredFaqs.map((faq, index) => (
                            <div key={index}>
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-6 py-5 text-left flex justify-between items-start gap-4 hover:bg-brand-light transition-colors"
                                >
                                    <div className="flex-1">
                                        <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-accent mb-1.5">{faq.category}</span>
                                        <h3 className="text-sm font-bold text-brand-black">{faq.question}</h3>
                                    </div>
                                    <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 mt-1 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 pb-5 bg-brand-light">
                                        <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 bg-brand-black text-white p-10 text-center">
                        <h2 className="text-xl font-outfit font-bold mb-3 uppercase tracking-wide">Still have questions?</h2>
                        <p className="text-gray-400 text-sm mb-6">Our customer support team is here to help.</p>
                        <Link href="/contact" className="inline-block bg-white text-brand-black text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-brand-accent hover:text-white transition-colors">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
