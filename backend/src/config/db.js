const mongoose = require('mongoose');

const isSrvLookupError = (err) => {
  const msg = `${err?.message || ''}`.toLowerCase();
  return msg.includes('querysrv') || msg.includes('_mongodb._tcp');
};

const connectWithUri = async (uri, label) => {
  await mongoose.connect(uri);
  console.log(`[db] Connected to MongoDB Atlas${label ? ` (${label})` : ''}`);
};

const connectDB = async () => {
  const srvUri = process.env.MONGODB_URI;
  const directUri = process.env.MONGODB_URI_DIRECT;

  if (!srvUri && !directUri) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[db] FATAL: MONGODB_URI (or MONGODB_URI_DIRECT) is not set. User authentication and all database operations will fail.');
    } else {
      console.warn('[db] MONGODB_URI not set – database connection skipped.');
    }
    return;
  }

  try {
    if (srvUri) {
      await connectWithUri(srvUri, 'srv');
      return;
    }
    await connectWithUri(directUri, 'direct');
  } catch (err) {
    if (srvUri && directUri && isSrvLookupError(err)) {
      console.warn('[db] SRV DNS lookup failed. Retrying with MONGODB_URI_DIRECT fallback...');
      try {
        await connectWithUri(directUri, 'direct fallback');
        return;
      } catch (fallbackErr) {
        console.error('[db] MongoDB direct fallback connection failed:', fallbackErr.message);
      }
    } else {
      console.error('[db] MongoDB connection failed:', err.message);
    }
    process.exit(1);
  }
};

module.exports = connectDB;
