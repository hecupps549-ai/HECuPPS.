"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Input, Button } from '@/components/UI';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // TODO: Implement registration
        console.log('Signup attempt:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-playfair font-bold text-brand-gold mb-2">
                            Create Account
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Join HECuPPS today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Full Name"
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
                            placeholder="your@email.com"
                        />

                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />

                        <Input
                            label="Confirm Password"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />

                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            By signing up, you agree to our{' '}
                            <Link href="/terms" className="text-brand-gold hover:underline">Terms of Service</Link>
                            {' '}and{' '}
                            <Link href="/privacy" className="text-brand-gold hover:underline">Privacy Policy</Link>
                        </div>

                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
                        <Link href="/login" className="text-brand-gold font-semibold hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
