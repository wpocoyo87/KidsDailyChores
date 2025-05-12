// backend/routes/userRoutes.js

import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  getUserById,
  getUserByEmail,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", protect, getUserById);
router.get("/profile/:email", protect, getUserByEmail);
router.get("/test", (req, res) => res.json({ msg: "User route OK" }));

export default router;
