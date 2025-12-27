import { z } from 'zod';

export const createTeamSchema = z.object({
    name: z.string().min(1, 'Team name is required'),
    company: z.string().optional(),
});

export const updateTeamSchema = z.object({
    name: z.string().min(1, 'Team name is required').optional(),
    company: z.string().optional(),
});

export const allocateMemberSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
});
