"use client";

import React, { useEffect, useState } from 'react';
import { Card, Table, Td, StatusBadge } from '@/components/UI';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    status: string;
    createdAt: string;
}

export default function AdminSupportPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch('/api/contact');
            const data = await response.json();
            setMessages(data.messages || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (message: ContactMessage) => {
        if (message.status === 'READ') return;

        try {
            const response = await fetch(`/api/contact/${message.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'READ' }),
            });

            if (response.ok) {
                fetchMessages();
            }
        } catch (error) {
            console.error('Error updating message:', error);
        }
    };

    const handleViewMessage = (message: ContactMessage) => {
        setSelectedMessage(message);
        markAsRead(message);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const response = await fetch(`/api/contact/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Message deleted successfully');
                fetchMessages();
                if (selectedMessage?.id === id) {
                    setSelectedMessage(null);
                }
            } else {
                alert('Failed to delete message');
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Error deleting message');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const newMessagesCount = messages.filter(m => m.status === 'NEW').length;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
                        Support Messages
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Messages from contact form ({messages.length} total, {newMessagesCount} new)
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Messages List */}
                <div className="lg:col-span-2">
                    {loading ? (
                        <Card className="p-12">
                            <div className="text-center text-gray-600 dark:text-gray-400">
                                Loading messages...
                            </div>
                        </Card>
                    ) : messages.length === 0 ? (
                        <Card className="p-12">
                            <div className="text-center">
                                <div className="mb-6">
                                    <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No messages yet
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Contact form submissions will appear here
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <Card className="overflow-hidden">
                            <Table headers={['From', 'Email', 'Status', 'Date', 'Actions']}>
                                {messages.map(message => (
                                    <tr
                                        key={message.id}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${message.status === 'NEW' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                        onClick={() => handleViewMessage(message)}
                                    >
                                        <Td>
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {message.name}
                                            </div>
                                            {message.phone && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {message.phone}
                                                </div>
                                            )}
                                        </Td>
                                        <Td>
                                            <a
                                                href={`mailto:${message.email}`}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {message.email}
                                            </a>
                                        </Td>
                                        <Td>
                                            <StatusBadge status={message.status} />
                                        </Td>
                                        <Td>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(message.createdAt)}
                                            </span>
                                        </Td>
                                        <Td>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(message.id);
                                                }}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 font-medium text-sm"
                                            >
                                                Delete
                                            </button>
                                        </Td>
                                    </tr>
                                ))}
                            </Table>
                        </Card>
                    )}
                </div>

                {/* Message Detail Panel */}
                <div className="lg:col-span-1">
                    <Card className="p-6">
                        {selectedMessage ? (
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Message Details
                                    </h2>
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">From</label>
                                        <p className="text-gray-900 dark:text-white">{selectedMessage.name}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
                                        <p>
                                            <a
                                                href={`mailto:${selectedMessage.email}`}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                            >
                                                {selectedMessage.email}
                                            </a>
                                        </p>
                                    </div>

                                    {selectedMessage.phone && (
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</label>
                                            <p className="text-gray-900 dark:text-white">{selectedMessage.phone}</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Received</label>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            {formatDate(selectedMessage.createdAt)}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</label>
                                        <div className="mt-1">
                                            <StatusBadge status={selectedMessage.status} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Message</label>
                                        <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                                {selectedMessage.message}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <a
                                            href={`mailto:${selectedMessage.email}?subject=Re: Your message to HECuPPS`}
                                            className="block w-full text-center px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-opacity-90 transition-all"
                                        >
                                            Reply via Email
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                                <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <p>Select a message to view details</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
