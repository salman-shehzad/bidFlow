import { body, query } from "express-validator";

export const productRules = [
  body("title").trim().isLength({ min: 3, max: 140 }).withMessage("Product title must be 3 to 140 characters."),
  body("description").trim().isLength({ min: 5 }).withMessage("Product description must be at least 5 characters."),
  body("category").trim().notEmpty().withMessage("Product category is required."),
  body("condition").isIn(["new", "like-new", "good", "fair", "used"]).withMessage("Choose a valid product condition.")
];

export const auctionRules = [
  body("product").isMongoId(),
  body("startingPrice").isFloat({ min: 1 }),
  body("reservePrice").optional().isFloat({ min: 0 }),
  body("bidIncrement").optional().isFloat({ min: 1 }),
  body("startTime").isISO8601(),
  body("endTime").isISO8601()
];

export const bidRules = [body("amount").isFloat({ min: 1 })];

export const auctionQueryRules = [
  query("q").optional().trim().escape(),
  query("category").optional().trim().escape(),
  query("status").optional().isIn(["scheduled", "live", "closed"]),
  query("min").optional().isFloat({ min: 0 }),
  query("max").optional().isFloat({ min: 0 })
];
