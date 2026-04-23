/**
 * server.js — Application entry point.
 *
 * This is the file that Node.js executes to start the server (see "main" and
 * "start"/"dev" scripts in package.json).  It is responsible for:
 *   1. Loading environment variables (.env).
 *   2. Connecting to MongoDB.
 *   3. Creating the HTTP server around the Express app defined in app.js.
 *   4. Binding the server to the configured PORT.
 *
 * app.js is NOT the entry point — it only configures and exports the Express
 * application object so that it can be imported here and in tests.
 */
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
