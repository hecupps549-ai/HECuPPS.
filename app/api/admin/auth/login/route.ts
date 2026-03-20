import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
        }

        const admin = await prisma.admin.findUnique({
            where: { username },
        });

        if (!admin) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        if (admin.status !== 'Active') {
            return NextResponse.json({ message: 'Account is disabled' }, { status: 403 });
        }

        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Sign token for the admin
        const token = signToken({
            id: admin.id.toString(),
            role: 'ADMIN',
        });

        // Update last login
        await prisma.admin.update({
            where: { id: admin.id },
            data: { lastLogin: new Date() },
        });

        return NextResponse.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
