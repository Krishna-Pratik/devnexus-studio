// Authentication API Routes
import express from 'express';
import { signup, login, googleAuth, googleAuthStart, googleAuthCallback, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validateMiddleware.js';
import { googleAuthSchema, loginSchema, signupSchema } from '../validators/schemas.js';

const router = express.Router();

router.post('/signup', validateBody(signupSchema), signup);
router.post('/login', validateBody(loginSchema), login);
router.post('/google', validateBody(googleAuthSchema), googleAuth);
router.get('/google/start', googleAuthStart);
router.get('/google/callback', googleAuthCallback);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;