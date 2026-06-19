import Auction from "../models/Auction.js";
import Product from "../models/Product.js";
import Bid from "../models/Bid.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitAuctionUpdate } from "../socket/index.js";

const normalizeStatus = (auction) => {
  const now = new Date();
  if (auction.status !== "cancelled" && auction.status !== "closed") {
    if (auction.startTime <= now && auction.endTime > now) auction.status = "live";
    if (auction.endTime <= now) auction.status = "closed";
  }
  return auction;
};

export const listAuctions = asyncHandler(async (req, res) => {
  const { q, category, status, min, max } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (min || max) filter.currentPrice = { ...(min && { $gte: Number(min) }), ...(max && { $lte: Number(max) }) };

  let productIds;
  if (q || category) {
    const productFilter = {};
    if (q) productFilter.$text = { $search: q };
    if (category) productFilter.category = category;
    productIds = await Product.find(productFilter).distinct("_id");
    filter.product = { $in: productIds };
  }

  const auctions = await Auction.find(filter)
    .populate("product")
    .populate("seller", "name")
    .populate("winner", "name")
    .sort({ status: 1, endTime: 1 });
  res.json(auctions.map((auction) => normalizeStatus(auction)));
});

export const getAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
    .populate("product")
    .populate("seller", "name email")
    .populate("winner", "name");
  if (!auction) {
    res.status(404);
    throw new Error("Auction not found.");
  }
  const bids = await Bid.find({ auction: auction._id }).populate("bidder", "name").sort("-amount").limit(25);
  res.json({ auction: normalizeStatus(auction), bids });
});

export const createAuction = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.body.product, seller: req.user._id });
  if (!product) {
    res.status(404);
    throw new Error("Product not found for this seller.");
  }
  const startTime = new Date(req.body.startTime);
  const endTime = new Date(req.body.endTime);
  if (endTime <= startTime) {
    res.status(422);
    throw new Error("Auction end time must be after start time.");
  }
  const status = startTime <= new Date() ? "live" : "scheduled";
  const auction = await Auction.create({
    ...req.body,
    seller: req.user._id,
    startTime,
    endTime,
    currentPrice: req.body.startingPrice,
    status
  });
  res.status(201).json(await auction.populate("product"));
});

export const updateAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findOne({ _id: req.params.id, seller: req.user._id });
  if (!auction) {
    res.status(404);
    throw new Error("Auction not found.");
  }
  if (auction.totalBids > 0) {
    res.status(409);
    throw new Error("Auctions with bids cannot be edited.");
  }
  Object.assign(auction, req.body);
  normalizeStatus(auction);
  await auction.save();
  res.json(auction);
});

export const deleteAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findOne({ _id: req.params.id, seller: req.user._id });
  if (!auction) {
    res.status(404);
    throw new Error("Auction not found.");
  }
  if (auction.totalBids > 0) auction.status = "cancelled";
  else await auction.deleteOne();
  if (auction.totalBids > 0) await auction.save();
  res.json({ message: "Auction removed." });
});

export const placeBid = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) {
    res.status(404);
    throw new Error("Auction not found.");
  }

  normalizeStatus(auction);
  if (auction.status !== "live") throw new Error("Auction is not live.");
  if (String(auction.seller) === String(req.user._id)) throw new Error("Sellers cannot bid on their own auctions.");

  const amount = Number(req.body.amount);
  const minimum = auction.currentPrice + auction.bidIncrement;
  if (amount < minimum) throw new Error(`Minimum bid is ${minimum}.`);

  const previousBid = await Bid.findOne({ auction: auction._id }).sort("-amount");
  const now = new Date();
  const updatedAuction = await Auction.findOneAndUpdate(
    {
      _id: auction._id,
      status: { $nin: ["closed", "cancelled"] },
      startTime: { $lte: now },
      endTime: { $gt: now },
      currentPrice: { $lte: amount - auction.bidIncrement }
    },
    {
      $set: { currentPrice: amount, status: "live" },
      $inc: { totalBids: 1 }
    },
    { new: true }
  );

  if (!updatedAuction) {
    const latestAuction = await Auction.findById(req.params.id);
    if (!latestAuction) {
      res.status(404);
      throw new Error("Auction not found.");
    }
    normalizeStatus(latestAuction);
    const latestMinimum = latestAuction.currentPrice + latestAuction.bidIncrement;
    throw new Error(latestAuction.status === "live" ? `Minimum bid is ${latestMinimum}.` : "Auction is not live.");
  }

  const bid = await Bid.create({ auction: updatedAuction._id, bidder: req.user._id, amount });

  if (previousBid && String(previousBid.bidder) !== String(req.user._id)) {
    await Notification.create({
      user: previousBid.bidder,
      type: "outbid",
      title: "You were outbid",
      message: `A higher bid of $${amount} was placed.`,
      link: `/auctions/${updatedAuction._id}`
    });
  }

  const populated = await Bid.findById(bid._id).populate("bidder", "name");
  emitAuctionUpdate(String(updatedAuction._id), { auction: updatedAuction, bid: populated });
  res.status(201).json({ auction: updatedAuction, bid: populated });
});

export const bidHistory = asyncHandler(async (req, res) => {
  const bids = await Bid.find({ auction: req.params.id }).populate("bidder", "name").sort("-createdAt");
  res.json(bids);
});

export const sellerDashboard = asyncHandler(async (req, res) => {
  const auctions = await Auction.find({ seller: req.user._id }).populate("product").sort("-createdAt");
  const revenue = auctions.filter((a) => a.status === "closed" && a.winner).reduce((sum, a) => sum + a.currentPrice, 0);
  res.json({ auctions, stats: { auctions: auctions.length, revenue, active: auctions.filter((a) => a.status === "live").length } });
});

export const buyerDashboard = asyncHandler(async (req, res) => {
  const bids = await Bid.find({ bidder: req.user._id }).populate({ path: "auction", populate: { path: "product" } }).sort("-createdAt");
  const won = await Auction.find({ winner: req.user._id }).populate("product").sort("-updatedAt");
  res.json({ bids, won });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const id = req.params.id;
  const exists = user.wishlist.some((item) => String(item) === id);
  user.wishlist = exists ? user.wishlist.filter((item) => String(item) !== id) : [...user.wishlist, id];
  await user.save();
  res.json({ wishlist: user.wishlist });
});
