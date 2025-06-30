import express from "express";
const router = express.Router();
import { protect, parentOnly, parentOrKid } from "../middlewares/authMiddleware.js";
import {
  createKid,
  getKidById,
  updateKidPoints,
  getKidPoints,
  addTasks,
  getTasks,
  deleteTask,
  updateTaskCompletion,
  markTaskComplete,
  addKid,
  setKidPin,
  removeKidPin,
  kidLogin,
  getKidsByParentEmail,
  fixAllKidsTaskFields,
} from "../controllers/kidController.js";

console.log("kidRoutes.js loaded");

router
  .route("/:kidId/tasks")
  .get(protect, parentOrKid, (req, res) => {
    console.log("GET /api/kids/:kidId/tasks route hit");
    getTasks(req, res);
  })
  .post(protect, parentOnly, (req, res) => {
    console.log("POST /api/kids/:kidId/tasks route hit");
    addTasks(req, res);
  });

router.route("/:kidId/tasks/:taskId").delete(protect, parentOnly, (req, res) => {
  console.log("DELETE /api/kids/:kidId/tasks/:taskId route hit");
  deleteTask(req, res);
});

router.route("/:kidId/tasks/:taskId/completion").put(protect, parentOrKid, (req, res) => {
  console.log("PUT /api/kids/:kidId/tasks/:taskId/completion route hit");
  updateTaskCompletion(req, res);
});

// Route for kids to mark tasks as complete
router.route("/tasks/:taskId/complete").patch(protect, parentOrKid, (req, res) => {
  console.log("PATCH /api/kids/tasks/:taskId/complete route hit");
  markTaskComplete(req, res);
});

router
  .route("/:kidId/points")
  .put(protect, parentOnly, (req, res) => {
    console.log("PUT /api/kids/:kidId/points route hit");
    updateKidPoints(req, res);
  })
  .get(protect, parentOrKid, (req, res) => {
    console.log("GET /api/kids/:kidId/points route hit");
    getKidPoints(req, res);
  });

router
  .route("/:kidId")
  .get(protect, parentOrKid, (req, res) => {
    console.log("GET /api/kids/:kidId route hit");
    getKidById(req, res);
  })
  .put(protect, parentOnly, (req, res) => {
    console.log("PUT /api/kids/:kidId route hit");
    updateKidPoints(req, res);
  });

router.route("/").post(protect, parentOnly, (req, res) => {
  console.log("POST /api/kids/ route hit");
  createKid(req, res);
});

router.post("/add", protect, parentOnly, (req, res) => {
  console.log("POST /api/kids/add route hit");
  addKid(req, res);
});

// Kids by parent email - No authentication required for this public endpoint
router.route("/by-parent-email")
  .post((req, res) => {
    console.log("POST /api/kids/by-parent-email route hit");
    getKidsByParentEmail(req, res);
  });

// Kids Authentication Routes - Parent only for PIN management
router.route("/:kidId/pin")
  .post(protect, parentOnly, (req, res) => {
    console.log("POST /api/kids/:kidId/pin route hit");
    setKidPin(req, res);
  })
  .delete(protect, parentOnly, (req, res) => {
    console.log("DELETE /api/kids/:kidId/pin route hit");
    removeKidPin(req, res);
  });

// Kids login - No authentication required for login attempt
router.route("/login")
  .post((req, res) => {
    console.log("POST /api/kids/login route hit");
    kidLogin(req, res);
  });

// Utility route to fix database issues
router.route("/fix-task-fields")
  .post((req, res) => {
    console.log("POST /api/kids/fix-task-fields route hit");
    fixAllKidsTaskFields(req, res);
  });

// I apply console log to retrieve the defect
export default router;
