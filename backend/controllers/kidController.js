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
import Kid from "../models/KidModel.js";
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
  
  try {
    let kid;
    
    if (req.userRole === 'kid') {
      // Kids can only access their own data
      if (!req.kid) {
        return res.status(401).json({ error: "Kid authentication required" });
      }
      
      kid = await Kid.findById(kidId);
      if (!kid || kid._id.toString() !== req.kid._id.toString()) {
        return res.status(404).json({ error: "Kid not found" });
      }
    } else if (req.userRole === 'parent') {
      // Parents can access their kids' data
      if (!req.user) {
        return res.status(401).json({ error: "Parent authentication required" });
      }
      
      const { _id: userId } = req.user;
      kid = await getKidByIdService(userId, kidId);
    } else {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    res.status(200).json({
      _id: kid._id,
      name: kid.name,
      gender: kid.gender,
      birthDate: kid.birthDate,
      selectedAvatar: kid.selectedAvatar,
      totalPoints: kid.totalPoints || 0,
      tasks: kid.tasks
    });
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
    // Check authentication based on role
    if (req.userRole === 'kid') {
      if (!req.kid) {
        return res.status(401).json({ 
          success: false, 
          error: "Kid authentication required" 
        });
      }
      
      // Kids can only access their own tasks
      if (kidId !== req.kid._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          error: "Access denied" 
        });
      }
    } else if (req.userRole === 'parent') {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          error: "Parent authentication required" 
        });
      }
    } else {
      return res.status(401).json({ 
        success: false, 
        error: "Authentication required" 
      });
    }

    // If no date provided, get all tasks for the kid
    if (!date) {
      const kid = await Kid.findById(kidId);
      if (!kid) {
        return res.status(404).json({ 
          success: false, 
          error: "Kid not found" 
        });
      }

      console.log(`All tasks found: ${kid.tasks.length}`);
      return res.status(200).json({
        success: true,
        tasks: kid.tasks,
        kid: {
          _id: kid._id,
          name: kid.name,
          totalPoints: kid.totalPoints || 0
        }
      });
    }

    // If date provided, filter by date
    const tasks = await getTasksService(kidId, date);
    console.log(`Tasks found: ${tasks.length}`);

    if (tasks.length > 0) {
      res.status(200).json({
        success: true,
        tasks: tasks
      });
    } else {
      console.log("Tasks not found");
      res.status(404).json({ 
        success: false, 
        error: "Tasks not found" 
      });
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
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

// New function for kids to mark task as complete directly
export const markTaskComplete = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  try {
    let kidId;
    
    // Check authentication based on role
    if (req.userRole === 'kid') {
      if (!req.kid) {
        return res.status(401).json({ 
          success: false, 
          message: "Kid authentication required" 
        });
      }
      kidId = req.kid._id;
    } else if (req.userRole === 'parent') {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: "Parent authentication required" 
        });
      }
      // For parents, we would need kidId from request params, but this endpoint is mainly for kids
      return res.status(403).json({ 
        success: false, 
        message: "This endpoint is for kids only" 
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    console.log(`Kid ${kidId} marking task ${taskId} as complete`);

    // Find the kid and task
    const kid = await Kid.findById(kidId);
    
    if (!kid) {
      return res.status(404).json({ 
        success: false, 
        message: "Kid not found" 
      });
    }

    const task = kid.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: "Task not found" 
      });
    }

    if (task.isCompleted) {
      return res.status(400).json({ 
        success: false, 
        message: "Task already completed" 
      });
    }

    // Mark task as complete
    task.isCompleted = true;
    task.completedAt = new Date();

    // Update total points
    const taskPoints = task.points || 10;
    kid.totalPoints = (kid.totalPoints || 0) + taskPoints;

    await kid.save();

    res.status(200).json({
      success: true,
      message: "Task completed successfully!",
      task: task,
      kid: {
        _id: kid._id,
        name: kid.name,
        totalPoints: kid.totalPoints
      }
    });
  } catch (error) {
    console.error("Error marking task complete:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error completing task" 
    });
  }
});

export const addKid = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const kidData = req.body;
  console.log(`User ID received: ${userId}`);
  console.log(`Kid data received: ${JSON.stringify(kidData)}`);

  try {
    const newKid = await addKidService(userId, kidData);
    res.status(201).json(newKid);
  } catch (error) {
    console.error("Error adding kid:", error);
    res.status(500).json({ message: error.message });
  }
});

export const getKidsByParentEmail = asyncHandler(async (req, res) => {
  const { parentEmail } = req.body;
  console.log(`Getting kids for parent email: ${parentEmail}`);

  try {
    if (!parentEmail) {
      return res.status(400).json({
        success: false,
        error: "Parent email is required",
      });
    }

    // First find the parent user by email
    const User = (await import("../models/UserModel.js")).default;
    const parent = await User.findOne({ email: parentEmail });

    if (!parent) {
      return res.status(404).json({
        success: false,
        error: "Parent not found with this email",
      });
    }

    // Then find kids that belong to this parent and have PIN set
    const Kid = (await import("../models/KidModel.js")).default;
    const kids = await Kid.find({
      parent: parent._id,
      kidPin: { $exists: true, $ne: null },
    }).select("-kidPin"); // Don't send PIN in response

    console.log(`Found ${kids.length} kids for parent ${parentEmail}`);

    res.status(200).json({
      success: true,
      kids: kids.map((kid) => ({
        ...kid.toObject(),
        hasPinSet: kid.kidPin ? true : false,
      })),
    });
  } catch (error) {
    console.error("Error getting kids by parent email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get kids data",
    });
  }
});

export const setKidPin = asyncHandler(async (req, res) => {
  const { kidId, pin } = req.body;
  console.log(`Setting PIN for kid: ${kidId}`);

  try {
    if (!kidId || !pin) {
      return res.status(400).json({
        success: false,
        error: "Kid ID and PIN are required",
      });
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        error: "PIN must be exactly 4 digits",
      });
    }

    const Kid = (await import("../models/KidModel.js")).default;
    const kid = await Kid.findById(kidId);

    if (!kid) {
      return res.status(404).json({
        success: false,
        error: "Kid not found",
      });
    }

    // Verify that the kid belongs to the authenticated parent
    if (kid.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to set PIN for this kid",
      });
    }

    await kid.setKidPin(pin);
    console.log(`PIN set successfully for kid: ${kid.name}`);

    res.status(200).json({
      success: true,
      message: "PIN set successfully",
      kid: {
        _id: kid._id,
        name: kid.name,
        hasPinSet: true,
      },
    });
  } catch (error) {
    console.error("Error setting kid PIN:", error);
    res.status(500).json({
      success: false,
      error: "Failed to set PIN",
    });
  }
});

export const kidLogin = asyncHandler(async (req, res) => {
  const { kidId, pin } = req.body;
  console.log(`Kid login attempt for: ${kidId}`);

  try {
    if (!kidId || !pin) {
      return res.status(400).json({
        success: false,
        error: "Kid ID and PIN are required",
      });
    }

    const Kid = (await import("../models/KidModel.js")).default;
    const kid = await Kid.findById(kidId);

    if (!kid) {
      return res.status(404).json({
        success: false,
        error: "Kid not found",
      });
    }

    if (!kid.kidPin) {
      return res.status(400).json({
        success: false,
        error: "PIN not set for this kid",
      });
    }

    const isValidPin = await kid.matchKidPin(pin);

    if (!isValidPin) {
      console.log(`Invalid PIN attempt for kid: ${kid.name}`);
      return res.status(401).json({
        success: false,
        error: "Invalid PIN",
      });
    }

    // Generate JWT token for kid
    const jwt = (await import("jsonwebtoken")).default;
    const token = jwt.sign(
      {
        id: kid._id,
        role: "kid",
        name: kid.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log(`Kid login successful: ${kid.name}`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      kid: {
        _id: kid._id,
        name: kid.name,
        selectedAvatar: kid.selectedAvatar,
        gender: kid.gender,
        totalPoints: kid.totalPoints,
      },
    });
  } catch (error) {
    console.error("Error during kid login:", error);
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
});

export const removeKidPin = asyncHandler(async (req, res) => {
  const { kidId } = req.body;
  console.log(`Removing PIN for kid: ${kidId}`);

  try {
    if (!kidId) {
      return res.status(400).json({
        success: false,
        error: "Kid ID is required",
      });
    }

    const Kid = (await import("../models/KidModel.js")).default;
    const kid = await Kid.findById(kidId);

    if (!kid) {
      return res.status(404).json({
        success: false,
        error: "Kid not found",
      });
    }

    // Verify that the kid belongs to the authenticated parent
    if (kid.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to remove PIN for this kid",
      });
    }

    kid.kidPin = undefined;
    kid.loginAttempts = 0;
    kid.lockedUntil = undefined;
    await kid.save();

    console.log(`PIN removed successfully for kid: ${kid.name}`);

    res.status(200).json({
      success: true,
      message: "PIN removed successfully",
      kid: {
        _id: kid._id,
        name: kid.name,
        hasPinSet: false,
      },
    });
  } catch (error) {
    console.error("Error removing kid PIN:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove PIN",
    });
  }
});
