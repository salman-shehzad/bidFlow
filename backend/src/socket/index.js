import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import Notification from "../models/Notification.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next();
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next();
    }
  });

  io.on("connection", (socket) => {
    socket.on("auction:join", (auctionId) => socket.join(`auction:${auctionId}`));
    socket.on("auction:leave", (auctionId) => socket.leave(`auction:${auctionId}`));
  });

  setInterval(closeExpiredAuctions, 30000).unref();
  return io;
};

export const emitAuctionUpdate = (auctionId, payload) => {
  if (io) io.to(`auction:${auctionId}`).emit("bid:updated", payload);
};

const closeExpiredAuctions = async () => {
  const expired = await Auction.find({ status: "live", endTime: { $lte: new Date() } }).limit(25);
  for (const auction of expired) {
    const topBid = await Bid.findOne({ auction: auction._id }).sort("-amount");
    auction.status = "closed";
    auction.winner = topBid?.bidder;
    await auction.save();

    if (topBid?.bidder) {
      await Notification.create({
        user: topBid.bidder,
        type: "auction_won",
        title: "Auction won",
        message: `You won an auction with a bid of $${topBid.amount}.`,
        link: `/payment/${auction._id}`
      });
    }
    if (io) io.to(`auction:${auction._id}`).emit("auction:closed", { auction });
  }
};
