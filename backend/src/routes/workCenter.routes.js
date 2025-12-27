import express from 'express';
import { getWorkCenters, getWorkCenter, createWorkCenter, updateWorkCenter, deleteWorkCenter } from '../controllers/workCenter.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createWorkCenterSchema, updateWorkCenterSchema } from '../validators/workCenter.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getWorkCenters);
router.get('/:id', getWorkCenter);
router.post('/', authorize('ADMIN'), validate(createWorkCenterSchema), createWorkCenter);
router.put('/:id', authorize('ADMIN'), validate(updateWorkCenterSchema), updateWorkCenter);
router.delete('/:id', authorize('ADMIN'), deleteWorkCenter);

export default router;
