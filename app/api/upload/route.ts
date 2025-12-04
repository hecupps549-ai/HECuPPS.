import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/rbac';

// File type configurations
const ALLOWED_FILE_TYPES = {
    images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    videos: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    documents: ['application/pdf', 'application/zip', 'application/x-zip-compressed'],
};

// Maximum file sizes (in bytes)
const MAX_FILE_SIZES = {
    images: 10 * 1024 * 1024,      // 10MB for images
    videos: 100 * 1024 * 1024,     // 100MB for videos
    documents: 50 * 1024 * 1024,   // 50MB for documents
};

// Folder structure for organized storage
const UPLOAD_FOLDERS = {
    images: 'products/images',
    videos: 'products/videos',
    documents: 'products/digital',
    other: 'uploads',
};

function validateFileType(file: File, folder?: string): { valid: boolean; category?: string; error?: string } {
    const fileType = file.type;

    // Determine category based on folder or file type
    let category: keyof typeof ALLOWED_FILE_TYPES | 'other' = 'other';

    if (folder?.includes('image')) {
        category = 'images';
    } else if (folder?.includes('video')) {
        category = 'videos';
    } else if (folder?.includes('digital') || folder?.includes('document')) {
        category = 'documents';
    } else {
        // Auto-detect from MIME type
        if (ALLOWED_FILE_TYPES.images.includes(fileType)) category = 'images';
        else if (ALLOWED_FILE_TYPES.videos.includes(fileType)) category = 'videos';
        else if (ALLOWED_FILE_TYPES.documents.includes(fileType)) category = 'documents';
    }

    if (category !== 'other') {
        const allowedTypes = ALLOWED_FILE_TYPES[category];
        if (!allowedTypes.includes(fileType)) {
            return {
                valid: false,
                error: `Invalid file type for ${category}. Allowed types: ${allowedTypes.join(', ')}`
            };
        }
    }

    return { valid: true, category };
}

function validateFileSize(file: File, category: string): { valid: boolean; error?: string } {
    const maxSize = MAX_FILE_SIZES[category as keyof typeof MAX_FILE_SIZES] || MAX_FILE_SIZES.documents;

    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        return {
            valid: false,
            error: `File size exceeds maximum allowed size of ${maxSizeMB}MB for ${category}`
        };
    }

    return { valid: true };
}

function generateFileName(originalName: string, folder: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${folder}/${timestamp}-${randomString}-${sanitizedName}`;
}

const handleUpload = async (request: NextRequest): Promise<NextResponse> => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const folderParam = formData.get('folder') as string | null;

        if (!file) {
            return NextResponse.json({
                message: 'No file found in the request',
                error: 'FILE_MISSING'
            }, { status: 400 });
        }

        // Validate file type
        const typeValidation = validateFileType(file, folderParam || undefined);
        if (!typeValidation.valid) {
            return NextResponse.json({
                message: typeValidation.error || 'Invalid file type',
                error: 'INVALID_FILE_TYPE'
            }, { status: 400 });
        }

        const category = typeValidation.category || 'other';

        // Validate file size
        const sizeValidation = validateFileSize(file, category);
        if (!sizeValidation.valid) {
            return NextResponse.json({
                message: sizeValidation.error || 'File size too large',
                error: 'FILE_TOO_LARGE'
            }, { status: 400 });
        }

        // Determine upload folder
        const uploadFolder = folderParam || UPLOAD_FOLDERS[category as keyof typeof UPLOAD_FOLDERS] || UPLOAD_FOLDERS.other;
        const fileName = generateFileName(file.name, uploadFolder);

        // Upload to Vercel Blob
        const blob = await put(fileName, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        console.log(`✅ File uploaded successfully: ${blob.url}`);

        // Return the URL and metadata
        return NextResponse.json({
            url: blob.url,
            fileName: file.name,
            size: file.size,
            type: file.type,
            category: category,
            uploadedAt: new Date().toISOString()
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error("❌ Upload failed:", errorMessage);

        // Check for specific Vercel Blob errors
        if (errorMessage.includes('token')) {
            return NextResponse.json({
                message: 'Storage configuration error. Please check BLOB_READ_WRITE_TOKEN.',
                error: 'STORAGE_CONFIG_ERROR'
            }, { status: 500 });
        }

        return NextResponse.json({
            message: 'File upload failed',
            error: errorMessage
        }, { status: 500 });
    }
}

export const POST = withAdminAuth(['SUPER_ADMIN', 'PRODUCT_MANAGER'], handleUpload);
