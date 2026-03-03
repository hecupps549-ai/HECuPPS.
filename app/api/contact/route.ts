import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email-service';

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

        // Send email notification to admin
        try {
            // Get admin email from site settings
            const siteSettings = await prisma.siteSettings.findFirst();
            const adminEmail = siteSettings?.contactEmail || process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1] || 'admin@hecupps.com';

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #8E5A3B; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0;">New Contact Message</h1>
                    </div>
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
                        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                            You've received a new message from your website contact form.
                        </p>
                        
                        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                            <h3 style="color: #8E5A3B; margin-top: 0;">Customer Details</h3>
                            <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
                            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #8E5A3B;">${email}</a></p>
                            ${phone ? `<p style="margin: 8px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
                        </div>
                        
                        <div style="background-color: #fff8e6; padding: 20px; border-left: 4px solid #C9A869; border-radius: 4px;">
                            <h3 style="color: #8E5A3B; margin-top: 0;">Message</h3>
                            <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                            <p style="color: #666; font-size: 14px; margin: 0;">
                                <strong>Message ID:</strong> #${contactMessage.id}<br>
                                <strong>Received:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}
                            </p>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                        <p>This is an automated notification from HECuPPS</p>
                    </div>
                </div>
            `;

            await sendEmail({
                to: adminEmail,
                subject: `New Contact Message from ${name}`,
                html: emailHtml,
            });

            console.log('[Contact Message] Admin notification email sent to:', adminEmail);
        } catch (emailError) {
            // Log error but don't fail the request - contact message is already saved
            console.error('[Contact Message] Failed to send admin notification email:', emailError);
        }

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
