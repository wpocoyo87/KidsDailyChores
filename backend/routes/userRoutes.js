import express from "express";
import {
  getUserByEmail,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/users/register
router.post("/register", registerUser);

// POST /api/users/login
router.post("/login", loginUser);

// GET /api/users/profile/:email
router.get("/profile/:email", protect, getUserByEmail); // Use protect middleware here

export default router;
