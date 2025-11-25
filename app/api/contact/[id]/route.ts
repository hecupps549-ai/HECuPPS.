import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PATCH update message status
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();
        const { status } = body;

        const message = await prisma.contactMessage.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json({ message });
    } catch (error) {
        console.error('Error updating message:', error);
        return NextResponse.json(
            { error: 'Failed to update message' },
            { status: 500 }
        );
    }
}

// DELETE message
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        await prisma.contactMessage.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json(
            { error: 'Failed to delete message' },
            { status: 500 }
        );
    }
}
