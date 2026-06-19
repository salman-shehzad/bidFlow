import express from "express";
import { listTransactions, payForAuction } from "../controllers/transaction.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, listTransactions);
router.post("/pay/:auctionId", protect, payForAuction);

export default router;
