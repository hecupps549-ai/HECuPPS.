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

    useEffect(() => {
        if (pathname !== '/admin/login') {
            const authToken = localStorage.getItem('authToken');
            const isAdmin = sessionStorage.getItem('isAdmin');
            if (!authToken || isAdmin !== 'true') {
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
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('isAdmin');
        router.push('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: '📊' },
        { name: 'Products', path: '/admin/products', icon: '📦' },
        { name: 'Orders', path: '/admin/orders', icon: '🛒' },
        { name: 'Users', path: '/admin/users', icon: '👥' },
        { name: 'Coupons', path: '/admin/coupons', icon: '🏷️' },
        { name: 'Support', path: '/admin/support', icon: '💬' },
        { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
        { name: 'Backups', path: '/admin/backups', icon: '💾' },
    ];

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const isActive = (path: string) => {
        if (!pathname) return false;
        if (path === '/admin') return pathname === '/admin';
        return pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-brand-light">
            {/* Sidebar */}
            <aside className={`fixed lg:relative z-50 lg:z-auto w-64 h-full bg-white border-r border-brand-border flex flex-col flex-shrink-0 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-brand-border bg-brand-black">
                    <Link href="/admin" className="text-xl font-playfair font-bold text-white tracking-wide">
                        HECuPPS
                        <span className="block text-brand-accent text-xs font-inter font-normal tracking-widest uppercase">Admin Panel</span>
                    </Link>
                    <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-grow px-3 py-4 overflow-y-auto no-scrollbar">
                    <ul className="space-y-0.5">
                        {navItems.map(item => (
                            <li key={item.name}>
                                <Link
                                    href={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center px-4 py-3 text-sm font-medium transition-colors rounded ${isActive(item.path)
                                        ? 'bg-brand-black text-white'
                                        : 'text-gray-600 hover:bg-brand-light hover:text-brand-black'}`}
                                >
                                    <span className="mr-3 text-base">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-brand-border">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                        <span className="mr-3">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex-shrink-0 flex items-center justify-between h-16 px-6 bg-white border-b border-brand-border">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-gray-600" onClick={() => setIsSidebarOpen(true)}>
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        {/* Page title — shows what section we're in */}
                        <h1 className="text-sm font-bold uppercase tracking-widest text-brand-black hidden lg:block">
                            {navItems.find(i => isActive(i.path))?.name || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:text-brand-black hover:bg-brand-light rounded transition-colors"
                        >
                            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                        </button>
                        {/* View site */}
                        <Link href="/" target="_blank" className="text-xs font-semibold text-gray-500 hover:text-brand-black border border-brand-border px-3 py-1.5 rounded hover:border-brand-black transition-colors uppercase tracking-wider">
                            View Site
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-light">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
