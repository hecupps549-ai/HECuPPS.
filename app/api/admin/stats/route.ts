import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAuth } from '@/lib/rbac';

async function statsHandler(req: NextRequest) {
    try {
        const [
            productCount, 
            orderCount, 
            userCount, 
            revenueResult,
            recentOrders,
            lowStockProducts
        ] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.user.count(),
            prisma.order.aggregate({
                _sum: {
                    totalAmount: true
                },
                where: {
                    paymentStatus: 'PAID'
                }
            }),
            prisma.order.findMany({
                take: 5,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.product.findMany({
                where: {
                    stock: {
                        lt: 10
                    }
                },
                take: 5,
                orderBy: {
                    stock: 'asc'
                },
                include: {
                    images: {
                        where: {
                            isPrimary: true
                        },
                        take: 1
                    }
                }
            })
        ]);

        const totalRevenue = revenueResult._sum.totalAmount || 0;

        return NextResponse.json({
            stats: [
                { label: 'Total Products', value: productCount.toString(), icon: '📦', trend: '+0%' },
                { label: 'Total Orders', value: orderCount.toString(), icon: '🛒', trend: '+0%' },
                { label: 'Total Users', value: userCount.toString(), icon: '👥', trend: '+0%' },
                { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: '💰', trend: '+0%' },
            ],
            recentOrders,
            lowStockProducts
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }
}

export const GET = withAdminAuth(['SUPER_ADMIN'], statsHandler);
