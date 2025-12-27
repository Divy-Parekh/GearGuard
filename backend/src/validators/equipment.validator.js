import { z } from 'zod';

export const createEquipmentSchema = z.object({
    name: z.string().min(1, 'Equipment name is required'),
    categoryId: z.string().optional(),
    company: z.string().optional(),
    usedByRole: z.string().optional(),
    employeeName: z.string().optional(),
    teamId: z.string().optional(),
    technicianId: z.string().optional(),
    assignedDate: z.string().datetime().optional(),
    location: z.string().optional(),
    workCenterId: z.string().optional(),
    description: z.string().optional(),
});

export const updateEquipmentSchema = z.object({
    name: z.string().min(1, 'Equipment name is required').optional(),
    categoryId: z.string().nullable().optional(),
    company: z.string().optional(),
    usedByRole: z.string().optional(),
    employeeName: z.string().optional(),
    teamId: z.string().nullable().optional(),
    technicianId: z.string().nullable().optional(),
    assignedDate: z.string().datetime().nullable().optional(),
    scrapDate: z.string().datetime().nullable().optional(),
    location: z.string().optional(),
    workCenterId: z.string().nullable().optional(),
    description: z.string().optional(),
    status: z.enum(['ACTIVE', 'SCRAPPED']).optional(),
});
