import express from "express";
import { analytics, listAllAuctions, listUsers, moderateAuction, updateUserStatus } from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/analytics", analytics);
router.get("/users", listUsers);
router.patch("/users/:id/status", updateUserStatus);
router.get("/auctions", listAllAuctions);
router.patch("/auctions/:id/status", moderateAuction);

export default router;
