import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from './auth';
import { prisma } from './prisma';

type AdminRole = 'SUPER_ADMIN' | 'PRODUCT_MANAGER' | 'ORDER_MANAGER';

type Handler = (req: NextRequest, params: { [key: string]: any }, decodedToken: TokenPayload) => Promise<NextResponse>;

export const withAdminAuth = (allowedRoles: AdminRole[], handler: Handler): ((req: NextRequest, params: { [key: string]: any }) => Promise<NextResponse>) => {
  return async (req: NextRequest, params: { [key: string]: any }) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized: No token provided' }), { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized: Malformed token' }), { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ message: 'Forbidden: Invalid token or role' }), { status: 403 });
    }
    
    // In a real multi-admin system, you would check `decoded.id` against the Admin table in the DB
    // to get the specific roles and check if `allowedRoles` includes any of them.
    // For this example, we'll assume any admin can do anything for simplicity.
    const admin = await prisma.admin.findUnique({ where: { id: decoded.id }});
    if(!admin) {
        return new NextResponse(JSON.stringify({ message: 'Forbidden: Admin not found' }), { status: 403 });
    }
    // Simple check: if SUPER_ADMIN is required, user must be a master admin.
    if(allowedRoles.includes('SUPER_ADMIN') && !admin.isMaster) {
        return new NextResponse(JSON.stringify({ message: 'Forbidden: Super Admin role required' }), { status: 403 });
    }
    
    return handler(req, params, decoded);
  };
};
