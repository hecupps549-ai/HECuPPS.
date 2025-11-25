"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency } from '@/lib/currency';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('INR');

    // Load currency from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('preferred-currency');
        if (saved === 'INR' || saved === 'CAD') {
            setCurrency(saved);
        }
    }, []);

    // Save currency to localStorage when it changes
    const handleSetCurrency = (newCurrency: Currency) => {
        setCurrency(newCurrency);
        localStorage.setItem('preferred-currency', newCurrency);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
