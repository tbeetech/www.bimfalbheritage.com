// Vercel Serverless Function – wraps the Express app so all /api/* requests
// are handled by the same Express router that runs locally on Node.js.
//
// Environment variables (set in Vercel Project → Settings → Environment Variables):
//   MONGODB_URI       – MongoDB Atlas connection string (required)
//   JWT_SECRET        – JWT signing secret (required)
//   ADMIN_PASSWORD    – Admin panel password (required)
//   NODE_ENV          – Set to "production" by Vercel automatically
//
// Do NOT set SERVE_FRONTEND=true here – Vercel serves the static React build
// directly from the CDN; Express only handles /api/* requests.

const connectDB = require('../backend/src/config/db');
const app = require('../backend/src/app');

// Track whether the DB connection has been established in this serverless function instance.
// Vercel reuses warm function instances across requests, so we only connect once.
let connected = false;

const handler = async (req, res) => {
  if (!connected) {
    await connectDB();
    connected = true;
  }
  return app(req, res);
};

module.exports = handler;
