import React from 'react';
import type { Metadata } from 'next';
import { Playfair_Display, Inter, Outfit } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar, Footer } from '@/components/Navbar';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'HECuPPS — Premium Gift Hampers',
  description: "Curated luxury gift hampers handcrafted for every occasion — from birthdays to corporate gifting.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} ${outfit.variable} font-inter bg-white text-brand-black dark:bg-brand-black dark:text-white transition-colors duration-300`}>
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
