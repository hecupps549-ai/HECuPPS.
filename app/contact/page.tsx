"use client";

import React, { useState } from 'react';
import { Input, Textarea, Button } from '@/components/UI';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
                }, 3000);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-brand-dark dark:text-brand-cream mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-playfair font-bold text-brand-gold mb-6">Send us a Message</h2>

                        {submitted && (
                            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                                Thank you! We'll get back to you soon.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Your Name"
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                            />

                            <Input
                                label="Email Address"
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="john@example.com"
                            />

                            <Input
                                label="Phone Number"
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 123-4567"
                            />

                            <Textarea
                                label="Message"
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="Tell us how we can help you..."
                            />

                            <Button type="submit" className="w-full">
                                Send Message
                            </Button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-playfair font-bold text-brand-gold mb-6">Contact Information</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-brand-dark dark:text-brand-cream mb-2">Email</h3>
                                    <a href="mailto:contact@hecupps.com" className="text-gray-600 dark:text-gray-400 hover:text-brand-gold transition-colors">
                                        contact@hecupps.com
                                    </a>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-brand-dark dark:text-brand-cream mb-2">Instagram</h3>
                                    <a
                                        href="https://instagram.com/hecupps"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 dark:text-gray-400 hover:text-brand-gold transition-colors"
                                    >
                                        @hecupps
                                    </a>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-brand-dark dark:text-brand-cream mb-2">Business Hours</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Monday - Saturday: 9:00 AM - 6:00 PM<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-brand-dark text-white rounded-2xl p-8">
                            <h3 className="text-xl font-playfair font-bold mb-4">Need Quick Help?</h3>
                            <p className="text-gray-300 mb-4">
                                Check out our FAQ section for answers to common questions.
                            </p>
                            <a
                                href="/faq"
                                className="inline-block bg-brand-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                            >
                                View FAQ
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
