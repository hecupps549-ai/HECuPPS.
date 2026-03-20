"use client";

import React, { useEffect, useState } from 'react';
import { Card, Table, Td, StatusBadge } from '@/components/UI';

interface User {
    id: number;
    name: string;
    email: string;
    status: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (user: User) => {
        const newStatus = user.status === 'Active' ? 'Blocked' : 'Active';

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                fetchUsers();
            } else {
                alert('Failed to update user status');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user status');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div>
            <div className="mb-8 pb-4 border-b border-brand-border">
                <h1 className="text-2xl font-outfit font-bold text-brand-black uppercase tracking-tight">
                    Users
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage customer accounts ({users.length} total)
                </p>
            </div>

            {loading ? (
                <div className="p-12 text-center text-sm text-gray-400 uppercase tracking-widest border border-brand-border bg-white">
                    Loading users...
                </div>
            ) : users.length === 0 ? (
                <div className="p-16 text-center border border-brand-border bg-white">
                    <div className="mb-6">
                        <span className="text-5xl text-gray-300">👥</span>
                    </div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-2">
                        No users yet
                    </h2>
                    <p className="text-sm text-gray-500">
                        Users will appear here when they create accounts
                    </p>
                </div>
            ) : (
                <div className="border border-brand-border bg-white overflow-hidden">
                    <Table headers={['User', 'Email', 'Status', 'Verified', 'Joined', 'Actions']}>
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-brand-light transition-colors border-b border-brand-border last:border-0">
                                <Td>
                                    <div className="text-sm font-semibold text-brand-black">
                                        {user.name}
                                    </div>
                                </Td>
                                <Td>
                                    <span className="text-sm text-gray-600">
                                        {user.email}
                                    </span>
                                </Td>
                                <Td>
                                    <button onClick={() => toggleStatus(user)}>
                                        <StatusBadge status={user.status} />
                                    </button>
                                </Td>
                                <Td>
                                    <div className="flex items-center text-xs font-semibold uppercase tracking-wider">
                                        {user.emailVerified ? (
                                            <span className="text-brand-black">VERIFIED</span>
                                        ) : (
                                            <span className="text-gray-400">UNVERIFIED</span>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    <span className="text-sm text-gray-600">
                                        {formatDate(user.createdAt)}
                                    </span>
                                </Td>
                                <Td>
                                    <button
                                        onClick={() => alert('User details view coming soon')}
                                        className="text-xs font-bold uppercase tracking-widest text-brand-black hover:text-brand-accent transition-colors"
                                    >
                                        Details
                                    </button>
                                </Td>
                            </tr>
                        ))}
                    </Table>
                </div>
            )}
        </div>
    );
}
