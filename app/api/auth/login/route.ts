import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken, signRefreshToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validator';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await comparePassword(validated.password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status === 'BLOCKED') {
        const { password, ...userWithoutPassword } = user;
        return NextResponse.json({ message: 'User account is blocked', user: userWithoutPassword }, { status: 403 });
    }
    
    const tokenPayload = { id: user.id, role: 'USER' as const };
    const accessToken = signToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);
    
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login successful',
      token: accessToken,
      refreshToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation failed', errors: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'An internal error occurred' }, { status: 500 });
  }
}
