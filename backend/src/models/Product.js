import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    condition: { type: String, enum: ["new", "like-new", "good", "fair", "used"], required: true },
    images: [{ type: String, required: true }],
    brand: String,
    location: String,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.model("Product", productSchema);
