import React from 'react';
import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'HECuPPS Gift Hamper',
  description: "A luxurious, elegant, and warm eCommerce website and a secure admin dashboard for 'HECuPPS', a premium gift hamper brand.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${poppins.variable} font-poppins bg-brand-cream text-brand-dark`}>
        <AppProvider>
            {children}
        </AppProvider>
      </body>
    </html>
  );
}
