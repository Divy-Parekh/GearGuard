import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    role: z.enum(['USER', 'TECHNICIAN', 'MANAGER', 'ADMIN']).optional(),
    company: z.string().optional(),
    teamId: z.string().optional(),
});

export const updateUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email format').optional(),
    role: z.enum(['USER', 'TECHNICIAN', 'MANAGER', 'ADMIN']).optional(),
    company: z.string().optional(),
    teamId: z.string().nullable().optional(),
});
