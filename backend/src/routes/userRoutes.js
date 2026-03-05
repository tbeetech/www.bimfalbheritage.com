const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, userLogin, userLogout, getMe, updateProfile, changePassword } = require('../controllers/userController');
const { userGuard } = require('../middleware/userAuthMiddleware');

const router = express.Router();

/** Strict limiter for auth mutations: 10 attempts per 15 minutes per IP */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' },
});

/** General API limiter for authenticated account routes: 100 per 15 minutes */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, userLogin);
router.post('/logout', apiLimiter, userLogout);
router.get('/me', apiLimiter, userGuard, getMe);
router.put('/me', apiLimiter, userGuard, updateProfile);
router.put('/me/password', apiLimiter, userGuard, changePassword);

module.exports = router;
