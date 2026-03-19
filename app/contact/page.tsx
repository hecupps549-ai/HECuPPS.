"use client";

import React, { useState } from 'react';
import { Input, Textarea, Button } from '@/components/UI';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', message: '' });
                }, 4000);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch {
            alert('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-brand-black text-white py-16 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-4">We're Here to Help</p>
                    <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-3">Get in Touch</h1>
                    <p className="text-gray-400 text-base max-w-xl mx-auto">Send us a message and we'll respond within 24 hours.</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-14 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-5 gap-10 max-w-6xl mx-auto">
                        {/* Form — wider */}
                        <div className="md:col-span-3 border border-brand-border bg-white p-8">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-6">Send us a Message</h2>

                            {submitted && (
                                <div className="mb-6 p-4 border border-green-300 bg-green-50 text-green-800 text-sm font-medium">
                                    ✓ Thank you! We'll get back to you very soon.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Input label="Your Name" id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Your Name" />
                                <Input label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" />
                                <Input label="Phone Number (optional)" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                                <Textarea label="Message" id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Tell us how we can help..." />
                                <Button type="submit" disabled={loading} className="w-full py-4">
                                    {loading ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </div>

                        {/* Info — narrower */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="border border-brand-border p-8 bg-brand-light">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-6">Contact Information</h2>
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Email</p>
                                        <a href="mailto:contact@hecupps.com" className="text-sm text-brand-black hover:underline">contact@hecupps.com</a>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Instagram</p>
                                        <a href="https://instagram.com/hecupps_6" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-black hover:underline">@hecupps_6</a>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Business Hours</p>
                                        <p className="text-sm text-gray-600">Mon – Sat: 9 AM – 6 PM</p>
                                        <p className="text-sm text-gray-600">Sunday: Closed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-brand-black text-white p-8">
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Need Quick Help?</h3>
                                <p className="text-gray-400 text-sm mb-5">Check our FAQ for instant answers to common questions.</p>
                                <a href="/faq" className="inline-block border border-white text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-white hover:text-brand-black transition-colors">
                                    View FAQ
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
