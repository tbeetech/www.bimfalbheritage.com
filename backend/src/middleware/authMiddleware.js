const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'bh_admin_token';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  return secret || 'change-this-jwt-secret';
};

const adminGuard = (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME] || req.headers['x-admin-token'];
  if (!token) {
    return res.status(401).json({ message: 'Admin authentication required' });
  }
  try {
    const decoded = jwt.verify(token, getSecret());
    if (!decoded.admin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
};

module.exports = { adminGuard };
