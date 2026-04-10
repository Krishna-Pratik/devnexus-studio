// Message Routes
import express from 'express';
import {
  getMessages,
  sendMessage,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateBody, validateParams } from '../middlewares/validateMiddleware.js';
import { idParamSchema, projectIdParamSchema, sendMessageSchema } from '../validators/schemas.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get messages for a project
router.get('/:projectId', validateParams(projectIdParamSchema), getMessages);

// Send message
router.post('/', validateBody(sendMessageSchema), sendMessage);

// Delete message
router.delete('/:id', validateParams(idParamSchema), deleteMessage);

export default router;
