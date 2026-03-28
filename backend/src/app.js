const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const sitemapRoute = require('./routes/sitemapRoute');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { csrfProtection } = require('./middleware/csrf');

const app = express();

// Build the list of allowed CORS origins from the CORS_ORIGIN env var (comma-separated)
// plus a set of hard-coded production defaults.
const DEFAULT_CORS_ORIGINS = [
  'https://www.bimfalbheritage.org',
  'https://bimfalbheritage.org',
  'https://www.bimfalbheritage.com',
  'https://bimfalbheritage.com',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const envOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...DEFAULT_CORS_ORIGINS, ...envOrigins]);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin (e.g. curl, server-to-server, or same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin not allowed (${origin})`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(csrfProtection);

// Serve uploaded images statically for demo purposes
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const DB_STATES = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = DB_STATES[dbState] ?? 'unknown';
  const status = dbState === 1 ? 'ok' : 'degraded';
  res.status(dbState === 1 ? 200 : 503).json({ status, service: 'Bimfalb Heritage API', db: dbStatus });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/gallery', galleryRoutes);

// Dynamic sitemap – lists all static pages and published post URLs
app.use('/', sitemapRoute);

// Serve frontend build when SERVE_FRONTEND=true (e.g. on cPanel where the Node.js
// app also handles the React SPA). On Vercel, the CDN serves the React build
// directly and Express only handles /api/* – leave SERVE_FRONTEND unset there.
if (process.env.SERVE_FRONTEND === 'true') {
  const distPath = path.join(__dirname, '..', '..', 'dist');
  app.use(express.static(distPath));
  // SPA fallback for non-API routes
  app.get(/^\/(?!api).*/, (req, res, next) => {
    return res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
