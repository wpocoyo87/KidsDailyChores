import {
  createKidService,
  getKidByIdService,
  updateKidPointsService,
  getKidPointsService,
  addTasksService,
  getTasksService,
  deleteTaskService,
  updateTaskCompletionService,
} from "../services/kidService.js";
import { addKidService } from "../services/userService.js";
import asyncHandler from "express-async-handler";

console.log("kidController.js loaded");

export const createKid = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { name, birthDate, selectedAvatar, gender } = req.body;

  // Calculate age
  const age = new Date().getFullYear() - new Date(birthDate).getFullYear();

  try {
    const newKid = await createKidService(userId, {
      name,
      birthDate,
      selectedAvatar,
      age,
      gender,
    });
    res.status(201).json({ message: "Kid added successfully", kid: newKid });
  } catch (error) {
    console.error("Error adding kid:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export const getKidById = asyncHandler(async (req, res) => {
  const { kidId } = req.params;
  const { _id: userId } = req.user;

  try {
    const kid = await getKidByIdService(userId, kidId);
    res.status(200).json(kid);
  } catch (error) {
    console.error("Error fetching kid:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export const updateKidPoints = asyncHandler(async (req, res) => {
  const { kidId } = req.params;
  const { points } = req.body;
  const { _id: userId } = req.user;

  try {
    const kid = await updateKidPointsService(userId, kidId, points);
    res.status(200).json({ message: "Points updated successfully", kid });
  } catch (error) {
    console.error("Error updating points:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export const getKidPoints = asyncHandler(async (req, res) => {
  const { kidId } = req.params;

  try {
    const kid = await getKidPointsService(kidId);
    if (kid) {
      res.status(200).json({ points: kid.points });
    } else {
      res.status(404).json({ error: "Kid not found" });
    }
  } catch (error) {
    console.error("Error fetching kid points:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export const addTasks = asyncHandler(async (req, res) => {
  const { kidId } = req.params;
  const { tasks } = req.body;
  const { _id: userId } = req.user;

  try {
    console.log(`Adding tasks for kidId: ${kidId}, userId: ${userId}`);
    console.log(`Tasks: ${JSON.stringify(tasks)}`);

    const kid = await getKidByIdService(userId, kidId);
    if (!kid) {
      return res.status(404).json({ message: "Kid not found" });
    }

    if (!kid.age || !kid.gender) {
      return res
        .status(400)
        .json({ message: "Kid age and gender are required" });
    }

    const updatedKid = await addTasksService(userId, kidId, tasks);
    res
      .status(201)
      .json({ message: "Tasks added successfully", kid: updatedKid });
  } catch (error) {
    console.error("Error adding tasks:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export const getTasks = asyncHandler(async (req, res) => {
  const { kidId } = req.params;
  const { date } = req.query;

  console.log(`Fetching tasks for kidId: ${kidId}, date: ${date}`);

  try {
    const tasks = await getTasksService(kidId, date);
    console.log(`Tasks found: ${tasks.length}`);

    if (tasks.length > 0) {
      res.status(200).json(tasks);
    } else {
      console.log("Tasks not found");
      res.status(404).json({ error: "Tasks not found" });
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { kidId, taskId } = req.params;
  const { _id: userId } = req.user;

  try {
    console.log(
      `Deleting task with taskId: ${taskId} for kidId: ${kidId}, userId: ${userId}`
    );

    const updatedKid = await deleteTaskService(userId, kidId, taskId);
    res
      .status(200)
      .json({ message: "Task deleted successfully", kid: updatedKid });
  } catch (error) {
    console.error("Error deleting task:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export const updateTaskCompletion = asyncHandler(async (req, res) => {
  const { kidId, taskId } = req.params;
  const { completed } = req.body;
  const { _id: userId } = req.user;

  try {
    console.log(
      `Updating task completion with taskId: ${taskId} for kidId: ${kidId}, userId: ${userId}`
    );

    const updatedKid = await updateTaskCompletionService(
      userId,
      kidId,
      taskId,
      completed
    );
    res.status(200).json({
      message: "Task completion updated successfully",
      kid: updatedKid,
    });
  } catch (error) {
    console.error("Error updating task completion:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export const addKid = asyncHandler(async (req, res) => {
  const { name, gender, birthDate, selectedAvatar } = req.body;
  const userId = req.user._id;

  if (!name || !gender || !birthDate || !selectedAvatar) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const newKid = await addKidService(userId, {
      name,
      birthDate,
      selectedAvatar,
      gender,
    });
    res.status(201).json(newKid);
  } catch (error) {
    console.error("Error adding kid:", error);
    res.status(500).json({ message: error.message });
  }
});
