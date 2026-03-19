"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/components/UI';

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.username === 'HECUPPS.main.admin' && formData.password === 'HECCUPPs1786.admin.admin') {
            localStorage.setItem('authToken', 'admin-temp-token');
            sessionStorage.setItem('isAdmin', 'true');
            router.push('/admin');
        } else {
            setError('Invalid username or password');
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-brand-light flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Card */}
                <div className="bg-white border border-brand-border p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-2xl font-playfair font-bold text-brand-black mb-1">HECuPPS</div>
                        <div className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-4">Admin Portal</div>
                        <p className="text-sm text-gray-500">Sign in to access the dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-5 p-3 border border-red-200 bg-red-50 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Username"
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Admin username"
                            autoComplete="username"
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
                            autoComplete="current-password"
                        />
                        <Button type="submit" disabled={loading} className="w-full py-4 mt-2">
                            {loading ? 'Signing In...' : 'Sign In to Dashboard'}
                        </Button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-brand-border text-center">
                        <p className="text-xs text-gray-400 mb-1">Default credentials</p>
                        <p className="text-xs font-mono text-gray-600">HECUPPS.main.admin</p>
                        <p className="text-xs font-mono text-gray-600">HECCUPPs1786.admin.admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
