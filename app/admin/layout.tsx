"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MenuIcon, CloseIcon, MoonIcon, SunIcon } from '@/components/Icons';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const pathname = usePathname();
    const router = useRouter();

    // Check authentication
    useEffect(() => {
        if (pathname !== '/admin/login') {
            const session = localStorage.getItem('admin-session');
            if (!session) {
                router.push('/admin/login');
            }
        }
    }, [pathname, router]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark');
    };

    const handleLogout = () => {
        localStorage.removeItem('admin-session');
        router.push('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: '📊' },
        { name: 'Products', path: '/admin/products', icon: '📦' },
        { name: 'Orders', path: '/admin/orders', icon: '🛒' },
        { name: 'Users', path: '/admin/users', icon: '👥' },
        { name: 'Coupons', path: '/admin/coupons', icon: '🎫' },
        { name: 'Support', path: '/admin/support', icon: '💬' },
        { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
        { name: 'Backups', path: '/admin/backups', icon: '💾' },
    ];

    // Don't show layout on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const isActive = (path: string) => {
        if (path === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className={`fixed lg:relative z-50 lg:z-auto w-64 h-full bg-gray-900 text-gray-200 flex flex-col flex-shrink-0 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-between h-20 px-6 border-b border-gray-700">
                    <Link href="/admin" className="text-2xl font-playfair font-bold text-brand-gold">
                        HECuPPS
                    </Link>
                    <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <CloseIcon className="h-8 w-8" />
                    </button>
                </div>

                <nav className="flex-grow px-4 py-6 overflow-y-auto">
                    <ul className="space-y-1">
                        {navItems.map(item => (
                            <li key={item.name}>
                                <Link
                                    href={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isActive(item.path)
                                            ? 'bg-brand-gold text-white'
                                            : 'hover:bg-gray-800 text-gray-300'
                                        }`}
                                >
                                    <span className="text-xl mr-3">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                    >
                        <span className="text-xl mr-3">🚪</span>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <button
                        className="lg:hidden text-gray-600 dark:text-gray-300"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <MenuIcon />
                    </button>

                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white hidden lg:block">
                        Admin Dashboard
                    </h1>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
