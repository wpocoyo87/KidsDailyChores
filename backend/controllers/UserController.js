import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import { generateToken } from "../config/authConfig.js";

// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, kids } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const user = await User.create({
    username,
    email,
    password,
    kids,
  });

  const token = generateToken(user._id);

  res
    .status(201)
    .json({ message: "User registered successfully", user, token });
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.status(200).json({ message: "Login successful", user, token });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// Get user by email
export const getUserByEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.params.email });

  if (user) {
    res.json(user); // Return user if found
  } else {
    res.status(404).json({ message: "User not found" }); // Handle user not found case
  }
});
