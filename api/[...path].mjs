import app from "../backend/src/app.js";
import connectDB from "../backend/src/config/db.js";

let dbReady;

const ensureDB = () => {
  if (!dbReady) dbReady = connectDB();
  return dbReady;
};

export default async function handler(req, res) {
  await ensureDB();

  if (req.url?.startsWith("/api/uploads/")) {
    req.url = req.url.replace(/^\/api\/uploads/, "/uploads");
  }

  return app(req, res);
}
