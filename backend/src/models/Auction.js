import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startingPrice: { type: Number, required: true, min: 1 },
    reservePrice: { type: Number, min: 0, default: 0 },
    currentPrice: { type: Number, required: true, min: 0 },
    bidIncrement: { type: Number, min: 1, default: 5 },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true, index: true },
    status: { type: String, enum: ["draft", "scheduled", "live", "closed", "cancelled"], default: "scheduled", index: true },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    totalBids: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

auctionSchema.index({ status: 1, endTime: 1 });

export default mongoose.model("Auction", auctionSchema);
