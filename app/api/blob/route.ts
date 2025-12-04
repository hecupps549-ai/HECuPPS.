import { list, del } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/rbac';

const handleListBlobs = async (request: NextRequest): Promise<NextResponse> => {
    try {
        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder') || undefined;
        const limit = parseInt(searchParams.get('limit') || '100');

        const { blobs } = await list({
            token: process.env.BLOB_READ_WRITE_TOKEN,
            limit: limit,
            prefix: folder,
        });

        // Organize blobs by folder
        const organizedBlobs = blobs.map(blob => ({
            url: blob.url,
            pathname: blob.pathname,
            size: blob.size,
            uploadedAt: blob.uploadedAt,
            downloadUrl: blob.downloadUrl,
        }));

        return NextResponse.json({
            blobs: organizedBlobs,
            count: organizedBlobs.length,
            folder: folder || 'all',
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error("❌ Failed to list blobs:", errorMessage);

        return NextResponse.json({
            message: 'Failed to retrieve files',
            error: errorMessage
        }, { status: 500 });
    }
}

const handleDeleteBlob = async (request: NextRequest): Promise<NextResponse> => {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get('url');

        if (!url) {
            return NextResponse.json({
                message: 'No URL provided for deletion',
                error: 'URL_MISSING'
            }, { status: 400 });
        }

        await del(url, {
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        console.log(`✅ File deleted successfully: ${url}`);

        return NextResponse.json({
            message: 'File deleted successfully',
            url: url
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error("❌ Failed to delete blob:", errorMessage);

        return NextResponse.json({
            message: 'Failed to delete file',
            error: errorMessage
        }, { status: 500 });
    }
}

export const GET = withAdminAuth(['SUPER_ADMIN', 'PRODUCT_MANAGER'], handleListBlobs);
export const DELETE = withAdminAuth(['SUPER_ADMIN', 'PRODUCT_MANAGER'], handleDeleteBlob);
