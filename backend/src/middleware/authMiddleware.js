const jwt = require('jsonwebtoken');

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  return secret || 'change-this-jwt-secret';
};

const adminGuard = (req, res, next) => {
  const token = req.cookies?.bh_admin_token || req.headers['x-admin-token'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, getSecret());
    if (!decoded.admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { adminGuard };
