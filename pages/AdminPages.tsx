import React, { useState, FormEvent, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation, Outlet } from 'react-router-dom';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { AdminLayout } from '../components/Layout';
import { Button, Input, Modal, Card, Table, Td, StatusBadge, Select } from '../components/UI';
import { EditIcon, TrashIcon, BackupIcon, DownloadIcon, RestoreIcon, SpinnerIcon } from '../components/Icons';
import { Product, Order, User, Coupon, Report, OrderStatus, PaymentStatus, SupportTicket, SupportTicketStatus, Backup, Settings } from '../types';

// Admin Login Page
const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginAdmin } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const masterKeyPassed = sessionStorage.getItem('masterKeyPassed');
        if (!masterKeyPassed) {
            navigate('/master-key-login');
        }
    }, [navigate]);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await loginAdmin(password);
        if (success) {
            navigate('/admin/dashboard');
        } else {
            setError('Invalid admin credentials.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-playfair font-bold text-brand-gold">HECuPPS Admin</h1>
                    <p className="mt-2 text-gray-400">Please sign in to continue</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Input label="Username" id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="HECuPPS.admin" />
                    <Input label="Password" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full">Login</Button>
                </form>
            </div>
        </div>
    );
};

// Dashboard Page
const Dashboard = () => {
    const { orders, products, users, formatCurrency } = useAppContext();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const salesData = [
        { name: 'Jan', sales: 4000 }, { name: 'Feb', sales: 3000 }, { name: 'Mar', sales: 5000 },
        { name: 'Apr', sales: 4500 }, { name: 'May', sales: 6000 }, { name: 'Jun', sales: 5500 },
    ];

    return (
        <div>
            <h1 className="text-3xl font-playfair font-bold mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6"><h3 className="text-lg text-gray-400">Total Revenue</h3><p className="text-3xl font-bold mt-2">{formatCurrency(totalRevenue)}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Total Orders</h3><p className="text-3xl font-bold mt-2">{orders.length}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Total Products</h3><p className="text-3xl font-bold mt-2">{products.length}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Total Users</h3><p className="text-3xl font-bold mt-2">{users.length}</p></Card>
            </div>
            <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Sales Trends (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none' }}/>
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#8E5A3B" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

// Product Management Page
const ProductFormModal: React.FC<{ isOpen: boolean; onClose: () => void; product: Product | null; onSave: (product: Product | Omit<Product, 'id'>) => void;}> = ({ isOpen, onClose, product, onSave }) => {
    const { apiRequest } = useAppContext(); // Assuming apiRequest is in context
    const [formData, setFormData] = useState<Omit<Product, 'id' | 'images' | 'videoUrl'>>({ name: '', description: '', price: 0, category: '', stock: 0 });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (product) {
                const { images, id, videoUrl, ...productData } = product;
                setFormData(productData);
                setImageUrl(images[0] || '');
                setVideoUrl(videoUrl || '');
            } else {
                setFormData({ name: '', description: '', price: 0, category: '', stock: 0 });
                setImageUrl('');
                setVideoUrl('');
            }
            setImageFile(null);
            setVideoFile(null);
        }
    }, [product, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).type === 'number' ? parseFloat(value) : value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video') => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            if (fileType === 'image') {
                setImageFile(file);
                setImageUrl(previewUrl);
            } else {
                setVideoFile(file);
                setVideoUrl(previewUrl);
            }
        }
    };

    const uploadFile = async (file: File) => {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        const data = await apiRequest('/upload', {
            method: 'POST',
            body: uploadFormData,
        });
        if (!data.url) throw new Error(data.message || 'Upload failed');
        return data.url;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        let finalImageUrl = product?.images[0] || '';
        let finalVideoUrl = product?.videoUrl || '';

        try {
            if (imageFile) {
                finalImageUrl = await uploadFile(imageFile);
            }
            if (videoFile) {
                finalVideoUrl = await uploadFile(videoFile);
            }
        } catch (error) {
            console.error(error);
            alert('File upload failed.');
            setIsUploading(false);
            return;
        }
        
        setIsUploading(false);
        const productData = { ...formData, images: [finalImageUrl], videoUrl: finalVideoUrl };

        if (product) {
            onSave({ ...productData, id: product.id });
        } else {
            onSave(productData);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add Product'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent" />
                </div>
                <Input label="Category" name="category" value={formData.category} onChange={handleChange} required />
                <Input label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required step="0.01" />
                <Input label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                <Input label="Product Image" name="image" type="file" onChange={(e) => handleFileChange(e, 'image')} accept="image/*" />
                {imageUrl && <img src={imageUrl} alt="Image Preview" className="w-24 h-24 object-cover rounded-md" />}
                
                <Input label="Product Video (Optional)" name="video" type="file" onChange={(e) => handleFileChange(e, 'video')} accept="video/*" />
                {videoUrl && <video src={videoUrl} controls className="w-full max-w-xs rounded-md" />}
                
                <div className="flex justify-end pt-4 space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose} className="py-2 px-4 text-base">Cancel</Button>
                    <Button type="submit" className="py-2 px-4 text-base" disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Save Product'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

const ProductManagement = () => {
    const { products, addProduct, updateProduct, formatCurrency, deleteProduct } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showSaveToast, setShowSaveToast] = useState(false);
    const [showDeleteToast, setShowDeleteToast] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const openModalForNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const openDeleteModal = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (productToDelete) {
            await deleteProduct(productToDelete.id);
            setShowDeleteToast(true);
            setTimeout(() => setShowDeleteToast(false), 3000);
        }
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
    };

    const handleSave = async (productData: Product | Omit<Product, 'id'>) => {
        try {
            if ('id' in productData) {
                await updateProduct(productData);
            } else {
                await addProduct(productData);
            }
            setIsModalOpen(false);
            setShowSaveToast(true);
            setTimeout(() => setShowSaveToast(false), 3000);
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Error saving product.");
        }
    };
    
    return (
        <div>
             {showSaveToast && (
                <div className="fixed top-24 right-6 z-[100] bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl animate-fade-in-out">
                    ✅ Product successfully saved.
                </div>
            )}
             {showDeleteToast && (
                <div className="fixed top-24 right-6 z-[100] bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl animate-fade-in-out">
                    ✅ Product successfully deleted.
                </div>
            )}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-playfair font-bold">Product Management</h1>
                <Button onClick={openModalForNew}>Add Product</Button>
            </div>
            <Table headers={['Name', 'Category', 'Price', 'Stock', 'Actions']}>
                {products.map(p => (
                    <tr key={p.id}>
                        <Td>{p.name}</Td>
                        <Td>{p.category}</Td>
                        <Td>{formatCurrency(p.price)}</Td>
                        <Td>
                            {p.stock}
                            {p.stock <= 5 && <span className="ml-2 text-xs font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 px-2 py-1 rounded-full">Low Stock</span>}
                        </Td>
                        <Td>
                            <div className="flex space-x-2">
                                <button onClick={() => openModalForEdit(p)} className="text-blue-500 hover:text-blue-700"><EditIcon className="w-5 h-5"/></button>
                                <button onClick={() => openDeleteModal(p)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </Td>
                    </tr>
                ))}
            </Table>
            <ProductFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={editingProduct} onSave={handleSave} />
             <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <p>⚠️ Are you sure you want to delete this product? This action cannot be undone.</p>
                <div className="flex justify-end mt-6 space-x-2">
                    <Button variant="secondary" className="py-2 px-4 text-base" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                    <Button variant="danger" className="py-2 px-4 text-base" onClick={confirmDelete}>Delete</Button>
                </div>
            </Modal>
        </div>
    );
};

// User Management Page
const UserDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; user: User; orders: Order[] }> = ({ isOpen, onClose, user, orders }) => {
    const { formatCurrency } = useAppContext();
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="User Details">
            <div className="space-y-4">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Signup Date:</strong> {new Date(user.signupDate).toLocaleString()}</p>
                <p><strong>Status:</strong> {user.status}</p>
                <hr className="dark:border-gray-600"/>
                <h4 className="text-lg font-semibold">Order History ({orders.length} total)</h4>
                {orders.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                        <ul>
                            {orders.map(order => (
                                <li key={order.id} className="py-2 border-b dark:border-gray-700">
                                    <p><strong>Order ID:</strong> {order.id}</p>
                                    <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                                    <p><strong>Amount:</strong> {formatCurrency(order.totalAmount)}</p>
                                    <p><strong>Status:</strong> <StatusBadge status={order.status} /></p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : <p>No orders found for this user.</p>}
                 <div className="flex justify-end pt-4 space-x-2">
                    <Button variant="secondary" className="text-sm py-2 px-4">Export CSV</Button>
                    <Button variant="secondary" className="text-sm py-2 px-4">Export PDF</Button>
                </div>
            </div>
        </Modal>
    );
};

const UserManagement = () => {
    const { users, orders, updateUserStatus, deleteUser } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Blocked'>('All');
    const [sortOrder, setSortOrder] = useState<'Newest' | 'Oldest' | 'Most Orders'>('Newest');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const filteredAndSortedUsers = useMemo(() => {
        return users
            .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(user => statusFilter === 'All' || user.status === statusFilter)
            .sort((a, b) => {
                switch (sortOrder) {
                    case 'Oldest': return new Date(a.signupDate).getTime() - new Date(b.signupDate).getTime();
                    case 'Most Orders':
                        const ordersA = orders.filter(o => o.userId === a.id).length;
                        const ordersB = orders.filter(o => o.userId === b.id).length;
                        return ordersB - ordersA;
                    case 'Newest': default: return new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime();
                }
            });
    }, [users, orders, searchTerm, statusFilter, sortOrder]);
    
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * usersPerPage;
        return filteredAndSortedUsers.slice(startIndex, startIndex + usersPerPage);
    }, [filteredAndSortedUsers, currentPage]);
    
    const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);
    const handleViewUser = (user: User) => { setSelectedUser(user); setIsViewModalOpen(true); };
    const handleBlockToggle = (user: User) => updateUserStatus(user.id, user.status === 'Active' ? 'Blocked' : 'Active');
    const openDeleteModal = (user: User) => { setUserToDelete(user); setIsDeleteModalOpen(true); };
    const confirmDelete = () => {
        if (userToDelete) deleteUser(userToDelete.id);
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };
    
    const activeUsers = users.filter(u => u.status === 'Active').length;
    const blockedUsers = users.length - activeUsers;
    const usersThisMonth = users.filter(u => new Date(u.signupDate) > new Date(new Date().setDate(new Date().getDate() - 30))).length;

    return (
        <div>
            <h1 className="text-3xl font-playfair font-bold mb-8">User Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6"><h3 className="text-lg text-gray-400">Total Users</h3><p className="text-3xl font-bold mt-2">{users.length}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Active Users</h3><p className="text-3xl font-bold mt-2">{activeUsers}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Blocked Users</h3><p className="text-3xl font-bold mt-2">{blockedUsers}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">New This Month</h3><p className="text-3xl font-bold mt-2">{usersThisMonth}</p></Card>
            </div>
            <Card className="p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
                        <option value="All">All Statuses</option> <option value="Active">Active</option> <option value="Blocked">Blocked</option>
                    </Select>
                    <Select value={sortOrder} onChange={e => setSortOrder(e.target.value as any)}>
                        <option value="Newest">Newest First</option> <option value="Oldest">Oldest First</option> <option value="Most Orders">Most Orders</option>
                    </Select>
                </div>
            </Card>
            
            <Table headers={['User ID', 'Full Name', 'Email', 'Signup Date', 'Status', 'Total Orders', 'Actions']}>
                {paginatedUsers.map(user => (
                    <tr key={user.id}>
                        <Td>{user.id.substring(0, 8)}...</Td>
                        <Td>{user.name}</Td>
                        <Td>{user.email}</Td>
                        <Td>{new Date(user.signupDate).toLocaleDateString()}</Td>
                        <Td><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{user.status}</span></Td>
                        <Td>{orders.filter(o => o.userId === user.id).length}</Td>
                        <Td>
                            <div className="flex space-x-3">
                                <button onClick={() => handleViewUser(user)} className="text-blue-500 hover:text-blue-700">View</button>
                                <button onClick={() => handleBlockToggle(user)} className="text-yellow-500 hover:text-yellow-700">{user.status === 'Active' ? 'Block' : 'Unblock'}</button>
                                <button onClick={() => openDeleteModal(user)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </Td>
                    </tr>
                ))}
            </Table>
            
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4"><Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="py-1 px-3 text-sm">Previous</Button><span>Page {currentPage} of {totalPages}</span><Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="py-1 px-3 text-sm">Next</Button></div>
            )}
            {selectedUser && <UserDetailsModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} user={selectedUser} orders={orders.filter(o => o.userId === selectedUser.id)} />}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <p>Are you sure you want to permanently delete this user and their order history? This action cannot be undone.</p>
                <div className="flex justify-end mt-6 space-x-2"><Button variant="secondary" className="py-2 px-4 text-base" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" className="py-2 px-4 text-base" onClick={confirmDelete}>Delete</Button></div>
            </Modal>
        </div>
    );
};


// Coupon Management
const CouponFormModal: React.FC<{ isOpen: boolean; onClose: () => void; coupon: Coupon | null; onSave: (coupon: Coupon) => void;}> = ({ isOpen, onClose, coupon, onSave }) => {
    const emptyCoupon: Omit<Coupon, 'id' | 'timesUsed'> = {
        code: '',
        discountType: 'percentage',
        value: 10,
        minPurchase: 0,
        expiryDate: '',
        usageLimit: 100,
        status: 'Active',
        description: ''
    };
    const [formData, setFormData] = useState(emptyCoupon);

    React.useEffect(() => {
        if (coupon) {
            setFormData({ ...coupon });
        } else {
            setFormData(emptyCoupon);
        }
    }, [coupon, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (e.target instanceof HTMLInputElement && e.target.type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: coupon?.id || '', timesUsed: coupon?.timesUsed || 0 });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={coupon ? 'Edit Coupon' : 'Create Coupon'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Coupon Code" name="code" value={formData.code} onChange={handleChange} required />
                <Select label="Discount Type" name="discountType" value={formData.discountType} onChange={handleChange}>
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat Amount</option>
                </Select>
                <Input label="Value" name="value" type="number" value={formData.value} onChange={handleChange} required />
                <Input label="Minimum Purchase" name="minPurchase" type="number" value={formData.minPurchase} onChange={handleChange} />
                <Input label="Expiry Date" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} required />
                <Input label="Usage Limit" name="usageLimit" type="number" value={formData.usageLimit} onChange={handleChange} />
                 <Select label="Status" name="status" value={formData.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </Select>
                <div className="flex justify-end pt-4 space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose} className="py-2 px-4 text-base">Cancel</Button>
                    <Button type="submit" className="py-2 px-4 text-base">Save Coupon</Button>
                </div>
            </form>
        </Modal>
    );
};

const CouponManagement = () => {
    const { coupons, setCoupons, formatCurrency } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [showSaveToast, setShowSaveToast] = useState(false);
    const [showDeleteToast, setShowDeleteToast] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

    const openModalForNew = () => {
        setEditingCoupon(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setIsModalOpen(true);
    };

    const openDeleteModal = (coupon: Coupon) => {
        setCouponToDelete(coupon);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (couponToDelete) {
            setCoupons(prevCoupons => prevCoupons.filter(c => c.id !== couponToDelete.id));
            setShowDeleteToast(true);
            setTimeout(() => {
                setShowDeleteToast(false);
            }, 3000);
        }
        setIsDeleteModalOpen(false);
        setCouponToDelete(null);
    };

    const handleSave = (coupon: Coupon) => {
        if (editingCoupon) {
            setCoupons(coupons.map(c => c.id === coupon.id ? coupon : c));
        } else {
            setCoupons([...coupons, { ...coupon, id: Date.now().toString(), timesUsed: 0 }]);
        }
        setIsModalOpen(false);
        setShowSaveToast(true);
        setTimeout(() => {
            setShowSaveToast(false);
        }, 3000);
    };
    
    const CouponStatusBadge: React.FC<{status: Coupon['status']}> = ({ status }) => {
        const colorClasses: {[key: string]: string} = {
            Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            Inactive: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            Expired: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        };
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[status]}`}>{status}</span>;
    };


    return (
        <div>
             {showSaveToast && (
                <div className="fixed top-24 right-6 z-[100] bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl animate-fade-in-out">
                    ✅ Coupon saved successfully.
                </div>
            )}
             {showDeleteToast && (
                <div className="fixed top-24 right-6 z-[100] bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl animate-fade-in-out">
                    ✅ Coupon removed from system.
                </div>
            )}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-playfair font-bold">Coupon Management</h1>
                <Button onClick={openModalForNew}>Create New Coupon</Button>
            </div>
            <Table headers={['Code', 'Type', 'Value', 'Expiry', 'Status', 'Usage', 'Actions']}>
                {coupons.map(c => (
                    <tr key={c.id}>
                        <Td><span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{c.code}</span></Td>
                        <Td>{c.discountType}</Td>
                        <Td>{c.discountType === 'flat' ? formatCurrency(c.value) : `${c.value}%`}</Td>
                        <Td>{new Date(c.expiryDate).toLocaleDateString()}</Td>
                        <Td><CouponStatusBadge status={c.status} /></Td>
                        <Td>{c.timesUsed} / {c.usageLimit}</Td>
                        <Td>
                            <div className="flex space-x-2">
                                <button onClick={() => openModalForEdit(c)} className="text-blue-500 hover:text-blue-700"><EditIcon className="w-5 h-5"/></button>
                                <button onClick={() => openDeleteModal(c)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </Td>
                    </tr>
                ))}
            </Table>
            <CouponFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} coupon={editingCoupon} onSave={handleSave} />
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <p>⚠️ Are you sure you want to delete this coupon? This action cannot be undone.</p>
                <div className="flex justify-end mt-6 space-x-2">
                    <Button variant="secondary" className="py-2 px-4 text-base" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                    <Button variant="danger" className="py-2 px-4 text-base" onClick={confirmDelete}>Delete</Button>
                </div>
            </Modal>
        </div>
    );
};

// Report Management
const ReportGenerationModal: React.FC<{ isOpen: boolean, onClose: () => void, onGenerate: (report: Report) => void, orders: Order[] }> = ({ isOpen, onClose, onGenerate, orders }) => {
    const [formData, setFormData] = useState({
        reportName: '',
        reportType: 'Custom',
        startDate: '',
        endDate: '',
        currency: 'Both',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const filteredOrders = orders.filter(o => {
            const orderDate = new Date(o.date).getTime();
            const start = formData.startDate ? new Date(formData.startDate).getTime() : 0;
            const end = formData.endDate ? new Date(formData.endDate).getTime() : Date.now();
            return orderDate >= start && orderDate <= end;
        });

        const newReport: Report = {
            id: Date.now().toString(),
            reportName: formData.reportName,
            reportType: formData.reportType as Report['reportType'],
            startDate: formData.startDate,
            endDate: formData.endDate,
            currency: formData.currency as Report['currency'],
            totalOrders: filteredOrders.length,
            totalRevenue: filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0),
            totalTax: filteredOrders.reduce((sum, o) => sum + o.totalAmount * 0.1, 0), // Mock tax
            totalDiscount: filteredOrders.reduce((sum, o) => sum + (o.totalAmount * 0.05), 0), // Mock discount
            createdAt: new Date().toISOString(),
        };
        onGenerate(newReport);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Generate New Report">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Report Name" name="reportName" value={formData.reportName} onChange={handleChange} required />
                <Select label="Report Type" name="reportType" value={formData.reportType} onChange={handleChange}>
                    <option>Daily</option> <option>Weekly</option> <option>Monthly</option> <option>Custom</option>
                </Select>
                <Input label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                <Input label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
                <Select label="Currency" name="currency" value={formData.currency} onChange={handleChange}>
                    <option value="Both">Both</option><option value="INR">INR</option><option value="CAD">CAD</option>
                </Select>
                <div className="flex justify-end pt-4 space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose} className="py-2 px-4 text-base">Cancel</Button>
                    <Button type="submit" className="py-2 px-4 text-base">Generate Report</Button>
                </div>
            </form>
        </Modal>
    );
};


const ReportManagement = () => {
    const { reports, setReports, orders, formatCurrency, coupons } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleDelete = (reportId: string) => {
        if(window.confirm('Are you sure you want to delete this report?')) {
            setReports(prev => prev.filter(r => r.id !== reportId));
        }
    };
    
    const handleGenerateReport = (report: Report) => {
        setReports(prev => [report, ...prev]);
    };
    
    const totalRevenueAllTime = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-playfair font-bold">Sales Reports</h1>
                <Button onClick={() => setIsModalOpen(true)}>Generate New Report</Button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6"><h3 className="text-lg text-gray-400">Reports Generated</h3><p className="text-3xl font-bold mt-2">{reports.length}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Revenue (All Time)</h3><p className="text-3xl font-bold mt-2">{formatCurrency(totalRevenueAllTime)}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Total Orders</h3><p className="text-3xl font-bold mt-2">{orders.length}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Coupons Used</h3><p className="text-3xl font-bold mt-2">{coupons.reduce((sum, c) => sum + c.timesUsed, 0)}</p></Card>
            </div>
            
            <Table headers={['Report Name', 'Type', 'Date Range', 'Total Revenue', 'Generated On', 'Actions']}>
                 {reports.map(report => (
                    <tr key={report.id}>
                        <Td>{report.reportName}</Td>
                        <Td>{report.reportType}</Td>
                        <Td>{new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}</Td>
                        <Td>{formatCurrency(report.totalRevenue)}</Td>
                        <Td>{new Date(report.createdAt).toLocaleString()}</Td>
                        <Td>
                            <div className="flex space-x-3">
                                <button className="text-blue-500 hover:text-blue-700">View</button>
                                <button className="text-green-500 hover:text-green-700">Download</button>
                                <button onClick={() => handleDelete(report.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </Td>
                    </tr>
                ))}
            </Table>
            <ReportGenerationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onGenerate={handleGenerateReport} orders={orders} />
        </div>
    );
};

const ManualOrderFormModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { products, addManualOrder } = useAppContext();
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [status, setStatus] = useState<OrderStatus>('Completed');
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
    const [error, setError] = useState('');

    const selectedProduct = useMemo(() => products.find(p => p.id === productId), [products, productId]);

    useEffect(() => {
        if (selectedProduct) {
            setPrice(selectedProduct.price);
            if (quantity > selectedProduct.stock) {
                setQuantity(selectedProduct.stock > 0 ? selectedProduct.stock : 1);
            }
        } else {
            setPrice(0);
        }
    }, [selectedProduct, quantity]);

    const resetForm = () => {
        setCustomerName('');
        setCustomerEmail('');
        setProductId('');
        setQuantity(1);
        setPrice(0);
        setPaymentMethod('Cash');
        setStatus('Completed');
        setPaymentStatus('Paid');
        setError('');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!selectedProduct) {
            setError('Please select a product.');
            return;
        }
        if (quantity <= 0) {
            setError('Quantity must be greater than zero.');
            return;
        }
        if (quantity > selectedProduct.stock) {
            setError(`Only ${selectedProduct.stock} units available.`);
            return;
        }

        const result = await addManualOrder({
            customerName,
            customerEmail,
            productId,
            quantity,
            price,
            paymentMethod,
            status,
            paymentStatus,
        });

        if (result.success) {
            alert('✅ Manual order added successfully. Stock updated.');
            resetForm();
            onClose();
        } else {
            setError('Failed to create order. Please check stock levels.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Manual Order">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
                <Input label="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
                <Input label="Customer Email" type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} required />
                <Select label="Product" value={productId} onChange={e => setProductId(e.target.value)} required>
                    <option value="">Select a Product</option>
                    {products.filter(p => p.stock > 0).map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
                </Select>
                {selectedProduct && (
                    <>
                        <Input label="Quantity" type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} min="1" max={selectedProduct.stock} required />
                        <Input label="Price per item" type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} step="0.01" required />
                    </>
                )}
                <Select label="Payment Method" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <option>Cash</option>
                    <option>Interac e-Transfer</option>
                    <option>PayPal</option>
                    <option>Stripe</option>
                </Select>
                <Select label="Order Status" value={status} onChange={e => setStatus(e.target.value as OrderStatus)}>
                    <option>Pending</option><option>Processing</option><option>Completed</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option><option>Refunded</option>
                </Select>
                 <Select label="Payment Status" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value as PaymentStatus)}>
                    <option>Paid</option><option>Failed</option><option>Refunded</option>
                </Select>
                <div className="flex justify-end pt-4 space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose} className="py-2 px-4 text-base">Cancel</Button>
                    <Button type="submit" className="py-2 px-4 text-base">Submit Order</Button>
                </div>
            </form>
        </Modal>
    );
};


// Order Management Page
const OrderDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onUpdateStatus: (orderId: string, status: OrderStatus) => void;
    onRefund: (orderId: string) => void;
}> = ({ isOpen, onClose, order, onUpdateStatus, onRefund }) => {
    const { formatCurrency, users } = useAppContext();
    const user = order ? users.find(u => u.id === order.userId) : null;
    const [status, setStatus] = useState(order?.status || 'Pending');

    React.useEffect(() => {
        if (order) setStatus(order.status);
    }, [order]);

    if (!order) return null;

    const handleStatusUpdate = () => {
        onUpdateStatus(order.id, status);
        alert('Status updated!');
    };
    
    const handleRefund = () => {
        if(window.confirm('Are you sure you want to refund this order? This will update the payment status to Refunded and restore stock.')) {
            onRefund(order.id);
            onClose();
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Order Details: ${order.id}`}>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold">Customer Details</h4>
                    <p>Name: {order.customerName}</p>
                    <p>Email: {user?.email || order.shippingAddress.email ||'N/A'}</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Payment Details</h4>
                    <p>Amount: {formatCurrency(order.totalAmount)} ({order.currency})</p>
                    <p>Method: {order.paymentMethod}</p>
                    <p>Transaction ID: {order.transactionId}</p>
                    <p>Payment Status: <StatusBadge status={order.paymentStatus} /></p>
                </div>
                <div>
                    <h4 className="font-semibold">Order Status</h4>
                    <div className="flex items-center gap-2 mt-2">
                        <Select value={status} onChange={e => setStatus(e.target.value as OrderStatus)}>
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Shipped</option>
                            <option>Completed</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                            <option>Refunded</option>
                        </Select>
                        <Button onClick={handleStatusUpdate} className="py-2 px-4 text-sm">Update</Button>
                    </div>
                </div>
                <div className="flex justify-end pt-4 space-x-2">
                    {/* FIX: Use import.meta.env for Vite and cast to any to avoid TS error */}
                    <a href={`${(import.meta as any).env.VITE_API_URL}/api/orders/${order.id}/invoice`} target="_blank" rel="noopener noreferrer">
                       <Button variant="secondary" className="py-2 px-4 text-base flex items-center gap-2"><DownloadIcon className="w-5 h-5"/>Invoice</Button>
                    </a>
                    {order.paymentStatus === 'Paid' && order.status !== 'Refunded' && <Button onClick={handleRefund} variant="danger" className="py-2 px-4 text-base">Process Refund</Button>}
                    <Button onClick={onClose} variant="secondary" className="py-2 px-4 text-base">Close</Button>
                </div>
            </div>
        </Modal>
    )
}

const OrderManagement = () => {
    const { orders, users, formatCurrency, updateOrderStatus, refundOrder, deleteOrder } = useAppContext();
    const [filters, setFilters] = useState({
        search: '',
        paymentStatus: 'All',
        orderStatus: 'All',
        currency: 'All',
    });
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;
    
    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => {
                const user = users.find(u => u.id === order.userId);
                const searchLower = filters.search.toLowerCase();
                return order.id.toLowerCase().includes(searchLower) ||
                       order.customerName.toLowerCase().includes(searchLower) ||
                       (user && user.email.toLowerCase().includes(searchLower));
            })
            .filter(order => filters.paymentStatus === 'All' || order.paymentStatus === filters.paymentStatus)
            .filter(order => filters.orderStatus === 'All' || order.status === filters.orderStatus)
            .filter(order => filters.currency === 'All' || order.currency === filters.currency)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [orders, users, filters]);
    
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ordersPerPage;
        return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
    }, [filteredOrders, currentPage]);
    
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalRefunds = filteredOrders.filter(o => o.paymentStatus === 'Refunded').length;
    const pendingOrders = filteredOrders.filter(o => o.status === 'Pending').length;

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setCurrentPage(1);
    };

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsViewModalOpen(true);
    };

    const openDeleteModal = (order: Order) => {
        setOrderToDelete(order);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (orderToDelete) {
            deleteOrder(orderToDelete.id);
        }
        setIsDeleteModalOpen(false);
        setOrderToDelete(null);
    };

    
    const OrderStatusBadge: React.FC<{status: OrderStatus}> = ({ status }) => {
        const colorClasses: {[key: string]: string} = {
            Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            Shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
            Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            Delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            Refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        };
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[status]}`}>{status}</span>;
    };
    
    const PaymentStatusBadge: React.FC<{status: PaymentStatus}> = ({ status }) => {
        const colorClasses: {[key: string]: string} = {
            Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            Failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            Refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        };
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[status]}`}>{status}</span>;
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-playfair font-bold">Order Management</h1>
                <Button onClick={() => setIsManualOrderModalOpen(true)}>➕ Add Manual Order</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6"><h3 className="text-lg text-gray-400">Total Orders</h3><p className="text-3xl font-bold mt-2">{filteredOrders.length}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Total Revenue</h3><p className="text-3xl font-bold mt-2">{formatCurrency(totalRevenue)}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Total Refunds</h3><p className="text-3xl font-bold mt-2">{totalRefunds}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Pending Orders</h3><p className="text-3xl font-bold mt-2">{pendingOrders}</p></Card>
            </div>

            <Card className="p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input name="search" placeholder="Search by Order ID, Name, Email..." value={filters.search} onChange={handleFilterChange} />
                    <Select name="orderStatus" value={filters.orderStatus} onChange={handleFilterChange}>
                        <option value="All">All Order Statuses</option>
                        <option>Pending</option><option>Processing</option><option>Shipped</option><option>Completed</option><option>Delivered</option><option>Cancelled</option><option>Refunded</option>
                    </Select>
                    <Select name="paymentStatus" value={filters.paymentStatus} onChange={handleFilterChange}>
                        <option value="All">All Payment Statuses</option>
                        <option>Paid</option><option>Failed</option><option>Refunded</option>
                    </Select>
                    <Select name="currency" value={filters.currency} onChange={handleFilterChange}>
                        <option value="All">All Currencies</option>
                        <option>INR</option><option>CAD</option>
                    </Select>
                </div>
            </Card>

            <Table headers={['Order ID', 'Customer', 'Date', 'Amount', 'Order Status', 'Payment Status', 'Actions']}>
                {paginatedOrders.map(order => (
                    <tr key={order.id}>
                        <Td>{order.id.substring(0, 8)}...</Td>
                        <Td>{order.customerName}</Td>
                        <Td>{new Date(order.date).toLocaleDateString()}</Td>
                        <Td>{formatCurrency(order.totalAmount)} ({order.currency})</Td>
                        <Td><OrderStatusBadge status={order.status} /></Td>
                        <Td><PaymentStatusBadge status={order.paymentStatus} /></Td>
                        <Td>
                            <div className="flex space-x-3">
                                <button onClick={() => handleViewOrder(order)} className="text-blue-500 hover:text-blue-700">View</button>
                                <button onClick={() => openDeleteModal(order)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </Td>
                    </tr>
                ))}
            </Table>
            
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="py-1 px-3 text-sm">Previous</Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="py-1 px-3 text-sm">Next</Button>
                </div>
            )}
            
            <ManualOrderFormModal isOpen={isManualOrderModalOpen} onClose={() => setIsManualOrderModalOpen(false)} />
            <OrderDetailsModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} order={selectedOrder} onUpdateStatus={updateOrderStatus} onRefund={refundOrder} />
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <p>Are you sure you want to delete this order? This action cannot be undone and will not refund the customer.</p>
                <div className="flex justify-end mt-6 space-x-2">
                    <Button variant="secondary" className="py-2 px-4 text-base" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                    <Button variant="danger" className="py-2 px-4 text-base" onClick={confirmDelete}>Delete</Button>
                </div>
            </Modal>
        </div>
    );
};

const SupportTicketModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    ticket: SupportTicket | null;
    onReply: (ticketId: string, reply: string, status: SupportTicketStatus) => void;
}> = ({ isOpen, onClose, ticket, onReply }) => {
    const [reply, setReply] = useState('');
    const [status, setStatus] = useState<SupportTicketStatus>('Pending');
    
    useEffect(() => {
        if (ticket) {
            setReply(ticket.reply || '');
            setStatus(ticket.status);
        }
    }, [ticket]);

    if (!ticket) return null;
    
    const handleReply = () => {
        onReply(ticket.id, reply, status);
        onClose();
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Support Ticket: ${ticket.id}`}>
             <div className="space-y-4 text-sm">
                <p><strong>From:</strong> {ticket.userName} ({ticket.userEmail})</p>
                <p><strong>Subject:</strong> {ticket.subject}</p>
                <p><strong>Received:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <p><strong>Message:</strong></p>
                    <p>{ticket.message}</p>
                </div>
                <hr className="dark:border-gray-600" />
                <h4 className="text-lg font-semibold">Reply</h4>
                <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={5}
                    placeholder="Type your reply here..."
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                />
                <Select label="Update Status" value={status} onChange={(e) => setStatus(e.target.value as SupportTicketStatus)}>
                    <option>Open</option><option>Pending</option><option>Resolved</option><option>Closed</option>
                </Select>
                 <div className="flex justify-end pt-4 space-x-2">
                    <Button variant="secondary" onClick={onClose} className="py-2 px-4 text-base">Cancel</Button>
                    <Button onClick={handleReply} className="py-2 px-4 text-base">Send Reply & Update</Button>
                </div>
            </div>
        </Modal>
    );
};


const SupportManagement = () => {
    const { supportTickets, updateSupportTicket, deleteSupportTicket } = useAppContext();
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleViewTicket = (ticket: SupportTicket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleReply = async (ticketId: string, reply: string, status: SupportTicketStatus) => {
        await updateSupportTicket(ticketId, { reply, status, updatedAt: new Date().toISOString() });
    };

    const handleDelete = async (ticketId: string) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            await deleteSupportTicket(ticketId);
        }
    };
    
    const openTickets = supportTickets.filter(t => t.status === 'Open').length;
    const resolvedTickets = supportTickets.filter(t => t.status === 'Resolved').length;

    return (
        <div>
            <h1 className="text-3xl font-playfair font-bold mb-8">Support Tickets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6"><h3 className="text-lg text-gray-400">Total Tickets</h3><p className="text-3xl font-bold mt-2">{supportTickets.length}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Open Tickets</h3><p className="text-3xl font-bold mt-2">{openTickets}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Resolved Today</h3><p className="text-3xl font-bold mt-2">{resolvedTickets}</p></Card>
                <Card className="p-6"><h3 className="text-lg text-gray-400">Avg. Response Time</h3><p className="text-3xl font-bold mt-2">~24 hrs</p></Card>
            </div>
            
            <Table headers={['User', 'Subject', 'Status', 'Last Updated', 'Actions']}>
                {supportTickets.map(ticket => (
                     <tr key={ticket.id}>
                        <Td>
                            <div>{ticket.userName}</div>
                            <div className="text-xs text-gray-500">{ticket.userEmail}</div>
                        </Td>
                        <Td>{ticket.subject}</Td>
                        <Td><StatusBadge status={ticket.status} /></Td>
                        <Td>{new Date(ticket.updatedAt).toLocaleString()}</Td>
                        <Td>
                             <div className="flex space-x-3">
                                <button onClick={() => handleViewTicket(ticket)} className="text-blue-500 hover:text-blue-700">View/Reply</button>
                                <button onClick={() => handleDelete(ticket.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </Td>
                    </tr>
                ))}
            </Table>
            <SupportTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} ticket={selectedTicket} onReply={handleReply} />
        </div>
    );
};

const SettingsManagement = () => {
    const { settings, updateSettings } = useAppContext();
    const [formData, setFormData] = useState<Settings>(settings);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    
    const handleGatewayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const [gateway, field] = name.split('.');
        
        setFormData(prev => ({
            ...prev,
            paymentGateways: {
                ...prev.paymentGateways,
                [gateway]: {
                    // @ts-ignore
                    ...prev.paymentGateways[gateway],
                    [field]: type === 'checkbox' ? checked : value
                }
            }
        }));
    };
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateSettings(formData);
            alert("✅ Settings updated successfully!");
        } catch (error) {
            alert("❌ Failed to update settings.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            <h1 className="text-3xl font-playfair font-bold mb-8">Site Settings</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                            <div className="space-y-4">
                                <Input label="Site Name" name="siteName" value={formData.siteName} onChange={handleChange} />
                                <Input label="Logo URL" name="logoUrl" value={formData.logoUrl} onChange={handleChange} />
                                <Input label="Footer Text" name="footerText" value={formData.footerText} onChange={handleChange} />
                            </div>
                        </Card>
                        <Card className="p-6 mt-8">
                             <h2 className="text-xl font-semibold mb-4">Financial Settings</h2>
                             <div className="grid grid-cols-2 gap-4">
                                <Select label="Currency" name="currency" value={formData.currency} onChange={(e) => setFormData(p => ({...p, currency: e.target.value as any}))}>
                                    <option value="INR">INR (₹)</option>
                                    <option value="CAD">CAD ($)</option>
                                </Select>
                                <Input label="Tax Rate (%)" name="taxRate" type="number" value={formData.taxRate} onChange={handleChange} />
                             </div>
                        </Card>
                    </div>
                    <div>
                         <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Payment Gateways</h2>
                            <div className="space-y-6">
                                {/* Razorpay */}
                                <div className="p-4 border rounded-md dark:border-gray-600">
                                    <label className="flex items-center justify-between font-semibold">
                                        <span>Razorpay</span>
                                        <input type="checkbox" name="razorpay.enabled" checked={formData.paymentGateways.razorpay.enabled} onChange={handleGatewayChange} className="h-5 w-5 rounded text-brand-gold focus:ring-brand-gold"/>
                                    </label>
                                    <Input label="API Key" name="razorpay.apiKey" value={formData.paymentGateways.razorpay.apiKey} onChange={handleGatewayChange} className="mt-2" />
                                </div>
                                 {/* Stripe */}
                                <div className="p-4 border rounded-md dark:border-gray-600">
                                    <label className="flex items-center justify-between font-semibold">
                                        <span>Stripe</span>
                                        <input type="checkbox" name="stripe.enabled" checked={formData.paymentGateways.stripe.enabled} onChange={handleGatewayChange} className="h-5 w-5 rounded text-brand-gold focus:ring-brand-gold"/>
                                    </label>
                                    <Input label="API Key" name="stripe.apiKey" value={formData.paymentGateways.stripe.apiKey} onChange={handleGatewayChange} className="mt-2" />
                                </div>
                                  {/* Interac */}
                                <div className="p-4 border rounded-md dark:border-gray-600">
                                    <label className="flex items-center justify-between font-semibold">
                                        <span>Interac e-Transfer</span>
                                        <input type="checkbox" name="interac.enabled" checked={formData.paymentGateways.interac.enabled} onChange={handleGatewayChange} className="h-5 w-5 rounded text-brand-gold focus:ring-brand-gold"/>
                                    </label>
                                    <textarea name="interac.instructions" value={formData.paymentGateways.interac.instructions} onChange={(e) => {
                                        const { name, value } = e.target;
                                        const [gateway, field] = name.split('.');
                                        setFormData(prev => ({...prev, paymentGateways: {...prev.paymentGateways, [gateway]: {...prev.paymentGateways.interac, [field]: value}}}));
                                    }} className="w-full mt-2 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" rows={3}></textarea>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                 <div className="mt-8 flex justify-end">
                    <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                        {isLoading && <SpinnerIcon className="w-5 h-5 animate-spin" />}
                        {isLoading ? 'Saving...' : 'Save Settings'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

const BackupManagement = () => {
    const { backups, createBackup, restoreBackup, deleteBackup } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateBackup = async () => {
        setIsLoading(true);
        try {
            await createBackup();
            alert("✅ Backup created successfully!");
        } catch (error) {
            alert("❌ Failed to create backup.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-playfair font-bold">Backup & Restore</h1>
                <Button onClick={handleCreateBackup} disabled={isLoading} className="flex items-center gap-2">
                    {isLoading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : <BackupIcon className="w-5 h-5" />}
                    {isLoading ? 'Creating...' : 'Create New Backup'}
                </Button>
            </div>
            
            <Card className="p-6">
                <p className="text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-md mb-6">
                    <strong>⚠️ Warning:</strong> Restoring from a backup will overwrite all current data, including products, orders, and users. This action is irreversible. Proceed with extreme caution.
                </p>
                <Table headers={['Backup ID', 'Date Created', 'File Size', 'Actions']}>
                    {backups.map(backup => (
                         <tr key={backup.id}>
                            <Td>{backup.id}</Td>
                            <Td>{new Date(backup.createdAt).toLocaleString()}</Td>
                            <Td>{(backup.size / 1024).toFixed(2)} KB</Td>
                            <Td>
                                <div className="flex space-x-3">
                                    {/* FIX: Use import.meta.env for Vite and cast to any to avoid TS error */}
                                    <a href={`${(import.meta as any).env.VITE_API_URL}/api/backups/${backup.id}/download`} download={backup.fileName}>
                                        <button className="text-green-500 hover:text-green-700 flex items-center gap-1"><DownloadIcon className="w-5 h-5"/> Download</button>
                                    </a>
                                    <button onClick={() => restoreBackup(backup.id)} className="text-blue-500 hover:text-blue-700 flex items-center gap-1"><RestoreIcon className="w-5 h-5"/> Restore</button>
                                    <button onClick={() => deleteBackup(backup.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            </Td>
                        </tr>
                    ))}
                </Table>
            </Card>
        </div>
    );
};

const AdminPrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { admin } = useAppContext();
    const location = useLocation();
    
    if (!admin) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    
    return children;
};


export const AdminPages = () => {
    const { admin } = useAppContext();
    const location = useLocation();
    
    if (admin && (location.pathname === '/admin/login' || location.pathname === '/admin')) {
        return <Navigate to="/admin/dashboard" replace />;
    }
    
    return (
        <Routes>
            <Route path="login" element={<AdminLogin />} />
            <Route path="/*" element={
                <AdminPrivateRoute>
                    <AdminLayout>
                        <Routes>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="products" element={<ProductManagement />} />
                            <Route path="orders" element={<OrderManagement />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="coupons" element={<CouponManagement />} />
                            <Route path="reports" element={<ReportManagement />} />
                            <Route path="support" element={<SupportManagement />} />
                            <Route path="settings" element={<SettingsManagement />} />
                            <Route path="backup" element={<BackupManagement />} />
                            <Route index element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </AdminLayout>
                </AdminPrivateRoute>
            } />
        </Routes>
    );
};