const mongoose = require('mongoose');

// Disable command buffering so queries fail immediately when DB is not
// connected, rather than queuing for up to 10 seconds before timing out.
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[db] MONGODB_URI not set – database connection skipped.');
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log('[db] Connected to MongoDB Atlas');
  } catch (err) {
    console.error('[db] MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
