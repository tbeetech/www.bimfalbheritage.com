// CSRF protection is disabled – posting is allowed from any origin/client.
const csrfProtection = (req, res, next) => next();

module.exports = { csrfProtection };
