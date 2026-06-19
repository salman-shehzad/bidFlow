import Auction from "../models/Auction.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listTransactions = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? {} : { $or: [{ buyer: req.user._id }, { seller: req.user._id }] };
  const transactions = await Transaction.find(query).populate("auction buyer seller", "name email product currentPrice").sort("-createdAt");
  res.json(transactions);
});

export const payForAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.auctionId).populate("product");
  if (!auction || String(auction.winner) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only the auction winner can pay.");
  }
  const existing = await Transaction.findOne({ auction: auction._id, buyer: req.user._id });
  if (existing?.status === "paid") return res.json(existing);

  const amount = auction.currentPrice;
  const transaction = existing || new Transaction({
    auction: auction._id,
    buyer: req.user._id,
    seller: auction.seller,
    amount,
    platformFee: Number((amount * 0.05).toFixed(2)),
    reference: `BF-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  });
  transaction.status = "paid";
  await transaction.save();

  await Notification.create({
    user: auction.seller,
    type: "payment",
    title: "Payment received",
    message: `Payment completed for ${auction.product.title}.`,
    link: `/seller`
  });

  res.status(201).json(transaction);
});
