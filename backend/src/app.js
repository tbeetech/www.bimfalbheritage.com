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

// Allow requests from explicitly listed origins (comma-separated CORS_ORIGIN env var).
// Entries may be full origins (https://example.com) or bare hosts (example.com).
// When CORS_ORIGIN is not set every origin is permitted – suitable for open public APIs.
const _corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

const isAllowedOrigin = (origin) => {
  if (!origin || _corsOrigins.length === 0) return true;

  let requestUrl;
  try {
    requestUrl = new URL(origin);
  } catch {
    return false;
  }

  return _corsOrigins.some((allowed) => {
    if (!allowed) return false;

    if (allowed.includes('://')) {
      try {
        return new URL(allowed).origin === requestUrl.origin;
      } catch {
        return false;
      }
    }

    return (
      allowed === requestUrl.hostname
      || allowed === requestUrl.host
      || allowed === requestUrl.origin
    );
  });
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
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

// Serve frontend build when SERVE_FRONTEND=true (e.g. on Render where Express
// handles all traffic). The build is written to dist/ at the repo root by Vite.
// On cPanel, Apache serves ~/public_html/ directly so this block is skipped.
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
