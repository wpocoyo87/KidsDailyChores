//backend/routes/kidRoutes.js

import express from "express";
import {
  createKid,
  getAllKids,
  getKidById,
  updateKid,
  deleteKid,
  getTasksForKid,
  addTaskToKid,
  updateTaskForKid,
  deleteTaskForKid,
} from "../controllers/kidController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getPointsByKidId } from "../controllers/pointsController.js";

const router = express.Router();

router.route("/").post(protect, createKid).get(protect, getAllKids);
router
  .route("/:id")
  .get(protect, getKidById)
  .put(protect, updateKid)
  .delete(protect, deleteKid);
router
  .route("/:id/tasks")
  .get(protect, getTasksForKid)
  .post(protect, addTaskToKid);
router
  .route("/:id/tasks/:taskId")
  .put(protect, updateTaskForKid)
  .delete(protect, deleteTaskForKid);

router.route("/:kidId/points").get(protect, getPointsByKidId);

export { router };
