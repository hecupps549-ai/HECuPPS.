import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/rbac';

const handleUpload = async (request: NextRequest): Promise<NextResponse> => {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
        return NextResponse.json({ message: 'No file found in the request' }, { status: 400 });
    }

    try {
        const blob = await put(file.name, file, {
            access: 'public',
        });

        // Return the URL of the uploaded file
        return NextResponse.json({ url: blob.url });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error("Upload failed:", errorMessage);
        return NextResponse.json({ message: 'File upload failed', error: errorMessage }, { status: 500 });
    }
}

export const POST = withAdminAuth(['SUPER_ADMIN', 'PRODUCT_MANAGER'], handleUpload);
