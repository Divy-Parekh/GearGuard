import express from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser, getTechnicians } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, updateUserSchema } from '../validators/user.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/technicians', getTechnicians);

router.get('/', authorize('ADMIN'), getUsers);
router.get('/:id', authorize('ADMIN'), getUser);
router.post('/', authorize('ADMIN'), validate(createUserSchema), createUser);
router.put('/:id', authorize('ADMIN'), validate(updateUserSchema), updateUser);
router.delete('/:id', authorize('ADMIN'), deleteUser);

export default router;
