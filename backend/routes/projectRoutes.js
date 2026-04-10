// Project Routes
import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} from '../controllers/projectController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateBody, validateParams } from '../middlewares/validateMiddleware.js';
import {
  createProjectSchema,
  idParamSchema,
  updateProjectSchema,
} from '../validators/schemas.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Stats route (must be before :id)
router.get('/stats/overview', getProjectStats);

// Project CRUD routes
router.get('/', getProjects);
router.post('/', validateBody(createProjectSchema), createProject);
router.get('/:id', validateParams(idParamSchema), getProject);
router.put('/:id', validateParams(idParamSchema), validateBody(updateProjectSchema), updateProject);
router.delete('/:id', validateParams(idParamSchema), deleteProject);

export default router;
