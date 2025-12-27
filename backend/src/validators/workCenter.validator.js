import { z } from 'zod';

export const createWorkCenterSchema = z.object({
    name: z.string().min(1, 'Work center name is required'),
    code: z.string().min(1, 'Work center code is required'),
    tag: z.string().optional(),
    alternativeWorkCenter: z.string().optional(),
    costPerHour: z.number().optional(),
    capacity: z.number().int().optional(),
    timeEfficiency: z.number().min(0).max(100).optional(),
    oeeTarget: z.number().min(0).max(100).optional(),
});

export const updateWorkCenterSchema = z.object({
    name: z.string().min(1, 'Work center name is required').optional(),
    code: z.string().min(1, 'Work center code is required').optional(),
    tag: z.string().optional(),
    alternativeWorkCenter: z.string().optional(),
    costPerHour: z.number().optional(),
    capacity: z.number().int().optional(),
    timeEfficiency: z.number().min(0).max(100).optional(),
    oeeTarget: z.number().min(0).max(100).optional(),
});
