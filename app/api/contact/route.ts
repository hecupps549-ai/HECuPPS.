import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all contact messages (admin only)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const where: any = {};
        if (status) where.status = status;

        const messages = await prisma.contactMessage.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}

// POST create new contact message
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, message } = body;

        console.log('[Contact Message] Request body:', JSON.stringify(body, null, 2));

        // Validate required fields
        if (!name || !email || !message) {
            console.error('[Contact Message] Missing required fields:', { name, email, message });
            return NextResponse.json(
                { error: 'Missing required fields: name, email, and message are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Create contact message
        const contactMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone: phone || null,
                message,
                status: 'NEW',
            },
        });

        console.log('[Contact Message] Successfully created message:', contactMessage.id);
        return NextResponse.json({
            message: 'Message sent successfully',
            id: contactMessage.id
        }, { status: 201 });
    } catch (error: any) {
        console.error('[Contact Message] Error creating message:', error);
        console.error('[Contact Message] Error details:', {
            message: error.message,
            code: error.code,
        });

        return NextResponse.json(
            { error: error.message || 'Failed to send message' },
            { status: 500 }
        );
    }
}
