const jwt = require('jsonwebtoken');

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  return secret || 'change-this-jwt-secret';
};

// Secret used for user JWT tokens (must match userAuthMiddleware.js)
const getUserSecret = () => process.env.JWT_SECRET || 'bimfalb-heritage-jwt-secret';

const adminGuard = (req, res, next) => {
  // 1. Check for password-based admin token (bh_admin_token cookie or x-admin-token header)
  const adminToken = req.cookies?.bh_admin_token || req.headers['x-admin-token'];
  if (adminToken) {
    try {
      const decoded = jwt.verify(adminToken, getSecret());
      if (decoded.admin) return next();
    } catch { /* fall through to next check */ }
  }

  // 2. Check for user JWT token with role === 'admin' (bh_token cookie)
  const userCookieToken = req.cookies?.bh_token;
  if (userCookieToken) {
    try {
      const decoded = jwt.verify(userCookieToken, getUserSecret());
      if (decoded.role === 'admin') return next();
    } catch { /* fall through */ }
  }

  // 3. Check Bearer token in Authorization header (user JWT)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7);
    try {
      const decoded = jwt.verify(bearerToken, getUserSecret());
      if (decoded.role === 'admin') return next();
    } catch { /* fall through */ }
  }

  return res.status(401).json({ message: 'Unauthorized' });
};

module.exports = { adminGuard };
