import fs from 'fs';
import path from 'path';
import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { createContactSubmission, cleanupFailedUpload } from '../controllers/contactController.js';

const router = express.Router();

const uploadsDir = path.resolve('uploads/contact');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  },
});

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
]);

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Unsupported file format. Please upload PDF, DOC, DOCX, PNG, JPG, TXT, or ZIP.'));
  },
});

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: 'Too many contact requests. Please try again in 10 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', contactLimiter, upload.single('file'), createContactSubmission);
router.use(cleanupFailedUpload);
router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err?.message?.includes('Unsupported file format')) {
    return res.status(400).json({
      message: err.message,
    });
  }

  return next(err);
});

export default router;
