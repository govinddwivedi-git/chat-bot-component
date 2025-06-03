import app from '../src/app.js'; // adjust if needed
import connectDB from '../src/db/index.js'; // adjust path

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  return app(req, res); // let Express handle the request
}
