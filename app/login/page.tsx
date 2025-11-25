"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Input, Button } from '@/components/UI';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement authentication
        console.log('Login attempt:', formData);
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
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Sign in to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-brand-gold hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
                        <Link href="/signup" className="text-brand-gold font-semibold hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
