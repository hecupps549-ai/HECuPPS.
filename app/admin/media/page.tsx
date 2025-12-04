'use client';

import { useEffect, useState } from 'react';
import { Trash2, Upload, Image, Video, File, FolderOpen, RefreshCw } from 'lucide-react';

interface BlobFile {
    url: string;
    pathname: string;
    size: number;
    uploadedAt: Date;
    downloadUrl: string;
}

export default function MediaManagementPage() {
    const [files, setFiles] = useState<BlobFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<string>('all');
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

    const folders = [
        { value: 'all', label: 'All Files', icon: FolderOpen },
        { value: 'products/images', label: 'Product Images', icon: Image },
        { value: 'products/videos', label: 'Product Videos', icon: Video },
        { value: 'products/digital', label: 'Digital Products', icon: File },
    ];

    useEffect(() => {
        loadFiles();
    }, [selectedFolder]);

    const loadFiles = async () => {
        setLoading(true);
        try {
            const folder = selectedFolder === 'all' ? '' : selectedFolder;
            const response = await fetch(`/api/blob?folder=${encodeURIComponent(folder)}`);
            const data = await response.json();

            if (response.ok) {
                setFiles(data.blobs || []);
            } else {
                alert('Failed to load files: ' + data.message);
            }
        } catch (error) {
            console.error('Error loading files:', error);
            alert('Failed to load files');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.target.files;
        if (!uploadedFiles || uploadedFiles.length === 0) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            const totalFiles = uploadedFiles.length;
            let completed = 0;

            for (const file of Array.from(uploadedFiles)) {
                const formData = new FormData();
                formData.append('file', file);

                if (selectedFolder !== 'all') {
                    formData.append('folder', selectedFolder);
                }

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Upload failed');
                }

                completed++;
                setUploadProgress(Math.round((completed / totalFiles) * 100));
            }

            alert(`Successfully uploaded ${totalFiles} file(s)`);
            loadFiles();
            event.target.value = ''; // Reset input
        } catch (error) {
            console.error('Upload error:', error);
            alert(error instanceof Error ? error.message : 'Failed to upload files');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (url: string) => {
        if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/blob?url=${encodeURIComponent(url)}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('File deleted successfully');
                loadFiles();
            } else {
                const error = await response.json();
                alert('Failed to delete file: ' + error.message);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete file');
        }
    };

    const handleBatchDelete = async () => {
        if (selectedFiles.size === 0) {
            alert('No files selected');
            return;
        }

        if (!confirm(`Are you sure you want to delete ${selectedFiles.size} file(s)? This action cannot be undone.`)) {
            return;
        }

        try {
            for (const url of Array.from(selectedFiles)) {
                await fetch(`/api/blob?url=${encodeURIComponent(url)}`, {
                    method: 'DELETE',
                });
            }

            alert(`Successfully deleted ${selectedFiles.size} file(s)`);
            setSelectedFiles(new Set());
            loadFiles();
        } catch (error) {
            console.error('Batch delete error:', error);
            alert('Failed to delete some files');
        }
    };

    const toggleFileSelection = (url: string) => {
        const newSelection = new Set(selectedFiles);
        if (newSelection.has(url)) {
            newSelection.delete(url);
        } else {
            newSelection.add(url);
        }
        setSelectedFiles(newSelection);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFileIcon = (pathname: string) => {
        if (pathname.includes('/images/')) return <Image className="w-5 h-5 text-blue-500" />;
        if (pathname.includes('/videos/')) return <Video className="w-5 h-5 text-purple-500" />;
        return <File className="w-5 h-5 text-gray-500" />;
    };

    const filteredFiles = files.filter(file =>
        file.pathname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Management</h1>
                    <p className="text-gray-600">Manage your uploaded files and media assets</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Files</p>
                                <p className="text-2xl font-bold text-gray-900">{files.length}</p>
                            </div>
                            <FolderOpen className="w-10 h-10 text-brand-gold opacity-50" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Storage Used</p>
                                <p className="text-2xl font-bold text-gray-900">{formatFileSize(totalSize)}</p>
                            </div>
                            <Upload className="w-10 h-10 text-brand-gold opacity-50" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Selected</p>
                                <p className="text-2xl font-bold text-gray-900">{selectedFiles.size}</p>
                            </div>
                            <Trash2 className="w-10 h-10 text-red-500 opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Folder Filter */}
                        <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Folder</label>
                            <select
                                value={selectedFolder}
                                onChange={(e) => setSelectedFolder(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                            >
                                {folders.map(folder => (
                                    <option key={folder.value} value={folder.value}>
                                        {folder.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search */}
                        <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Search Files</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by filename..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 items-end">
                            <button
                                onClick={loadFiles}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>

                            <label className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors cursor-pointer flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                {uploading ? `Uploading ${uploadProgress}%` : 'Upload Files'}
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    className="hidden"
                                    accept="image/*,video/*,.pdf,.zip"
                                />
                            </label>

                            {selectedFiles.size > 0 && (
                                <button
                                    onClick={handleBatchDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete ({selectedFiles.size})
                                </button>
                            )}
                        </div>
                    </div>

                    {uploading && (
                        <div className="mt-4">
                            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-brand-gold h-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Files Grid */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="w-8 h-8 text-brand-gold animate-spin" />
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="text-center py-12">
                            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No files found</p>
                            <p className="text-sm text-gray-400 mt-1">Upload some files to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedFiles.size === filteredFiles.length && filteredFiles.length > 0}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedFiles(new Set(filteredFiles.map(f => f.url)));
                                                    } else {
                                                        setSelectedFiles(new Set());
                                                    }
                                                }}
                                                className="rounded border-gray-300"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Preview
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            File Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Size
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Uploaded
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredFiles.map((file) => (
                                        <tr key={file.url} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFiles.has(file.url)}
                                                    onChange={() => toggleFileSelection(file.url)}
                                                    className="rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                    {file.pathname.includes('/images/') ? (
                                                        <img src={file.url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        getFileIcon(file.pathname)
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                        {file.pathname.split('/').pop()}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate max-w-xs">
                                                        {file.pathname}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatFileSize(file.size)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(file.uploadedAt)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <a
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-brand-gold hover:text-brand-gold-dark text-sm font-medium"
                                                    >
                                                        View
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(file.url)}
                                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
