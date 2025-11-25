import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET settings
export async function GET(request: NextRequest) {
    try {
        // Get or create site settings (there should only be one record)
        let siteSettings = await prisma.siteSettings.findFirst();

        if (!siteSettings) {
            siteSettings = await prisma.siteSettings.create({
                data: {
                    siteName: 'HECuPPS',
                    currency: 'INR',
                    taxRate: 0,
                },
            });
        }

        // Get or create payment settings
        let paymentSettings = await prisma.paymentSettings.findFirst();

        if (!paymentSettings) {
            paymentSettings = await prisma.paymentSettings.create({
                data: {},
            });
        }

        return NextResponse.json({
            siteSettings,
            paymentSettings
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

// PUT update settings
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { siteSettings: siteData, paymentSettings: paymentData } = body;

        console.log('[Settings Update] Request body:', JSON.stringify(body, null, 2));

        // Update or create site settings
        const siteSettings = await prisma.siteSettings.upsert({
            where: { id: siteData?.id || 1 },
            update: siteData,
            create: {
                ...siteData,
                id: 1,
            },
        });

        // Update or create payment settings
        const paymentSettings = await prisma.paymentSettings.upsert({
            where: { id: paymentData?.id || 1 },
            update: paymentData,
            create: {
                ...paymentData,
                id: 1,
            },
        });

        console.log('[Settings Update] Successfully updated settings');
        return NextResponse.json({
            siteSettings,
            paymentSettings
        });
    } catch (error: any) {
        console.error('[Settings Update] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update settings' },
            { status: 500 }
        );
    }
}
