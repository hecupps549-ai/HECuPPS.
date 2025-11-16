export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  videoUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
  customization: {
    messageCard: string;
    wrapping: string;
    ribbon: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  password?: string;
  status: 'Active' | 'Blocked';
  signupDate: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
export type PaymentStatus = 'Paid' | 'Failed' | 'Refunded';

export interface Order {
  id: string;
  transactionId: string;
  userId: string;
  customerName: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  currency: 'INR' | 'CAD';
  couponApplied?: string;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  orderType?: 'online' | 'manual';
}

export type Currency = 'INR' | 'CAD';

export interface Settings {
  currency: Currency;
  taxRate: number; // as percentage
  siteName: string;
  logoUrl: string;
  footerText: string;
  paymentGateways: {
    razorpay: { enabled: boolean; apiKey: string; };
    stripe: { enabled: boolean; apiKey: string; };
    paypal: { enabled: boolean; apiKey: string; };
    interac: { enabled: boolean; instructions: string; };
  };
  elasticApiKey: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'flat' | 'percentage';
  value: number;
  minPurchase: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  status: 'Active' | 'Inactive' | 'Expired';
  description?: string;
}

export interface Testimonial {
    quote: string;
    author: string;
    location: string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export type SupportTicketStatus = 'Open' | 'Pending' | 'Resolved' | 'Closed';

export interface SupportTicket {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  reply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  reportName: string;
  reportType: 'Daily' | 'Weekly' | 'Monthly' | 'Custom';
  startDate: string;
  endDate: string;
  currency: 'INR' | 'CAD' | 'Both';
  totalOrders: number;
  totalRevenue: number;
  totalTax: number;
  totalDiscount: number;
  createdAt: string;
}

export interface Backup {
  id: string;
  fileName: string;
  createdAt: string; // ISO string
  size: number; // in bytes
  data: string; // JSON string of the backed up state
}
