"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Input, Button } from '@/components/UI';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-brand-light flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md bg-white border border-brand-border p-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-playfair font-bold text-brand-black block mb-6">
                        HECuPPS
                    </Link>
                    <h1 className="text-xl font-outfit font-bold text-brand-black uppercase tracking-wider mb-1">Welcome Back</h1>
                    <p className="text-sm text-gray-500">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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

                    <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="border border-brand-border" />
                            <span className="text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-gray-500 hover:text-brand-black transition-colors">Forgot password?</a>
                    </div>

                    <Button type="submit" className="w-full py-4">Sign In</Button>
                </form>

                <div className="mt-8 pt-6 border-t border-brand-border text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-brand-black font-bold hover:underline">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
}
