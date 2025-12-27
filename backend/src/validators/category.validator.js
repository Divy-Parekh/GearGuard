import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
    responsible: z.string().optional(),
    company: z.string().optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required').optional(),
    responsible: z.string().optional(),
    company: z.string().optional(),
});
