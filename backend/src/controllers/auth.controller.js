import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/token.js";

const authPayload = (user) => ({
  token: signToken(user),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    wishlist: user.wishlist
  }
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("Email is already registered.");
  }

  const user = await User.create({ name, email, password, role: role || "buyer" });
  res.status(201).json(authPayload(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }
  if (!user.isActive) {
    res.status(403);
    throw new Error("This account has been disabled.");
  }
  res.json(authPayload(user));
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
