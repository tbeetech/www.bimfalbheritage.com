const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'bimfalb-heritage-jwt-secret';

const verifyToken = (req) => {
  // 1. Cookie
  const cookieToken = req.cookies?.bh_token;
  if (cookieToken) return jwt.verify(cookieToken, JWT_SECRET);

  // 2. Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    return jwt.verify(token, JWT_SECRET);
  }

  return null;
};

/** Require a logged-in user – returns 401 if not authenticated. */
const userGuard = (req, res, next) => {
  try {
    const payload = verifyToken(req);
    if (!payload) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/** Attach user info when token present, but do NOT reject if missing. */
const optionalUserAuth = (req, res, next) => {
  try {
    const payload = verifyToken(req);
    if (payload) req.user = payload;
  } catch {
    // invalid token – just ignore
  }
  return next();
};

module.exports = { userGuard, optionalUserAuth, JWT_SECRET };
