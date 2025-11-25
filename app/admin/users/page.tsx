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
            const response = await fetch('/api/admin/users');
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
            const response = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
                        Users
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage customer accounts ({users.length} total)
                    </p>
                </div>
            </div>

            {loading ? (
                <Card className="p-12">
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        Loading users...
                    </div>
                </Card>
            ) : users.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center">
                        <div className="mb-6">
                            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            No users yet
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Users will appear here when they create accounts
                        </p>
                    </div>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <Table headers={['User', 'Email', 'Status', 'Verified', 'Joined', 'Actions']}>
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Td>
                                    <div className="font-semibold text-gray-900 dark:text-white">
                                        {user.name}
                                    </div>
                                </Td>
                                <Td>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {user.email}
                                    </span>
                                </Td>
                                <Td>
                                    <button onClick={() => toggleStatus(user)}>
                                        <StatusBadge status={user.status} />
                                    </button>
                                </Td>
                                <Td>
                                    <div className="flex items-center">
                                        {user.emailVerified ? (
                                            <span className="flex items-center text-green-600 dark:text-green-400">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-gray-400 dark:text-gray-500">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                Unverified
                                            </span>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(user.createdAt)}
                                    </span>
                                </Td>
                                <Td>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => alert('User details view coming soon')}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium text-sm"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </Td>
                            </tr>
                        ))}
                    </Table>
                </Card>
            )}
        </div>
    );
}
