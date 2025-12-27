import express from 'express';
import { getWorksheets, getWorksheet, createWorksheet, updateWorksheet, deleteWorksheet } from '../controllers/worksheet.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createWorksheetSchema, updateWorksheetSchema } from '../validators/worksheet.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getWorksheets);
router.get('/:id', getWorksheet);
router.post('/', validate(createWorksheetSchema), createWorksheet);
router.put('/:id', validate(updateWorksheetSchema), updateWorksheet);
router.delete('/:id', deleteWorksheet);

export default router;
