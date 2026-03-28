const getRequiredEnv = (name) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
};

const getJwtSecret = () => getRequiredEnv('JWT_SECRET');

module.exports = { getJwtSecret };
