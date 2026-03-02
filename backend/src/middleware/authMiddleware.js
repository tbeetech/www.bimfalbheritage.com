const adminGuard = (req, res, next) => {
  const cookieSession = req.session?.isAdmin;
  const headerToken = req.headers['x-admin-token'] && req.headers['x-admin-token'] === process.env.ADMIN_PASSWORD;

  if (!cookieSession && !headerToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return next();
};

module.exports = { adminGuard };
