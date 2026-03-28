const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/auth');

const COOKIE_NAME = 'bh_admin_token';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: IS_PRODUCTION ? 'none' : 'lax',
  secure: IS_PRODUCTION,
  path: '/',
  maxAge: 1000 * 60 * 60 * 4, // 4 hours
};

const COOKIE_CLEAR_OPTS = {
  httpOnly: COOKIE_OPTS.httpOnly,
  sameSite: COOKIE_OPTS.sameSite,
  secure: COOKIE_OPTS.secure,
  path: COOKIE_OPTS.path,
};

const getAdminPassword = () => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPassword) return adminPassword;
  return IS_PRODUCTION ? '' : 'superculture';
};

const getRequestToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return req.cookies?.[COOKIE_NAME] || req.headers['x-admin-token'] || null;
};

const login = (req, res) => {
  const { password } = req.body;
  const adminPassword = getAdminPassword();

  if (!adminPassword) {
    return res.status(503).json({ message: 'Admin authentication is not configured' });
  }

  if (!password || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const token = jwt.sign({ admin: true }, getJwtSecret(), { expiresIn: '4h' });
  res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
  return res.json({ message: 'Logged in', admin: true, token });
};

const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, COOKIE_CLEAR_OPTS);
  res.json({ message: 'Logged out' });
};

const status = (req, res) => {
  const token = getRequestToken(req);
  if (!token) return res.json({ admin: false });
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    return res.json({ admin: !!decoded.admin });
  } catch {
    return res.json({ admin: false });
  }
};

module.exports = { login, logout, status };
