import asyncHandler from "express-async-handler";
import { generateToken } from "../config/authConfig.js";
import {
  registerUserService,
  loginUserService,
  getUserByEmailService,
} from "../services/userService.js";
import User from "../models/UserModel.js";

// Controller to register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, kids } = req.body;

  console.log("Received data:", req.body);

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res
        .status(400)
        .json({ message: "User with this username already exists" });
    }

    const newUser = await registerUserService(username, email, password, kids);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      kids: newUser.kids,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Controller to login a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await loginUserService(email, password);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      kids: user.kids,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ message: error.message });
  }
});

// Controller to get user by email
const getUserByEmail = asyncHandler(async (req, res) => {
  try {
    const user = await getUserByEmailService(req.params.email);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Controller to get user by ID
const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("kids")
      .select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export { registerUser, loginUser, getUserByEmail, getUserById };
