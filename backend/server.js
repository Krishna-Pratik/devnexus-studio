// Devnexus Studio Backend Entry Point
import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import dns from 'dns';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const app = express();

const isProduction = process.env.NODE_ENV === 'production';
const configuredClientUrl = process.env.CLIENT_URL?.trim();
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const jwtSecret = process.env.JWT_SECRET?.trim();
const sslKeyPath = process.env.SSL_KEY_PATH?.trim();
const sslCertPath = process.env.SSL_CERT_PATH?.trim();
const hasNativeTlsConfig = Boolean(sslKeyPath && sslCertPath);
const enforceHttps = isProduction && process.env.ENFORCE_HTTPS !== 'false';
const trustProxy = process.env.TRUST_PROXY === 'true';

if (isProduction && !configuredClientUrl) {
  console.error('CLIENT_URL is required in production.');
  process.exit(1);
}

if (isProduction && !googleClientId) {
  console.error('GOOGLE_CLIENT_ID is required in production.');
  process.exit(1);
}

if (isProduction && !jwtSecret) {
  console.error('JWT_SECRET is required in production.');
  process.exit(1);
}

if (isProduction && ((sslKeyPath && !sslCertPath) || (!sslKeyPath && sslCertPath))) {
  console.error('Both SSL_KEY_PATH and SSL_CERT_PATH are required for native HTTPS.');
  process.exit(1);
}

// Security middlewares
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

if (isProduction && trustProxy) {
  // Trust reverse proxy headers only when explicitly configured.
  app.set('trust proxy', 1);
}

if (enforceHttps) {
  app.use((req, res, next) => {
    const forwardedProtoHeader = trustProxy ? req.headers['x-forwarded-proto'] : '';
    const forwardedProto = Array.isArray(forwardedProtoHeader)
      ? forwardedProtoHeader[0]
      : forwardedProtoHeader;
    const normalizedForwardedProto = (forwardedProto || '').split(',')[0].trim().toLowerCase();
    const isSecureRequest = req.secure || (trustProxy && normalizedForwardedProto === 'https');

    if (isSecureRequest) {
      return next();
    }

    return res.status(426).json({ message: 'HTTPS is required in production.' });
  });
}

// CORS configuration
const allowedOrigins = new Set(
  isProduction
    ? [configuredClientUrl].filter(Boolean)
    : [configuredClientUrl, 'http://localhost:5173', 'http://localhost:5174'].filter(Boolean)
);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser tools (curl/postman) and same-origin requests.
    if (!origin) {
      callback(null, true);
      return;
    }

    const isLocalhostDevOrigin = !isProduction && /^http:\/\/localhost:\d+$/.test(origin);
    if (allowedOrigins.has(origin) || isLocalhostDevOrigin) {
      callback(null, true);
      return;
    }

    const corsError = new Error('CORS not allowed for this origin');
    corsError.statusCode = 403;
    callback(corsError);
  },
  credentials: true,
}));

// API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use('/api', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 10 : 30,
  message: 'Too many authentication attempts. Please try again later.',
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth/google', authLimiter);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/ping', (_req, res) => {
  res.status(200).json({ ok: true, message: 'pong' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    let server;
    if (hasNativeTlsConfig) {
      const tlsOptions = {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath),
      };
      server = https.createServer(tlsOptions, app).listen(PORT);
    } else {
      server = app.listen(PORT);
    }

    server.on('listening', () => {
      if (!isProduction) {
        const protocol = hasNativeTlsConfig ? 'https' : 'http';
        console.log(`\n✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        console.log(`📍 API URL: ${protocol}://localhost:${PORT}/api`);
        console.log(`🔗 Accepting CORS requests from: ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);
      }
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the existing process or set a different PORT.`);
      } else {
        console.error('Failed to bind server:', error.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();