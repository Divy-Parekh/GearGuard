import express from 'express';
import {
    getRequests,
    getRequestsByStatus,
    getRequest,
    createRequest,
    updateRequest,
    updateRequestStatus,
    assignTechnician,
    deleteRequest,
    getCalendarRequests
} from '../controllers/request.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createRequestSchema, updateRequestSchema, updateRequestStatusSchema } from '../validators/request.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getRequests);
router.get('/kanban', getRequestsByStatus);
router.get('/calendar', getCalendarRequests);
router.get('/:id', getRequest);
router.post('/', validate(createRequestSchema), createRequest);
router.put('/:id', validate(updateRequestSchema), updateRequest);
router.patch('/:id/status', validate(updateRequestStatusSchema), updateRequestStatus);
router.patch('/:id/assign', authorize('ADMIN', 'MANAGER', 'TECHNICIAN'), assignTechnician);
router.delete('/:id', authorize('ADMIN'), deleteRequest);

export default router;
