// backend/routes/taskRoutes.js

import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Routes
router.post("/:kidId/tasks", protect, createTask); // Create a new task for a specific kid
router.get("/:kidId/tasks", protect, getTasks); // Get tasks for a specific kid
router.put("/:taskId", protect, updateTask); // Update a task by taskId
router.delete("/:kidId/tasks/:taskId", protect, deleteTask); // Delete a task by taskId for a specific kid

export default router;
