import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";

// Middleware to protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token found:", token); // Debug log
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debug log

      // Fetch user from database using decoded user ID
      req.user = await User.findById(decoded.id).select("-password");
      console.log("Authenticated user:", req.user); // Debug log

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      next(); // Move to the next middleware
    } catch (error) {
      console.log("Error in protect middleware:", error); // Debug log
      res.status(401).json({ message: "Not authorized, token failed" });
      return; // Stop further execution
    }
  } else {
    console.log("No authorization header found"); // Debug log
    res.status(401).json({ message: "Not authorized, no token" });
    return; // Stop further execution
  }
});
