import { put, del } from '@vercel/blob';

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

export async function uploadProductImage(file: File): Promise<string> {
    return uploadFile(file, 'products/images');
}

export async function uploadDigitalProduct(file: File): Promise<string> {
    return uploadFile(file, 'products/digital');
}

export async function deleteFile(url: string): Promise<void> {
    try {
        await del(url, {
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
    } catch (error) {
        console.error('File deletion error:', error);
        throw new Error('Failed to delete file');
    }
}

export function generateSecureDownloadUrl(fileUrl: string, orderId: number, expiryHours: number = 24): string {
    // Create a time-limited download link
    const expiryTimestamp = Date.now() + (expiryHours * 60 * 60 * 1000);
    const encodedUrl = encodeURIComponent(fileUrl);

    return `/api/orders/${orderId}/download?file=${encodedUrl}&expires=${expiryTimestamp}`;
}
