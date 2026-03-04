const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  session({
    name: 'bh_session',
    secret: process.env.SESSION_SECRET || 'local-demo-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 4, // 4 hours
    },
  })
);

// Serve uploaded images statically for demo purposes
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Bimfalb Heritage API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Serve frontend build (single Render service)
const distPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(distPath));
// SPA fallback for non-API routes
app.get(/^\/(?!api).*/, (req, res, next) => {
  return res.sendFile(path.join(distPath, 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
