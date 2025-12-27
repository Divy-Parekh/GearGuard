import { z } from 'zod';

export const createWorksheetSchema = z.object({
    content: z.string().min(1, 'Content is required'),
    requestId: z.string().min(1, 'Request ID is required'),
});

export const updateWorksheetSchema = z.object({
    content: z.string().min(1, 'Content is required'),
});
