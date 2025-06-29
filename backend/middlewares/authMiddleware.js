import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Kid from "../models/KidModel.js";

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

      // Check if this is a kid token or parent token
      if (decoded.role === 'kid') {
        // Fetch kid from database
        req.kid = await Kid.findById(decoded.id).select("-kidPin");
        console.log("Authenticated kid:", req.kid); // Debug log

        if (!req.kid || !req.kid.isActive) {
          res.status(401);
          throw new Error("Not authorized, kid not found or inactive");
        }
        
        req.userRole = 'kid';
        req.parentId = decoded.parentId;
      } else {
        // Fetch parent user from database
        req.user = await User.findById(decoded.id).select("-password");
        console.log("Authenticated user:", req.user); // Debug log

        if (!req.user || !req.user.isActive) {
          res.status(401);
          throw new Error("Not authorized, user not found or inactive");
        }
        
        req.userRole = 'parent';
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

// Middleware to restrict access to parents only
export const parentOnly = asyncHandler(async (req, res, next) => {
  if (req.userRole !== 'parent') {
    res.status(403).json({ message: "Access denied. Parents only." });
    return;
  }
  next();
});

// Middleware to restrict access to kids only
export const kidOnly = asyncHandler(async (req, res, next) => {
  if (req.userRole !== 'kid') {
    res.status(403).json({ message: "Access denied. Kids only." });
    return;
  }
  next();
});

// Middleware to allow both parents and kids
export const parentOrKid = asyncHandler(async (req, res, next) => {
  if (req.userRole !== 'parent' && req.userRole !== 'kid') {
    res.status(403).json({ message: "Access denied. Invalid role." });
    return;
  }
  next();
});
