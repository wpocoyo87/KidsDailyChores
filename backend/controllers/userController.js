import asyncHandler from "express-async-handler";
import {
  registerUserService,
  loginUserService,
  getUserByEmailService,
  addKidService,
  getKidsByUserIdService,
} from "../services/userService.js";
import User from "../models/UserModel.js";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, kids } = req.body;
  try {
    const user = await registerUserService({ username, email, password, kids });
    // Generate token (reuse login service logic)
    const { token } = await loginUserService(email, password);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      kids: user.kids,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await loginUserService(email, password);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      kids: user.kids,
      token,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("kids");
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// @desc    Get user by email
// @route   GET /api/users/profile/:email
// @access  Private
export const getUserByEmail = asyncHandler(async (req, res) => {
  try {
    const user = await getUserByEmailService(req.params.email);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// @desc    Get kids by user ID
// @route   GET /api/users/:userId/kids
// @access  Private
export const getKidsByUserId = asyncHandler(async (req, res) => {
  try {
    const kids = await getKidsByUserIdService(req.params.userId);
    res.json(kids);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
