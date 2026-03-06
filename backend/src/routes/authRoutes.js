const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, logout, status } = require('../controllers/authController');

const router = express.Router();

/** Strict limiter for admin auth endpoints: 10 attempts per 15 minutes per IP */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' },
});

router.post('/login', authLimiter, login);
router.post('/logout', authLimiter, logout);
router.get('/status', authLimiter, status);

module.exports = router;
