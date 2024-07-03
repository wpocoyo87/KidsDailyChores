import express from "express";
const router = express.Router();
import {
  insertTask,
  getTasks,
  updateTaskCompletion,
} from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";

// Route to insert a new task for a kid
router.post("/:kidId/tasks", protect, insertTask); // Correct method is POST

// Route to get tasks for a kid
router.get("/:kidId/tasks", protect, getTasks); // Correct method is GET

// Route to update task completion
router.put("/:kidId/tasks/:taskId/completion", protect, updateTaskCompletion); // Correct method is PUT

export default router;
