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
        console.log('Signup attempt:', formData);
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
                    <h1 className="text-xl font-outfit font-bold text-brand-black uppercase tracking-wider mb-1">Create Account</h1>
                    <p className="text-sm text-gray-500">Join the HECuPPS family</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input label="Full Name" id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Your Name" />
                    <Input label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" />
                    <Input label="Password" id="password" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                    <Input label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" />

                    <p className="text-xs text-gray-400">
                        By signing up, you agree to our{' '}
                        <a href="#" className="underline text-brand-black">Terms of Service</a> and{' '}
                        <a href="#" className="underline text-brand-black">Privacy Policy</a>.
                    </p>

                    <Button type="submit" className="w-full py-4">Create Account</Button>
                </form>

                <div className="mt-8 pt-6 border-t border-brand-border text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-brand-black font-bold hover:underline">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
