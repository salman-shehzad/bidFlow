import app from "../backend/app.js";
import connectDB from "../backend/src/config/db.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.url?.startsWith("/api/uploads/")) {
    req.url = req.url.replace(/^\/api\/uploads/, "/uploads");
  }

  return app(req, res);
}
