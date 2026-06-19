import express from "express";
import { createProduct, myProducts, updateProduct } from "../controllers/product.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { uploadImages } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { productRules } from "../validators/auction.validators.js";

const router = express.Router();

router.use(protect, authorize("seller", "admin"));
router.route("/").post(uploadImages, productRules, validate, createProduct).get(myProducts);
router.put("/:id", uploadImages, updateProduct);

export default router;
