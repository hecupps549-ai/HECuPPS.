"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/components/UI';

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // TODO: Implement actual authentication with NextAuth
        // For now, check default credentials
        if (formData.username === 'HECUPPS.main.admin' && formData.password === 'HECCUPPs1786.admin.admin') {
            // Store a temporary session flag
            localStorage.setItem('admin-session', 'true');
            router.push('/admin');
        } else {
            setError('Invalid username or password');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-playfair font-bold text-brand-gold mb-2">
                            Admin Portal
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Sign in to access the dashboard
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Username"
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter admin username"
                        />

                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                        />

                        <Button type="submit" className="w-full" variant="secondary">
                            Sign In to Dashboard
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                        <p>Default credentials:</p>
                        <p className="font-mono mt-1">Username: HECUPPS.main.admin</p>
                        <p className="font-mono">Password: HECCUPPs1786.admin.admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
