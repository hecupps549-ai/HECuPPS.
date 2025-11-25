import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

const getUsersHandler = async (req: NextRequest) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                // Do not select password or other sensitive fields
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json({ users });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
};

export const GET = withAdminAuth(['SUPER_ADMIN'], getUsersHandler);
