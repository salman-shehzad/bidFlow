import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 1 },
    platformFee: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    paymentMethod: { type: String, default: "mock-card" },
    reference: { type: String, unique: true }
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
