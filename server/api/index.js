import app from '../src/app.js';
import connectDB from '../src/db/index.js';

let isConnected = false;

export default async function handler(req, res) {
  // Set proper headers for file uploads
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  return app(req, res);
}
