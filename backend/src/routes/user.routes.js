import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/profile", protect, asyncHandler(async (req, res) => res.json(req.user)));
router.put("/profile", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  Object.assign(user, {
    name: req.body.name ?? user.name,
    phone: req.body.phone ?? user.phone,
    address: req.body.address ?? user.address
  });
  await user.save();
  res.json(await User.findById(user._id).select("-password"));
}));

export default router;
