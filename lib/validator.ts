import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1),
});

export const masterKeyLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const createProductSchema = z.object({
    name: z.string().min(3),
    description: z.string(),
    price: z.number().positive(),
    category: z.string(),
    stock: z.number().int().min(0),
    images: z.array(z.string().url()).min(1),
    videoUrl: z.string().url().optional().or(z.literal('')),
});

export const updateProductSchema = createProductSchema.partial();
