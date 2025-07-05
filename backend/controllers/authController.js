import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const { JWT_SECRET } = process.env;

// Controller function for user login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if account is locked
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingTime = Math.ceil(
        (user.lockoutUntil - new Date()) / (1000 * 60)
      ); // minutes
      return res.status(423).json({
        message: `Account is locked due to too many failed attempts. Please try again in ${remainingTime} minutes.`,
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      // Increment failed attempts
      user.failedLoginAttempts += 1;
      user.lastFailedLogin = new Date();

      // Lock account after 3 failed attempts
      if (user.failedLoginAttempts >= 3) {
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await user.save();
        return res.status(423).json({
          message:
            "Too many failed login attempts. Account locked for 15 minutes. Please try again later.",
        });
      }

      await user.save();
      return res.status(401).json({
        message: `Invalid credentials. ${
          3 - user.failedLoginAttempts
        } attempts remaining.`,
      });
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;
    user.lastFailedLogin = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({ token, _id: user._id, kids: user.kids });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function for user registration
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
