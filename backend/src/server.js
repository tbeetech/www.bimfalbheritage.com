require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

// cPanel Node.js Selector injects PORT via environment; fall back to 3000 for local dev.
const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
