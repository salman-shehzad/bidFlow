import http from "http";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import { initSocket } from "./src/socket/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "./.env") });

const PORT = process.env.PORT || 5000;

await connectDB();

const server = http.createServer(app);
initSocket(server);

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the existing server or set a different PORT in backend/.env.`);
    process.exit(1);
  }

  console.error(`Server failed to start: ${error.message}`);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`BidFlow API running on port ${PORT}`);
});
