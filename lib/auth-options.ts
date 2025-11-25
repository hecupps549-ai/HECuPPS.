import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        // User Login
        CredentialsProvider({
            id: 'user-credentials',
            name: 'User Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                if (user.status !== 'Active') {
                    throw new Error('Your account has been blocked');
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error('Invalid email or password');
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name,
                    role: 'user',
                };
            },
        }),

        // Admin Login
        CredentialsProvider({
            id: 'admin-credentials',
            name: 'Admin Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('Username and password are required');
                }

                const admin = await prisma.admin.findUnique({
                    where: { username: credentials.username },
                });

                if (!admin) {
                    throw new Error('Invalid username or password');
                }

                if (admin.status !== 'Active') {
                    throw new Error('Your account has been disabled');
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    admin.password
                );

                if (!isPasswordValid) {
                    throw new Error('Invalid username or password');
                }

                // Update last login
                await prisma.admin.update({
                    where: { id: admin.id },
                    data: { lastLogin: new Date() },
                });

                return {
                    id: admin.id.toString(),
                    email: admin.email || admin.username,
                    name: admin.username,
                    role: admin.role.toLowerCase(), // 'superadmin' or 'admin'
                };
            },
        }),
    ],

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },

    secret: process.env.NEXTAUTH_SECRET,
};
