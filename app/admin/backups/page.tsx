"use client";

import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Td } from '@/components/UI';

interface BackupLog {
    id: number;
    type: string;
    fileName: string;
    fileSize: number;
    status: string;
    errorMessage: string | null;
    createdAt: string;
}

export default function AdminBackupsPage() {
    const [backups, setBackups] = useState<BackupLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [backupType, setBackupType] = useState<string | null>(null);

    useEffect(() => {
        fetchBackups();
    }, []);

    const fetchBackups = async () => {
        try {
            const response = await fetch('/api/backups');
            const data = await response.json();
            setBackups(data.backups || []);
        } catch (error) {
            console.error('Error fetching backups:', error);
            setBackups([]);
        } finally {
            setLoading(false);
        }
    };

    const createBackup = async (type: string) => {
        setCreating(true);
        setBackupType(type);

        try {
            const response = await fetch('/api/backups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type }),
            });

            if (response.ok) {
                // Get the backup file data
                const blob = await response.blob();
                const fileName = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `backup_${type}_${Date.now()}.json`;

                // Trigger download
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                alert('Backup created and downloaded successfully!');
                fetchBackups(); // Refresh the list
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error creating backup:', error);
            alert('Failed to create backup. Please try again.');
        } finally {
            setCreating(false);
            setBackupType(null);
        }
    };

    const deleteBackupLog = async (id: number) => {
        if (!confirm('Delete this backup log? This will only remove the log entry, not any downloaded files.')) return;

        try {
            const response = await fetch(`/api/backups?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchBackups();
            } else {
                alert('Failed to delete backup log');
            }
        } catch (error) {
            console.error('Error deleting backup log:', error);
            alert('Error deleting backup log');
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getBackupTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            full: 'Full Database',
            products: 'Products Only',
            users: 'Users Only',
            orders: 'Orders Only',
            coupons: 'Coupons Only',
        };
        return labels[type] || type;
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
                    Database Backups
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Create and manage database backups for data protection
                </p>
            </div>

            {/* Backup Actions */}
            <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Create New Backup
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Button
                        onClick={() => createBackup('full')}
                        disabled={creating}
                        className="w-full"
                    >
                        {creating && backupType === 'full' ? 'Creating...' : 'Full Backup'}
                    </Button>
                    <Button
                        onClick={() => createBackup('products')}
                        disabled={creating}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        {creating && backupType === 'products' ? 'Creating...' : 'Products'}
                    </Button>
                    <Button
                        onClick={() => createBackup('users')}
                        disabled={creating}
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        {creating && backupType === 'users' ? 'Creating...' : 'Users'}
                    </Button>
                    <Button
                        onClick={() => createBackup('orders')}
                        disabled={creating}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                        {creating && backupType === 'orders' ? 'Creating...' : 'Orders'}
                    </Button>
                    <Button
                        onClick={() => createBackup('coupons')}
                        disabled={creating}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                        {creating && backupType === 'coupons' ? 'Creating...' : 'Coupons'}
                    </Button>
                </div>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                        <strong>Note:</strong> Backups are exported as JSON files and automatically downloaded.
                        Store them securely for disaster recovery. The full backup includes all main data tables.
                    </p>
                </div>
            </Card>

            {/* Backup History */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Backup History
                    </h2>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-600 dark:text-gray-400">
                        Loading backup history...
                    </div>
                ) : backups.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="mb-6">
                            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            No backups yet
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Create your first backup using the buttons above
                        </p>
                    </div>
                ) : (
                    <Table headers={['Type', 'File Name', 'Size', 'Status', 'Created', 'Actions']}>
                        {backups.map(backup => (
                            <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Td>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {getBackupTypeLabel(backup.type)}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                                        {backup.fileName}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {formatFileSize(backup.fileSize)}
                                    </span>
                                </Td>
                                <Td>
                                    {backup.status === 'success' ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            Success
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                            Failed
                                        </span>
                                    )}
                                    {backup.errorMessage && (
                                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                            {backup.errorMessage}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(backup.createdAt)}
                                    </span>
                                </Td>
                                <Td>
                                    <button
                                        onClick={() => deleteBackupLog(backup.id)}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 font-medium text-sm"
                                    >
                                        Delete Log
                                    </button>
                                </Td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>

            {/* Info Section */}
            <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    About Backups
                </h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                        <strong className="text-gray-900 dark:text-white">Full Backup:</strong> Exports all main data including products, users, orders, coupons, settings, and messages.
                    </div>
                    <div>
                        <strong className="text-gray-900 dark:text-white">Selective Backups:</strong> Export specific data types for targeted data management.
                    </div>
                    <div>
                        <strong className="text-gray-900 dark:text-white">Format:</strong> All backups are exported as JSON files for easy restoration and portability.
                    </div>
                    <div>
                        <strong className="text-gray-900 dark:text-white">Security:</strong> Passwords and sensitive keys are excluded from user backups.
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <strong className="text-gray-900 dark:text-white">⚠️ Important:</strong> Store downloaded backups securely. The backup log only tracks backup history; actual files must be saved by you.
                    </div>
                </div>
            </Card>
        </div>
    );
}
