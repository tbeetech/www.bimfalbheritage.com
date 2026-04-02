const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, logout, status } = require('../controllers/authController');

const router = express.Router();

/** Strict limiter for login: 20 attempts per 15 minutes per IP */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later' },
});

/** Lenient limiter for status checks: 60 per 15 minutes per IP */
const statusLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
});

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/status', statusLimiter, status);

module.exports = router;
