// Activity Routes
import express from 'express';
import { getUserActivity, getProjectActivity, createActivity } from '../controllers/activityController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validateMiddleware.js';
import { createActivitySchema, projectIdParamSchema } from '../validators/schemas.js';
import { validateParams } from '../middlewares/validateMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user activity feed
router.get('/', getUserActivity);

// Get project-specific activity
router.get('/project/:projectId', validateParams(projectIdParamSchema), getProjectActivity);

// Create activity log
router.post('/', validateBody(createActivitySchema), createActivity);

export default router;
