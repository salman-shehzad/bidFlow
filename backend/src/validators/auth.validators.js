import { body } from "express-validator";

export const registerRules = [
  body("name").trim().isLength({ min: 2, max: 80 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("role").optional().isIn(["buyer", "seller"])
];

export const loginRules = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty()
];
