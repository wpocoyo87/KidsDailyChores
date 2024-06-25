//backend/routes/kidRoutes.js

const express = require("express");
const router = express.Router();
const Kid = require("../models/kidModel");
const Task = require("../models/taskModel");

// Get kid details along with tasks
router.get("/:id", async (req, res) => {
  try {
    const kid = await Kid.findById(req.params.id).populate("tasks");
    res.json(kid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Example: Add a task to a kid
router.post("/:id/tasks", async (req, res) => {
  const { taskName } = req.body;
  const kidId = req.params.id;

  try {
    // Create a new task
    const newTask = new Task({ name: taskName });
    await newTask.save();

    // Find the kid by id and push the new task's id into tasks array
    const kid = await Kid.findById(kidId);
    if (!kid) {
      return res.status(404).json({ message: "Kid not found" });
    }
    kid.tasks.push(newTask._id);
    await kid.save();

    res
      .status(201)
      .json({ message: "Task added to kid successfully", task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Other kid routes...

module.exports = router;
