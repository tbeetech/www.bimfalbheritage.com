const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'bh_admin_token';
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 4, // 4 hours
};

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  return secret || 'change-this-jwt-secret';
};

const login = (req, res) => {
  const { password } = req.body;
  if (!password || password !== 'superculture') {
    return res.status(401).json({ message: 'Invalid password' });
  }
  const token = jwt.sign({ admin: true }, getSecret(), { expiresIn: '4h' });
  res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
  return res.json({ message: 'Logged in', admin: true, token });
};

const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: 'Logged out' });
};

const status = (req, res) => {
  const token = req.cookies?.[COOKIE_NAME] || req.headers['x-admin-token'];
  if (!token) return res.json({ admin: false });
  try {
    const decoded = jwt.verify(token, getSecret());
    return res.json({ admin: !!decoded.admin });
  } catch {
    return res.json({ admin: false });
  }
};

module.exports = { login, logout, status };
