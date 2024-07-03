import express from "express";
const router = express.Router();
import { protect } from "../middlewares/authMiddleware.js";
import {
  createKid,
  getKidById,
  updateKidPoints,
  getKidPoints,
  addTasks,
  getTasks,
  deleteTask,
  updateTaskCompletion,
  addKid,
} from "../controllers/kidController.js";

console.log("kidRoutes.js loaded");

router
  .route("/:kidId/tasks")
  .get(protect, (req, res) => {
    console.log("GET /api/kids/:kidId/tasks route hit");
    getTasks(req, res);
  })
  .post(protect, (req, res) => {
    console.log("POST /api/kids/:kidId/tasks route hit");
    addTasks(req, res);
  });

router.route("/:kidId/tasks/:taskId").delete(protect, (req, res) => {
  console.log("DELETE /api/kids/:kidId/tasks/:taskId route hit");
  deleteTask(req, res);
});

router.route("/:kidId/tasks/:taskId/completion").put(protect, (req, res) => {
  console.log("PUT /api/kids/:kidId/tasks/:taskId/completion route hit");
  updateTaskCompletion(req, res);
});

router
  .route("/:kidId/points")
  .put(protect, (req, res) => {
    console.log("PUT /api/kids/:kidId/points route hit");
    updateKidPoints(req, res);
  })
  .get(protect, (req, res) => {
    console.log("GET /api/kids/:kidId/points route hit");
    getKidPoints(req, res);
  });

router
  .route("/:kidId")
  .get(protect, (req, res) => {
    console.log("GET /api/kids/:kidId route hit");
    getKidById(req, res);
  })
  .put(protect, (req, res) => {
    console.log("PUT /api/kids/:kidId route hit");
    updateKidPoints(req, res);
  });

router.route("/").post(protect, (req, res) => {
  console.log("POST /api/kids/ route hit");
  createKid(req, res);
});

router.post("/add", protect, (req, res) => {
  console.log("POST /api/kids/add route hit");
  addKid(req, res);
});
//I apply console log to retrieve the defect
export default router;
