import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Get notifications
router.get('/', getNotifications);

// Mark single as read
router.patch('/:id/read', markAsRead);

// Mark all as read
router.patch('/read-all', markAllAsRead);

// Delete single
router.delete('/:id', deleteNotification);

// Clear all
router.delete('/clear-all', clearAllNotifications);

export default router;
