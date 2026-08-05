// backend/src/index.ts
import dotenv from 'dotenv';
dotenv.config();

// Fail fast rather than booting with a missing or trivially guessable signing key.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error(
    'JWT_SECRET must be set and at least 32 characters. Generate one with: ' +
      'node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'base64\'))"',
  );
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI must be set.');
}

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import mongoose from 'mongoose';
import { connectDB } from './db';
import cookieParser from 'cookie-parser';

// Import your routes here
import developerRoutes from './api/developers/developer.routes';
import jobRoutes from './api/jobs/job.routes';
import newsletterRoutes from './api/newsletter/newsletter.routes';
import propertyRoutes from './api/properties/property.routes'
import articleRoutes from './api/articles/article.routes'
import enquiryRoutes from './api/enquiries/enquiry.routes'
import contactRoutes from './api/contacts/contact.routes'
import applicationRoutes from './api/jobApplication/applications.routes'
import commentRoutes from './api/comments/comment.routes'
import notificationRoutes from './api/notifications/notification.routes';
import authRoutes from './api/auth/auth.routes';
import userRoutes from './api/users/user.routes';
import analyticsRoutes from './api/analytics/routes';
import faqRoutes from './api/faqs/faq.routes';
import discoverRoutes from './api/discover/discover.routes';
import contentPageRoutes from './api/contentPages/contentPage.routes';


const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const HOTSPOT_FRONTEND_URL = process.env.HOTSPOT_FRONTEND_URL;
const isProduction = process.env.NODE_ENV === 'production';

// Behind a reverse proxy (Docker/Vercel/nginx) so rate limiting sees real client IPs.
app.set('trust proxy', 1);

// Origins come from CORS_ORIGINS; localhost defaults apply outside production only.
const configuredOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  ...(isProduction ? [] : ['http://localhost:3000', 'http://localhost:3001']),
  ...(HOTSPOT_FRONTEND_URL ? [HOTSPOT_FRONTEND_URL] : []),
];

app.use(helmet({
  // Uploads are served from this origin; keep cross-origin reads of images working.
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Health check route. Registered ahead of CORS deliberately: probes (Docker
// HEALTHCHECK, nginx, uptime monitors) send no Origin header, which the CORS
// handler below rejects with a 403 in production. Express short-circuits on the
// matched route, so this path never reaches that check. Kept after helmet so
// the response still carries the security headers.
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(cors({
  origin: function (origin, callback) {
    // Requests without an Origin header (curl, server-to-server) are only
    // waved through outside production.
    if (!origin) {
      return callback(isProduction ? new Error('Not allowed by CORS') : null, !isProduction);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Global body cap. Multipart uploads bypass this and are capped per-route by multer.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Broad limiter for the whole API; the login route gets a much tighter one.
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
  }),
);

// Tight limiter on unauthenticated public write endpoints (spam / mail-abuse).
const publicWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req) => req.method === 'GET',
  message: { message: 'Too many submissions, please try again later.' },
});

// Static files. Uploads are user-supplied, so force download semantics and
// block MIME sniffing — an uploaded SVG/HTML must never execute on this origin.
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'), {
    dotfiles: 'deny',
    index: false,
    setHeaders(res) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Disposition', 'attachment');
      res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
    },
  }),
);


// Connect to DB. Content pages are created lazily on first request, and can be
// pre-seeded explicitly with `npm run seed:content-pages` — no boot-time seeding.
void connectDB();

// API Routes
app.use('/api/developers', developerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/newsletter', publicWriteLimiter, newsletterRoutes);
app.use('/api/properties', propertyRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/enquiries', publicWriteLimiter, enquiryRoutes)
app.use('/api/contacts', publicWriteLimiter, contactRoutes)
app.use('/api/jobApplication', publicWriteLimiter, applicationRoutes);
app.use('/api/comments', publicWriteLimiter, commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/content-pages', contentPageRoutes);

// Multer and CORS rejections must not leak stack traces.
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err?.message === 'Not allowed by CORS') {
    res.status(403).json({ message: 'Origin not allowed' });
    return;
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const server = app.listen(Number(PORT), HOST, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  if (HOST === '0.0.0.0') {
    console.log(`LAN access enabled. Use your PC IP: http://<your-local-ip>:${PORT}`);
  }
});

// Graceful shutdown: stop accepting connections, drain in-flight requests, then
// close the Mongo connection. A hard timeout guards against a hung request.
let shuttingDown = false;
async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received — shutting down gracefully...`);

  const forceExit = setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  server.close(async () => {
    try {
      await mongoose.connection.close();
      console.log('Closed HTTP server and database connection.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

export default app;

