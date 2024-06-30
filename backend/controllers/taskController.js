// backend/controllers/taskController.js

import Task from "../models/TaskModel.js";
import PointsModel from "../models/PointsModel.js";

export const createTask = async (req, res) => {
  try {
    const { kidId, description, image, date } = req.body;
    const task = new Task({
      kidId,
      description,
      image,
      date,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  const { kidId } = req.params;

  try {
    const tasks = await Task.find({ kidId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { completed } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const pointsToAdd = completed ? 1 : -1;
    let pointsEntry = await PointsModel.findOne({ kidId: updatedTask.kidId });

    if (!pointsEntry) {
      pointsEntry = new PointsModel({
        kidId: updatedTask.kidId,
        points: pointsToAdd,
      });
    } else {
      pointsEntry.points += pointsToAdd;
    }

    await pointsEntry.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

export default {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
