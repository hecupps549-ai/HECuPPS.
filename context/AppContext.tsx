"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Settings, Product, User, Order, Coupon, SupportTicket, Currency, CartItem, Report, OrderStatus, Backup } from '@/types';

// Custom hook for localStorage (will be used for cart and theme only)
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // FIX: Use import.meta.env for Vite environment variables and cast to any to bypass TypeScript error.
  const apiUrl = (import.meta as any).env.VITE_API_URL || '';
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...options.headers,
  };
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${apiUrl}/api${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Request failed with status ${response.status}` }));
    throw new Error(errorData.message || 'An unknown API error occurred');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};


interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (productData: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (productData: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  updateUserStatus: (userId: string, status: 'Active' | 'Blocked') => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  refundOrder: (orderId: string) => Promise<void>;
  placeOrder: (shippingDetails: Order['shippingAddress'], cartItems: CartItem[], total: number) => Promise<{ success: boolean; order?: Order }>;
  addManualOrder: (orderData: any) => Promise<{ success: boolean; order?: Order }>;
  deleteOrder: (orderId: string) => Promise<void>;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  supportTickets: SupportTicket[];
  setSupportTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  addSupportTicket: (ticketData: Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'reply'>) => Promise<void>;
  updateSupportTicket: (ticketId: string, updates: Partial<SupportTicket>) => Promise<void>;
  deleteSupportTicket: (ticketId: string) => Promise<void>;
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  backups: Backup[];
  setBackups: React.Dispatch<React.SetStateAction<Backup[]>>;
  createBackup: () => Promise<void>;
  restoreBackup: (backupId: string) => Promise<void>;
  deleteBackup: (backupId: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  admin: boolean;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  loginUser: (email: string, password: string) => Promise<'success' | 'blocked' | 'invalid'>;
  signupUser: (name: string, email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  formatCurrency: (amount: number) => string;
  arePaymentsEnabled: boolean;
  isInitialLoading: boolean;
  apiRequest: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: Settings = {
  currency: 'INR',
  taxRate: 18,
  siteName: 'HECuPPS',
  logoUrl: '',
  footerText: '© 2024 HECuPPS. All Rights Reserved.',
  paymentGateways: {
    razorpay: { enabled: true, apiKey: '' },
    stripe: { enabled: false, apiKey: '' },
    paypal: { enabled: false, apiKey: '' },
    interac: { enabled: false, instructions: 'Please send e-transfer to hecupps549@gmail.com' },
  },
  elasticApiKey: '',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [cart, setCart] = useLocalStorage<CartItem[]>('hecupps-cart', []);
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const arePaymentsEnabled = Object.values(settings.paymentGateways).some(gateway => (gateway as { enabled: boolean }).enabled);

    const fetchAdminData = async () => {
      const [usersData, ordersData, couponsData, ticketsData, reportsData, backupsData] = await Promise.all([
          apiRequest('/admin/users'),
          apiRequest('/admin/orders'),
          apiRequest('/admin/coupons'),
          apiRequest('/admin/support-tickets'),
          apiRequest('/admin/reports'),
          apiRequest('/admin/backups'),
      ]);
      setUsers(usersData || []);
      setOrders(ordersData || []);
      setCoupons(couponsData || []);
      setSupportTickets(ticketsData || []);
      setReports(reportsData || []);
      setBackups(backupsData || []);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsInitialLoading(true);
        const [settingsData, productsData] = await Promise.all([
          apiRequest('/settings').catch(() => defaultSettings),
          apiRequest('/products').catch(() => []),
        ]);
        setSettings(settingsData);
        setProducts(productsData);

        const token = localStorage.getItem('authToken');
        const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

        if (token) {
          if (isAdmin) {
            setAdmin(true);
            await fetchAdminData();
          } else {
            // Fetch logged in user data
            const userData = await apiRequest('/auth/me');
            setUser(userData.user);
            const userOrders = await apiRequest('/orders/my-orders');
            setOrders(userOrders);
          }
        }

      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        // Could be an expired token
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('isAdmin');
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  
  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updatedSettings = await apiRequest('/admin/settings', { method: 'PUT', body: JSON.stringify(newSettings) });
    setSettings(updatedSettings);
  };
  
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newProduct = await apiRequest('/products', { method: 'POST', body: JSON.stringify(productData) });
    setProducts(prev => [...prev, newProduct]);
  };
  
  const updateProduct = async (productData: Product) => {
    const updatedProduct = await apiRequest(`/products/${productData.id}`, { method: 'PUT', body: JSON.stringify(productData) });
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  const deleteProduct = async (productId: string) => {
    await apiRequest(`/products/${productId}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.id === item.id);
      if (existingItem) {
        return prevCart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prevCart, item];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity } : item).filter(item => item.quantity > 0));
  const removeFromCart = (productId: string) => setCart(prevCart => prevCart.filter(item => item.id !== productId));
  const clearCart = () => setCart([]);

  const loginUser = async (email: string, password: string): Promise<'success' | 'blocked' | 'invalid'> => {
    try {
        const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        if (data.user.status === 'BLOCKED') return 'blocked';
        
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        const userOrders = await apiRequest('/orders/my-orders');
        setOrders(userOrders);
        return 'success';
    } catch (error) {
        console.error("Login failed:", error);
        return 'invalid';
    }
  };

  const signupUser = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
        const data = await apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        return true;
    } catch (error) {
        console.error("Signup failed:", error);
        return false;
    }
  };
  
  const logoutUser = () => {
      setUser(null);
      localStorage.removeItem('authToken');
      setOrders([]);
  };

  const loginAdmin = async (password: string) => {
      try {
        const data = await apiRequest('/auth/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
        localStorage.setItem('authToken', data.token);
        sessionStorage.setItem('isAdmin', 'true');
        setAdmin(true);
        await fetchAdminData();
        return true;
      } catch (error) {
        return false;
      }
  };
  const logoutAdmin = () => {
      setAdmin(false);
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('isAdmin');
  };

  const updateUserStatus = async (userId: string, status: 'Active' | 'Blocked') => {
    const updatedUser = await apiRequest(`/admin/users/${userId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    setUsers(users.map(u => u.id === userId ? updatedUser : u));
  };
  
  const deleteUser = async (userId: string) => {
    await apiRequest(`/admin/users/${userId}`, { method: 'DELETE' });
    setUsers(users.filter(u => u.id !== userId));
  }

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updatedOrder = await apiRequest(`/admin/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
  };

  const refundOrder = async (orderId: string) => {
      const refundedOrder = await apiRequest(`/admin/orders/${orderId}/refund`, { method: 'POST' });
      setOrders(orders.map(o => o.id === orderId ? refundedOrder : o));
  };

  const deleteOrder = async (orderId: string) => {
      await apiRequest(`/admin/orders/${orderId}`, { method: 'DELETE' });
      setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const addSupportTicket = async (ticketData: Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'reply'>) => {
    const newTicket = await apiRequest('/support-tickets', { method: 'POST', body: JSON.stringify(ticketData) });
    setSupportTickets(prev => [newTicket, ...prev]);
  };

  const updateSupportTicket = async (ticketId: string, updates: Partial<SupportTicket>) => {
    const updatedTicket = await apiRequest(`/admin/support-tickets/${ticketId}`, { method: 'PUT', body: JSON.stringify(updates) });
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
  };
  
  const deleteSupportTicket = async (ticketId: string) => {
    await apiRequest(`/admin/support-tickets/${ticketId}`, { method: 'DELETE' });
    setSupportTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  const createBackup = async () => {
    const newBackup = await apiRequest('/admin/backups', { method: 'POST' });
    setBackups(prev => [newBackup, ...prev]);
  };

  const restoreBackup = async (backupId: string) => {
    if(!window.confirm("Are you sure? This will overwrite all current data.")) return;
    await apiRequest(`/admin/backups/${backupId}/restore`, { method: 'POST' });
    alert("Restore process initiated. Fetching updated data...");
    await fetchAdminData();
  };

  const deleteBackup = async (backupId: string) => {
    await apiRequest(`/admin/backups/${backupId}`, { method: 'DELETE' });
    setBackups(prev => prev.filter(b => b.id !== backupId));
  };

  const formatCurrency = (amount: number) => {
    const symbols: Record<Currency, string> = { INR: '₹', CAD: '$' };
    return `${symbols[settings.currency] || '$'}${amount.toFixed(2)}`;
  };

  const placeOrder = async (shippingDetails: Order['shippingAddress'], cartItems: CartItem[], total: number): Promise<{ success: boolean; order?: Order }> => {
    try {
        const result = await apiRequest('/orders', { method: 'POST', body: JSON.stringify({ shippingDetails, items: cartItems, totalAmount: total }) });
        if (result.order) {
            setOrders(prev => [result.order, ...prev]);
            clearCart();
            return { success: true, order: result.order };
        }
        return { success: false };
    } catch (error) {
        return { success: false };
    }
  };

  const addManualOrder = async (orderData: any): Promise<{ success: boolean, order?: Order }> => {
    try {
        const result = await apiRequest('/admin/orders/manual', { method: 'POST', body: JSON.stringify(orderData) });
        if(result.order) {
            setOrders(prev => [result.order, ...prev]);
            return { success: true, order: result.order };
        }
        return { success: false };
    } catch(err) {
        return { success: false };
    }
  };
  
  if(isInitialLoading) {
    return <div className="flex items-center justify-center h-screen w-screen"><div className="w-16 h-16 border-4 border-t-brand-gold border-gray-200 rounded-full animate-spin"></div></div>;
  }

  return (
    <AppContext.Provider value={{ 
      theme, toggleTheme,
      settings, setSettings, updateSettings,
      products, setProducts, addProduct, updateProduct, deleteProduct,
      users, setUsers, updateUserStatus, deleteUser,
      orders, setOrders, updateOrderStatus, refundOrder, deleteOrder,
      coupons, setCoupons,
      supportTickets, setSupportTickets, addSupportTicket, updateSupportTicket, deleteSupportTicket,
      reports, setReports,
      backups, setBackups, createBackup, restoreBackup, deleteBackup,
      cart, addToCart, updateCartQuantity, removeFromCart, clearCart,
      user, setUser,
      admin, setAdmin,
      loginUser, signupUser, logoutUser,
      loginAdmin, logoutAdmin,
      formatCurrency,
      placeOrder,
      addManualOrder,
      arePaymentsEnabled,
      isInitialLoading,
      apiRequest
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
