"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuIcon, CloseIcon, CartIcon } from './Icons';
import { useAppContext } from '@/context/AppContext';

interface NavbarProps {
    siteName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ siteName = 'HECuPPS' }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { cart, user, logoutUser } = useAppContext();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hampers', path: '/products' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path: string) => pathname === path;

    const announcementText = '🎁 Free delivery on orders over ₹999  ✨ Handcrafted with love  🎀 Customisation available  🎁 Free delivery on orders over ₹999  ✨ Handcrafted with love  🎀 Customisation available  ';

    return (
        <>
            {/* Announcement Marquee Bar */}
            <div className="bg-brand-accent text-white overflow-hidden">
                <div className="marquee-container py-2.5 text-sm font-medium tracking-wide">
                    <div className="marquee-track">
                        <span className="px-4">{announcementText}</span>
                        <span className="px-4">{announcementText}</span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-brand-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-3 items-center h-16 md:h-20">

                        {/* Left Navigation */}
                        <nav className="hidden lg:flex items-center gap-7">
                            {navLinks.slice(0, 2).map(link => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className={`text-sm font-medium uppercase tracking-wider transition-colors duration-150 ${isActive(link.path)
                                        ? 'text-brand-black border-b-2 border-brand-black pb-0.5'
                                        : 'text-gray-500 hover:text-brand-black'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile: Hamburger */}
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="p-2 text-brand-black"
                                aria-label="Open menu"
                            >
                                <MenuIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Center: Logo */}
                        <div className="flex justify-center">
                            <Link href="/" className="text-2xl md:text-3xl font-playfair font-bold text-brand-black tracking-tight">
                                {siteName}
                            </Link>
                        </div>

                        {/* Right: Links + Cart */}
                        <div className="flex items-center justify-end gap-5">
                            <nav className="hidden lg:flex items-center gap-7">
                                {navLinks.slice(2).map(link => (
                                    <Link
                                        key={link.name}
                                        href={link.path}
                                        className={`text-sm font-medium uppercase tracking-wider transition-colors duration-150 ${isActive(link.path)
                                            ? 'text-brand-black border-b-2 border-brand-black pb-0.5'
                                            : 'text-gray-500 hover:text-brand-black'}`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>

                            {/* Auth */}
                            <div className="hidden lg:flex items-center gap-4">
                                {!user ? (
                                    <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-brand-black transition-colors uppercase tracking-wider">
                                        Log In
                                    </Link>
                                ) : (
                                    <button onClick={logoutUser} className="text-sm font-medium text-gray-600 hover:text-brand-black transition-colors uppercase tracking-wider">
                                        Log Out
                                    </button>
                                )}
                            </div>

                            {/* Cart */}
                            <Link href="/cart" className="relative" aria-label="Cart">
                                <CartIcon className="w-6 h-6 text-brand-black" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold bg-brand-black text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer */}
                <div className={`fixed inset-0 z-50 lg:hidden`} style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}>
                    {/* Backdrop */}
                    <div
                        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-40' : 'opacity-0'}`}
                        onClick={() => setIsMenuOpen(false)}
                    />
                    {/* Drawer Panel */}
                    <div className={`absolute left-0 top-0 bottom-0 w-72 bg-white transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="flex justify-between items-center p-5 border-b border-brand-border">
                            <span className="text-xl font-playfair font-bold text-brand-black">{siteName}</span>
                            <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                                <CloseIcon className="h-6 w-6 text-brand-black" />
                            </button>
                        </div>
                        <nav className="flex flex-col py-6">
                            {navLinks.map(link => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-6 py-3.5 text-base font-medium uppercase tracking-wider border-b border-brand-border ${isActive(link.path) ? 'text-brand-black font-semibold bg-brand-light' : 'text-gray-600 hover:bg-brand-light'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="px-6 py-6 space-y-4">
                                {!user ? (
                                    <>
                                        <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3 border border-brand-black text-brand-black font-semibold uppercase tracking-wider text-sm hover:bg-brand-black hover:text-white transition-colors">
                                            Log In
                                        </Link>
                                        <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3 bg-brand-black text-white font-semibold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors">
                                            Sign Up
                                        </Link>
                                    </>
                                ) : (
                                    <button onClick={() => { logoutUser?.(); setIsMenuOpen(false); }} className="block w-full text-center py-3 border border-brand-black text-brand-black font-semibold uppercase tracking-wider text-sm">
                                        Log Out
                                    </button>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
};

export const Footer: React.FC<{ siteName?: string }> = ({ siteName = 'HECuPPS' }) => {
    return (
        <footer className="bg-brand-light border-t border-brand-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* 4-column grid with dividers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-brand-border py-14">
                    {/* Shop */}
                    <div className="pb-8 sm:pb-0 lg:pr-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-5">Shop</h3>
                        <ul className="space-y-3">
                            <li><Link href="/products" className="text-sm text-gray-600 hover:text-brand-black transition-colors">All Hampers</Link></li>
                            <li><Link href="/products?cat=Birthday" className="text-sm text-gray-600 hover:text-brand-black transition-colors">Birthday Hampers</Link></li>
                            <li><Link href="/products?cat=Festive" className="text-sm text-gray-600 hover:text-brand-black transition-colors">Festive Hampers</Link></li>
                            <li><Link href="/products?cat=Corporate" className="text-sm text-gray-600 hover:text-brand-black transition-colors">Corporate Hampers</Link></li>
                            <li><Link href="/products?cat=Wedding" className="text-sm text-gray-600 hover:text-brand-black transition-colors">Wedding Hampers</Link></li>
                        </ul>
                    </div>

                    {/* Delivery & Returns */}
                    <div className="py-8 sm:py-0 sm:pl-8 lg:pl-10 lg:pr-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-5">Delivery & Returns</h3>
                        <ul className="space-y-3">
                            <li className="text-sm text-gray-600">Free delivery on orders over ₹999</li>
                            <li className="text-sm text-gray-600">Pan-India shipping available</li>
                            <li className="text-sm text-gray-600">International orders on request</li>
                            <li><Link href="/faq" className="text-sm text-gray-600 hover:text-brand-black transition-colors">Shipping FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Store Policy */}
                    <div className="py-8 sm:py-0 sm:pl-0 lg:pl-10 lg:pr-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-5">Store Policy</h3>
                        <ul className="space-y-3">
                            <li><Link href="/faq" className="text-sm text-gray-600 hover:text-brand-black transition-colors">FAQ</Link></li>
                            <li><a href="#" className="text-sm text-gray-600 hover:text-brand-black transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-sm text-gray-600 hover:text-brand-black transition-colors">Terms & Conditions</a></li>
                            <li><a href="#" className="text-sm text-gray-600 hover:text-brand-black transition-colors">Refund Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className="pt-8 sm:pt-0 lg:pl-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-5">Contact Us</h3>
                        <ul className="space-y-3">
                            <li><Link href="/contact" className="text-sm text-gray-600 hover:text-brand-black transition-colors">Send us a message</Link></li>
                            <li>
                                <a
                                    href="https://www.instagram.com/hecupps_6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-600 hover:text-brand-black transition-colors"
                                >
                                    Instagram @hecupps_6
                                </a>
                            </li>
                            <li>
                                <a href="mailto:info@hecupps.com" className="text-sm text-gray-600 hover:text-brand-black transition-colors">
                                    info@hecupps.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-brand-border py-6 text-center">
                    <p className="text-xs text-gray-500">© {new Date().getFullYear()} {siteName}. All rights reserved. Curated luxury, wrapped with love.</p>
                </div>
            </div>
        </footer>
    );
};
