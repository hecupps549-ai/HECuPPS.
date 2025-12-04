import { put, del, list, head } from '@vercel/blob';

/**
 * Upload a file to Vercel Blob storage
 * @param file - The file to upload
 * @param folder - The folder path to organize the file (default: 'uploads')
 * @returns The URL of the uploaded file
 */
export async function uploadFile(file: File, folder: string = 'uploads'): Promise<string> {
    try {
        const filename = `${folder}/${Date.now()}-${file.name}`;
        const blob = await put(filename, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return blob.url;
    } catch (error) {
        console.error('File upload error:', error);
        throw new Error('Failed to upload file');
    }
}

/**
 * Upload a product image to organized storage
 */
export async function uploadProductImage(file: File): Promise<string> {
    return uploadFile(file, 'products/images');
}

/**
 * Upload a product video to organized storage
 */
export async function uploadProductVideo(file: File): Promise<string> {
    return uploadFile(file, 'products/videos');
}

/**
 * Upload a digital product (PDF, ZIP, etc.)
 */
export async function uploadDigitalProduct(file: File): Promise<string> {
    return uploadFile(file, 'products/digital');
}

/**
 * Delete a file from Vercel Blob storage
 * @param url - The URL of the file to delete
 */
export async function deleteFile(url: string): Promise<void> {
    try {
        await del(url, {
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        console.log(`✅ File deleted: ${url}`);
    } catch (error) {
        console.error('File deletion error:', error);
        throw new Error('Failed to delete file');
    }
}

/**
 * List all blobs in a specific folder or all blobs
 * @param folder - Optional folder prefix to filter blobs
 * @param limit - Maximum number of blobs to return (default: 1000)
 * @returns Array of blob objects with metadata
 */
export async function listBlobs(folder?: string, limit: number = 1000) {
    try {
        const { blobs } = await list({
            token: process.env.BLOB_READ_WRITE_TOKEN,
            limit: limit,
            prefix: folder,
        });

        return blobs.map(blob => ({
            url: blob.url,
            pathname: blob.pathname,
            size: blob.size,
            uploadedAt: blob.uploadedAt,
            downloadUrl: blob.downloadUrl,
        }));
    } catch (error) {
        console.error('Failed to list blobs:', error);
        throw new Error('Failed to list files');
    }
}

/**
 * Get metadata for a specific blob
 * @param url - The URL of the blob
 * @returns Blob metadata including size, content type, and upload date
 */
export async function getFileMetadata(url: string) {
    try {
        const metadata = await head(url, {
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return {
            url: metadata.url,
            pathname: metadata.pathname,
            size: metadata.size,
            uploadedAt: metadata.uploadedAt,
            contentType: metadata.contentType,
            cacheControl: metadata.cacheControl,
        };
    } catch (error) {
        console.error('Failed to get file metadata:', error);
        throw new Error('Failed to retrieve file metadata');
    }
}

/**
 * Copy a blob to a new location
 * @param sourceUrl - URL of the source blob
 * @param destinationPath - New path for the copied blob
 * @returns URL of the copied blob
 */
export async function copyBlob(sourceUrl: string, destinationPath: string): Promise<string> {
    try {
        // Fetch the source blob
        const response = await fetch(sourceUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch source file');
        }

        const blob = await response.blob();

        // Upload to new location
        const newBlob = await put(destinationPath, blob, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return newBlob.url;
    } catch (error) {
        console.error('Failed to copy blob:', error);
        throw new Error('Failed to copy file');
    }
}

/**
 * Generate a secure, time-limited download URL for digital products
 * @param fileUrl - The URL of the file
 * @param orderId - The order ID for tracking
 * @param expiryHours - Number of hours until the link expires (default: 24)
 * @returns A time-limited download URL
 */
export function generateSecureDownloadUrl(fileUrl: string, orderId: number, expiryHours: number = 24): string {
    const expiryTimestamp = Date.now() + (expiryHours * 60 * 60 * 1000);
    const encodedUrl = encodeURIComponent(fileUrl);

    return `/api/orders/${orderId}/download?file=${encodedUrl}&expires=${expiryTimestamp}`;
}

/**
 * Validate file size and type
 * @param file - The file to validate
 * @param maxSize - Maximum file size in bytes
 * @param allowedTypes - Array of allowed MIME types
 * @returns Validation result
 */
export function validateFile(
    file: File,
    maxSize: number,
    allowedTypes: string[]
): { valid: boolean; error?: string } {
    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        return {
            valid: false,
            error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`
        };
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
        };
    }

    return { valid: true };
}

