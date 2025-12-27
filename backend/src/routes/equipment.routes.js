import express from 'express';
import { getEquipment, getEquipmentById, createEquipment, updateEquipment, deleteEquipment, getEquipmentRequests } from '../controllers/equipment.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createEquipmentSchema, updateEquipmentSchema } from '../validators/equipment.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getEquipment);
router.get('/:id', getEquipmentById);
router.get('/:id/requests', getEquipmentRequests);
router.post('/', authorize('ADMIN', 'MANAGER'), validate(createEquipmentSchema), createEquipment);
router.put('/:id', authorize('ADMIN', 'MANAGER'), validate(updateEquipmentSchema), updateEquipment);
router.delete('/:id', authorize('ADMIN'), deleteEquipment);

export default router;
