import User from "../models/User.js";
import Auction from "../models/Auction.js";
import Transaction from "../models/Transaction.js";
import Bid from "../models/Bid.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const analytics = asyncHandler(async (_req, res) => {
  const [users, auctions, bids, transactions] = await Promise.all([
    User.countDocuments(),
    Auction.countDocuments(),
    Bid.countDocuments(),
    Transaction.find({ status: "paid" })
  ]);
  const revenue = transactions.reduce((sum, tx) => sum + tx.platformFee, 0);
  const paidVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  res.json({ users, auctions, bids, revenue, paidVolume, transactions: transactions.length });
});

export const listUsers = asyncHandler(async (_req, res) => {
  res.json(await User.find().select("-password").sort("-createdAt"));
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true }).select("-password");
  res.json(user);
});

export const listAllAuctions = asyncHandler(async (_req, res) => {
  res.json(await Auction.find().populate("product seller winner", "title name email").sort("-createdAt"));
});

export const moderateAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(auction);
});
