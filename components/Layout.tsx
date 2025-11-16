import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { HomeIcon, CategoryIcon, CartIcon, ProfileIcon, MenuIcon, MoonIcon, SunIcon, CloseIcon, DashboardIcon, ProductsIcon, OrdersIcon, UsersIcon, CouponIcon, ReportsIcon, SupportIcon, SettingsIcon, LogoutIcon, BackupIcon } from './Icons';

// User Layout
const ProfileDropdown: React.FC = () => {
    const { user, logoutUser } = useAppContext();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleLogout = () => {
        logoutUser();
        setIsOpen(false);
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-brand-gold flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                </div>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b dark:border-gray-600">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">My Profile</Link>
                    <Link to="/profile/orders" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">My Orders</Link>
                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                </div>
            )}
        </div>
    );
}

const UserHeader: React.FC = () => {
    const { settings, cart, theme, toggleTheme, user, logoutUser } = useAppContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Hampers', path: '/products' },
        { name: 'Contact Us', path: '/contact' },
    ];
    
    const handleMobileLogout = () => {
        logoutUser();
        setIsMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-40 bg-brand-cream/80 dark:bg-brand-dark/80 backdrop-blur-lg shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="text-3xl font-playfair font-bold text-brand-gold">{settings.siteName}</Link>
                    
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <NavLink key={link.name} to={link.path} className={({isActive}) => `text-lg font-medium transition-colors duration-200 ${isActive ? 'text-brand-gold' : 'text-brand-dark hover:text-brand-gold dark:text-brand-cream dark:hover:text-brand-gold'}`}>{link.name}</NavLink>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full text-brand-dark dark:text-brand-cream hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                        <Link to="/cart" className="relative p-2 rounded-full text-brand-dark dark:text-brand-cream hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                            <CartIcon />
                            {cart.length > 0 && <span className="absolute top-[-4px] right-[-4px] flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold shadow-md bg-brand-dark text-brand-cream dark:bg-brand-cream dark:text-brand-dark">
                                {cart.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>}
                        </Link>
                         <div className="hidden lg:flex items-center space-x-4">
                            {!user ? (
                                <>
                                    <Link to="/login" className="font-semibold hover:text-brand-gold transition-colors dark:text-brand-cream dark:hover:text-brand-gold">Login</Link>
                                    <Link to="/signup" className="bg-brand-gold text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all">Signup</Link>
                                </>
                            ) : (
                                <ProfileDropdown />
                            )}
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
                    <span className="text-2xl font-playfair font-bold text-brand-gold">{settings.siteName}</span>
                    <button onClick={() => setIsMenuOpen(false)}><CloseIcon className="h-8 w-8 text-brand-dark dark:text-brand-cream" /></button>
                </div>
                <nav className="flex flex-col items-center mt-8 space-y-6">
                    {navLinks.map(link => (
                        <NavLink key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className={({isActive}) => `text-2xl font-medium ${isActive ? 'text-brand-gold' : 'text-brand-dark dark:text-brand-cream'}`}>{link.name}</NavLink>
                    ))}
                    <div className="pt-6 border-t border-brand-gold/20 w-full flex flex-col items-center space-y-6">
                        {!user ? (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-2xl font-medium text-brand-dark dark:text-brand-cream">Login</Link>
                                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="bg-brand-gold text-white px-6 py-3 rounded-md font-semibold text-lg">Sign Up</Link>
                            </>
                        ) : (
                           <>
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-2xl font-medium text-brand-dark dark:text-brand-cream">My Profile</Link>
                                <button onClick={handleMobileLogout} className="text-2xl font-medium text-brand-dark dark:text-brand-cream">Logout</button>
                           </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

const UserFooter: React.FC = () => {
    const { settings } = useAppContext();
    return (
        <footer className="bg-brand-dark text-brand-cream">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-playfair font-bold text-brand-gold">{settings.siteName}</h3>
                        <p className="mt-2 text-gray-300">Curated Luxury, Wrapped with Love.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-white">Quick Links</h4>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
                            <li><Link to="/products" className="hover:text-brand-gold transition-colors">Hampers</Link></li>
                            <li><Link to="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="hover:text-brand-gold transition-colors">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-white">Legal</h4>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="hover:text-brand-gold transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-brand-gold transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-white">Newsletter</h4>
                        <p className="mt-4 text-gray-300">Sign up for exclusive offers and updates.</p>
                        <div className="mt-4 flex">
                            <input type="email" placeholder="Your email" className="w-full px-4 py-2 rounded-l-md bg-gray-700 text-white border-none focus:ring-2 focus:ring-brand-gold"/>
                            <button className="bg-brand-gold text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-colors">Subscribe</button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400">
                    <p>{settings.footerText}</p>
                </div>
            </div>
        </footer>
    );
};

const UserBottomNav: React.FC = () => {
    const navItems = [
        { name: 'Home', path: '/', icon: <HomeIcon /> },
        { name: 'Categories', path: '/products', icon: <CategoryIcon /> },
        { name: 'Cart', path: '/cart', icon: <CartIcon /> },
        { name: 'Profile', path: '/profile', icon: <ProfileIcon /> },
    ];
    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-brand-cream dark:bg-brand-dark border-t border-brand-dark/10 dark:border-brand-cream/10 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40">
            <div className="flex justify-around h-16">
                {navItems.map(item => (
                    <NavLink key={item.name} to={item.path} className={({isActive}) => `flex flex-col items-center justify-center w-full text-xs transition-colors ${isActive ? 'text-brand-gold' : 'text-brand-dark/70 dark:text-brand-cream/70 hover:text-brand-gold'}`}>
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { arePaymentsEnabled } = useAppContext();
    return (
        <div className="flex flex-col min-h-screen bg-brand-cream dark:bg-brand-dark dark:text-brand-cream">
            <UserHeader />
            {!arePaymentsEnabled && (
                <div className="bg-brand-coral text-white text-center py-2 px-4 font-semibold sticky top-20 z-30">
                    Online payments are currently unavailable. Please use Instagram to place your order.
                </div>
            )}
            <main className="flex-grow pb-16 lg:pb-0">{children}</main>
            <UserFooter />
            <UserBottomNav />
        </div>
    );
};


// Admin Layout
const AdminSidebar: React.FC<{ isOpen: boolean; setIsOpen: (isOpen: boolean) => void }> = ({ isOpen, setIsOpen }) => {
    const { settings } = useAppContext();

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
        { name: 'Products', path: '/admin/products', icon: <ProductsIcon /> },
        { name: 'Orders', path: '/admin/orders', icon: <OrdersIcon /> },
        { name: 'Users', path: '/admin/users', icon: <UsersIcon /> },
        { name: 'Coupons', path: '/admin/coupons', icon: <CouponIcon /> },
        { name: 'Reports', path: '/admin/reports', icon: <ReportsIcon /> },
        { name: 'Support', path: '/admin/support', icon: <SupportIcon /> },
        { name: 'Settings', path: '/admin/settings', icon: <SettingsIcon /> },
        { name: 'Backup', path: '/admin/backup', icon: <BackupIcon /> },
    ];

    return (
        <>
            <aside className={`fixed lg:relative z-50 lg:z-auto w-64 h-full bg-gray-900 text-gray-200 flex-col flex-shrink-0 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-between h-20 px-6 border-b border-gray-700">
                    <Link to="/admin" className="text-2xl font-playfair font-bold text-brand-gold">{settings.siteName}</Link>
                    <button className="lg:hidden" onClick={() => setIsOpen(false)}><CloseIcon className="h-8 w-8" /></button>
                </div>
                <nav className="flex-grow px-4 py-6">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.name}>
                                <NavLink to={item.path} onClick={() => setIsOpen(false)} className={({isActive}) => `flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${isActive ? 'bg-brand-gold text-white' : 'hover:bg-gray-800'}`}>
                                    {React.cloneElement(item.icon, { className: 'h-5 w-5 mr-3' })}
                                    <span className="font-medium">{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

// Fix: Destructure onMenuClick from props
const AdminHeader: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { theme, toggleTheme, logoutAdmin } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <button className="lg:hidden text-gray-600 dark:text-gray-300" onClick={onMenuClick}>
                <MenuIcon />
            </button>
            <div className="lg:hidden"></div> {/* Spacer for mobile */}
            <div className="hidden lg:block">
                 <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    {theme === 'light' ? <SunIcon className="text-brand-dark"/> : <MoonIcon className="text-brand-cream" />}
                </button>
                <button onClick={handleLogout} className="flex items-center p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Logout">
                    <LogoutIcon />
                </button>
            </div>
        </header>
    );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};