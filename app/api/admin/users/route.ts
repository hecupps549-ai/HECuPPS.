import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

const getUsersHandler = async (req: NextRequest) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                status: true,
                createdAt: true,
                // Do not select password
            }
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

export const GET = withAdminAuth(['SUPER_ADMIN'], getUsersHandler);
