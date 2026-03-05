/**
 * CSRF protection via Origin/Referer header check.
 *
 * For state-changing requests (non-GET/HEAD/OPTIONS) we verify that the
 * Origin or Referer header matches an allowed origin.  Browsers always send
 * Origin on cross-origin requests, so a valid Origin means the request
 * originated from our own SPA.  This is the "Origin-based CSRF mitigation"
 * technique and is appropriate for JWT + SameSite cookie auth.
 *
 * GET / HEAD / OPTIONS are safe methods and do not need CSRF protection.
 */
const csrfProtection = (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) return next();

  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';

  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : [];

  // In production: require origin to match an allowed origin
  if (process.env.NODE_ENV === 'production' && allowedOrigins.length > 0) {
    const trusted = allowedOrigins.some((allowed) => {
      return origin === allowed || referer.startsWith(allowed);
    });
    if (!trusted && origin !== '') {
      return res.status(403).json({ message: 'CSRF check failed' });
    }
  }

  return next();
};

module.exports = { csrfProtection };
