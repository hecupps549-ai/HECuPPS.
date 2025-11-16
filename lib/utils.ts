
export const formatCurrencyForDisplay = (amount: number, currency: 'INR' | 'CAD') => {
  const symbols: Record<typeof currency, string> = { INR: '₹', CAD: '$' };
  return `${symbols[currency] || '$'}${amount.toFixed(2)}`;
};

export const generateOrderId = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 5);
    return `HEC-${timestamp}-${randomPart}`.toUpperCase();
}
