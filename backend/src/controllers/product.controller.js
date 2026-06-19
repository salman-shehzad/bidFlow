import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const images = (req.files || []).map((file) => `/uploads/${file.filename}`);
  const product = await Product.create({ ...req.body, images, seller: req.user._id });
  res.status(201).json(product);
});

export const myProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort("-createdAt");
  res.json(products);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }
  Object.assign(product, req.body);
  if (req.files?.length) product.images = req.files.map((file) => `/uploads/${file.filename}`);
  await product.save();
  res.json(product);
});
