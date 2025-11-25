"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuIcon, MoonIcon, SunIcon, CloseIcon, CartIcon } from './Icons';

interface NavbarProps {
    siteName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ siteName = 'HECuPPS' }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const pathname = usePathname();

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hampers', path: '/products' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <header className="sticky top-0 z-40 bg-brand-cream/80 dark:bg-brand-dark/80 backdrop-blur-lg shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="text-3xl font-playfair font-bold text-brand-gold">
                        {siteName}
                    </Link>

                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`text-lg font-medium transition-colors duration-200 ${isActive(link.path)
                                        ? 'text-brand-gold'
                                        : 'text-brand-dark hover:text-brand-gold dark:text-brand-cream dark:hover:text-brand-gold'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-brand-dark dark:text-brand-cream hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        >
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>

                        <Link
                            href="/cart"
                            className="relative p-2 rounded-full text-brand-dark dark:text-brand-cream hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        >
                            <CartIcon />
                            {/* Cart count badge - will be dynamic later */}
                        </Link>

                        <div className="hidden lg:flex items-center space-x-4">
                            <Link
                                href="/login"
                                className="font-semibold hover:text-brand-gold transition-colors dark:text-brand-cream dark:hover:text-brand-gold"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-brand-gold text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all"
                            >
                                Signup
                            </Link>
                        </div>

                        <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(true)}>
                            <MenuIcon className="text-brand-dark dark:text-brand-cream" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-50 bg-brand-cream dark:bg-brand-dark transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
                <div className="flex justify-between items-center p-4 border-b border-brand-gold/20">
                    <span className="text-2xl font-playfair font-bold text-brand-gold">{siteName}</span>
                    <button onClick={() => setIsMenuOpen(false)}>
                        <CloseIcon className="h-8 w-8 text-brand-dark dark:text-brand-cream" />
                    </button>
                </div>
                <nav className="flex flex-col items-center mt-8 space-y-6">
                    {navLinks.map(link => (
                        <Link
                            key={link.name}
                            href={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`text-2xl font-medium ${isActive(link.path)
                                    ? 'text-brand-gold'
                                    : 'text-brand-dark dark:text-brand-cream'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-6 border-t border-brand-gold/20 w-full flex flex-col items-center space-y-6">
                        <Link
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-2xl font-medium text-brand-dark dark:text-brand-cream"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            onClick={() => setIsMenuOpen(false)}
                            className="bg-brand-gold text-white px-6 py-3 rounded-md font-semibold text-lg"
                        >
                            Sign Up
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export const Footer: React.FC<{ siteName?: string }> = ({ siteName = 'HECuPPS' }) => {
    return (
        <footer className="bg-brand-dark text-brand-cream">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-playfair font-bold text-brand-gold">{siteName}</h3>
                        <p className="mt-2 text-gray-300">Curated Luxury, Wrapped with Love.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-white">Quick Links</h4>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
                            <li><Link href="/products" className="hover:text-brand-gold transition-colors">Hampers</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
                            <li><Link href="/faq" className="hover:text-brand-gold transition-colors">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-white">Legal</h4>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-white">Newsletter</h4>
                        <p className="mt-4 text-gray-300">Sign up for exclusive offers and updates.</p>
                        <div className="mt-4 flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full px-4 py-2 rounded-l-md bg-gray-700 text-white border-none focus:ring-2 focus:ring-brand-gold"
                            />
                            <button className="bg-brand-gold text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400">
                    <p>© 2024 HECuPPS. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
