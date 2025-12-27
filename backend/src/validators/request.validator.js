import { z } from 'zod';

export const createRequestSchema = z.object({
    subject: z.string().min(1, 'Subject is required'),
    equipmentId: z.string().optional(),
    workCenterId: z.string().optional(),
    maintenanceType: z.enum(['CORRECTIVE', 'PREVENTIVE']).default('CORRECTIVE'),
    scheduledDate: z.string().datetime().optional(),
    priority: z.number().int().min(1).max(5).default(3),
    company: z.string().optional(),
    notes: z.string().optional(),
    instructions: z.string().optional(),
});

export const updateRequestSchema = z.object({
    subject: z.string().min(1, 'Subject is required').optional(),
    equipmentId: z.string().nullable().optional(),
    workCenterId: z.string().nullable().optional(),
    categoryId: z.string().nullable().optional(),
    teamId: z.string().nullable().optional(),
    technicianId: z.string().nullable().optional(),
    maintenanceType: z.enum(['CORRECTIVE', 'PREVENTIVE']).optional(),
    scheduledDate: z.string().datetime().nullable().optional(),
    priority: z.number().int().min(1).max(5).optional(),
    company: z.string().optional(),
    notes: z.string().optional(),
    instructions: z.string().optional(),
    status: z.enum(['NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP']).optional(),
});

export const updateRequestStatusSchema = z.object({
    status: z.enum(['NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP']),
});
