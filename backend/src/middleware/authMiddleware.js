const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/auth');

const COOKIE_NAME = 'bh_admin_token';

const adminGuard = (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME] || req.headers['x-admin-token'];
  if (!token) {
    return res.status(401).json({ message: 'Admin authentication required' });
  }
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (!decoded.admin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
};

module.exports = { adminGuard };
