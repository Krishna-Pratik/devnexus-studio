// Payment Routes
import express from 'express';
import {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  getPaymentStats,
} from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateBody, validateParams } from '../middlewares/validateMiddleware.js';
import {
  createPaymentSchema,
  idParamSchema,
  updatePaymentSchema,
} from '../validators/schemas.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Stats route (must be before :id)
router.get('/stats/overview', getPaymentStats);

// Payment CRUD routes
router.get('/', getPayments);
router.post('/', validateBody(createPaymentSchema), createPayment);
router.get('/:id', validateParams(idParamSchema), getPayment);
router.put('/:id', validateParams(idParamSchema), validateBody(updatePaymentSchema), updatePayment);

export default router;
