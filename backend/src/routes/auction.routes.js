import express from "express";
import {
  bidHistory,
  buyerDashboard,
  createAuction,
  deleteAuction,
  getAuction,
  listAuctions,
  placeBid,
  sellerDashboard,
  toggleWishlist,
  updateAuction
} from "../controllers/auction.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { auctionQueryRules, auctionRules, bidRules } from "../validators/auction.validators.js";

const router = express.Router();

router.get("/", auctionQueryRules, validate, listAuctions);
router.get("/seller/dashboard", protect, authorize("seller", "admin"), sellerDashboard);
router.get("/buyer/dashboard", protect, authorize("buyer", "admin"), buyerDashboard);
router.get("/:id", getAuction);
router.get("/:id/bids", bidHistory);
router.post("/", protect, authorize("seller", "admin"), auctionRules, validate, createAuction);
router.put("/:id", protect, authorize("seller", "admin"), updateAuction);
router.delete("/:id", protect, authorize("seller", "admin"), deleteAuction);
router.post("/:id/bids", protect, authorize("buyer", "admin"), bidRules, validate, placeBid);
router.post("/:id/wishlist", protect, authorize("buyer", "admin"), toggleWishlist);

export default router;
