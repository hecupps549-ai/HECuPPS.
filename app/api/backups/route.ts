import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all backup logs
export async function GET(request: NextRequest) {
    try {
        const backups = await prisma.backupLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50, // Limit to last 50 backups
        });

        return NextResponse.json({ backups });
    } catch (error) {
        console.error('Error fetching backups:', error);
        return NextResponse.json(
            { error: 'Failed to fetch backups' },
            { status: 500 }
        );
    }
}

// POST create new backup
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type } = body; // products, users, orders, coupons, or full

        console.log('[Backup] Creating backup of type:', type);

        let data: any = {};
        let recordCount = 0;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `backup_${type}_${timestamp}.json`;

        // Fetch data based on backup type
        switch (type) {
            case 'products':
                data.products = await prisma.product.findMany({
                    include: { images: true, digitalFiles: true },
                });
                recordCount = data.products.length;
                break;

            case 'users':
                data.users = await prisma.user.findMany({
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        emailVerified: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                        // Exclude password
                    },
                });
                recordCount = data.users.length;
                break;

            case 'orders':
                data.orders = await prisma.order.findMany({
                    include: {
                        items: true,
                        shippingAddress: true,
                        billingAddress: true,
                    },
                });
                recordCount = data.orders.length;
                break;

            case 'coupons':
                data.coupons = await prisma.coupon.findMany();
                recordCount = data.coupons.length;
                break;

            case 'full':
                // Full database backup (main tables only)
                const [products, users, orders, coupons, contactMessages, supportTickets, settings, paymentSettings] = await Promise.all([
                    prisma.product.findMany({ include: { images: true, digitalFiles: true } }),
                    prisma.user.findMany({
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            emailVerified: true,
                            status: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    }),
                    prisma.order.findMany({
                        include: {
                            items: true,
                            shippingAddress: true,
                            billingAddress: true,
                        },
                    }),
                    prisma.coupon.findMany(),
                    prisma.contactMessage.findMany(),
                    prisma.supportTicket.findMany(),
                    prisma.siteSettings.findMany(),
                    prisma.paymentSettings.findMany(),
                ]);

                data = {
                    products,
                    users,
                    orders,
                    coupons,
                    contactMessages,
                    supportTickets,
                    settings,
                    paymentSettings,
                    metadata: {
                        backupDate: new Date().toISOString(),
                        version: '1.0',
                    },
                };
                recordCount = products.length + users.length + orders.length + coupons.length;
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid backup type' },
                    { status: 400 }
                );
        }

        // Convert to JSON string
        const jsonData = JSON.stringify(data, null, 2);
        const fileSize = Buffer.byteLength(jsonData, 'utf8');

        // Log the backup
        const backupLog = await prisma.backupLog.create({
            data: {
                type,
                fileName,
                fileSize,
                status: 'success',
            },
        });

        console.log('[Backup] Successfully created backup:', fileName);

        // Return the backup data for download
        return new NextResponse(jsonData, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'X-Backup-Log-Id': backupLog.id.toString(),
                'X-Record-Count': recordCount.toString(),
            },
        });
    } catch (error: any) {
        console.error('[Backup] Error creating backup:', error);

        // Try to log the failed backup
        try {
            await prisma.backupLog.create({
                data: {
                    type: 'unknown',
                    fileName: 'failed_backup',
                    fileSize: 0,
                    status: 'failed',
                    errorMessage: error.message,
                },
            });
        } catch (logError) {
            console.error('[Backup] Failed to log error:', logError);
        }

        return NextResponse.json(
            { error: error.message || 'Failed to create backup' },
            { status: 500 }
        );
    }
}

// DELETE backup log
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Backup ID required' }, { status: 400 });
        }

        await prisma.backupLog.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Backup log deleted' });
    } catch (error) {
        console.error('Error deleting backup log:', error);
        return NextResponse.json(
            { error: 'Failed to delete backup log' },
            { status: 500 }
        );
    }
}
