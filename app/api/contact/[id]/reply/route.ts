import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendSupportReply } from '@/lib/email-service';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const { message } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Reply message is required' },
                { status: 400 }
            );
        }

        // Fetch original message
        const contactMessage = await prisma.contactMessage.findUnique({
            where: { id },
        });

        if (!contactMessage) {
            return NextResponse.json(
                { error: 'Message not found' },
                { status: 404 }
            );
        }

        // Send email reply
        try {
            await sendSupportReply(
                contactMessage.email,
                contactMessage.name,
                'Your message to HECuPPS', // Subject context
                message
            );
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            return NextResponse.json(
                { error: 'Failed to send email reply' },
                { status: 500 }
            );
        }

        // Update successful reply in database
        const updatedMessage = await prisma.contactMessage.update({
            where: { id },
            data: {
                status: 'REPLIED', // Mark as replied
                // You might want to store the reply content if schema supports it
                // reply: message 
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Reply sent successfully',
            data: updatedMessage
        });

    } catch (error) {
        console.error('Error sending reply:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
