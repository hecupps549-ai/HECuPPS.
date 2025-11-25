export type Currency = 'INR' | 'CAD';

export function formatPrice(amount: number, currency: Currency): string {
    const formatters: Record<Currency, Intl.NumberFormat> = {
        INR: new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }),
        CAD: new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
    };

    return formatters[currency].format(amount);
}

export function getCurrencySymbol(currency: Currency): string {
    const symbols: Record<Currency, string> = {
        INR: '₹',
        CAD: '$',
    };

    return symbols[currency];
}

export async function getActiveCurrency(): Promise<Currency> {
    // This would typically fetch from site settings
    // For now, return a default
    return 'INR';
}
