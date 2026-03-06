// Admin access is open – no login required to manage content via /admin
const adminGuard = (req, res, next) => next();

module.exports = { adminGuard };
