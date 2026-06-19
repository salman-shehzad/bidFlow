import express from "express";
import { listNotifications, markRead } from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, listNotifications);
router.patch("/:id/read", protect, markRead);

export default router;
