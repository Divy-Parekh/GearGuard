import express from 'express';
import { getTeams, getTeam, createTeam, updateTeam, deleteTeam, allocateMember, deallocateMember } from '../controllers/team.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTeamSchema, updateTeamSchema, allocateMemberSchema } from '../validators/team.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getTeams);
router.get('/:id', getTeam);
router.post('/', authorize('ADMIN'), validate(createTeamSchema), createTeam);
router.put('/:id', authorize('ADMIN'), validate(updateTeamSchema), updateTeam);
router.delete('/:id', authorize('ADMIN'), deleteTeam);

// Member allocation (Admin and Manager)
router.post('/:id/members', authorize('ADMIN', 'MANAGER'), validate(allocateMemberSchema), allocateMember);
router.delete('/:id/members/:userId', authorize('ADMIN', 'MANAGER'), deallocateMember);

export default router;
