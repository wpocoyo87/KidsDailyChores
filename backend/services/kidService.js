import mongoose from "mongoose";
import Kid from "../models/KidModel.js";
import User from "../models/userModel.js";

export const createKidService = async (userId, kidData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const newKid = new Kid({ ...kidData, parent: userId });
  await newKid.save();
  user.kids.push(newKid._id);
  await user.save();

  return newKid;
};

export const getKidByIdService = async (userId, kidId) => {
  const kid = await Kid.findOne({ _id: kidId, parent: userId });
  if (!kid) {
    throw new Error("Kid not found");
  }
  return kid;
};

export const updateKidPointsService = async (userId, kidId, points) => {
  const kid = await Kid.findOne({ _id: kidId, parent: userId });
  if (!kid) {
    throw new Error("Kid not found");
  }

  kid.points = points;
  await kid.save();

  return kid;
};

export const getKidPointsService = async (kidId) => {
  const kid = await Kid.findById(kidId);
  if (!kid) {
    throw new Error("Kid not found");
  }
  return kid;
};

export const addTasksService = async (userId, kidId, tasks) => {
  const kid = await Kid.findOne({ _id: kidId, parent: userId });
  if (!kid) {
    throw new Error("Kid not found");
  }
  console.log(`Tasks to add: ${JSON.stringify(tasks)}`);
  kid.tasks = kid.tasks.concat(tasks);
  await kid.save();

  return kid;
};

export const getTasksService = async (kidId, date) => {
  try {
    console.log(`Getting tasks for kidId: ${kidId}, date: ${date}`);

    const targetDate = new Date(date);

    const kid = await Kid.findById(new mongoose.Types.ObjectId(kidId));
    if (!kid) {
      throw new Error("Kid not found");
    }

    const tasks = kid.tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.toISOString().slice(0, 10) ===
        targetDate.toISOString().slice(0, 10)
      );
    });

    console.log(`Tasks found: ${tasks.length}`);
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Error fetching tasks");
  }
};

export const deleteTaskService = async (userId, kidId, taskId) => {
  const kid = await Kid.findOne({ _id: kidId, parent: userId });
  if (!kid) {
    throw new Error("Kid not found");
  }

  kid.tasks = kid.tasks.filter((task) => task._id.toString() !== taskId);

  await kid.save();
  return kid;
};

export const updateTaskCompletionService = async (
  userId,
  kidId,
  taskId,
  completed
) => {
  try {
    const kid = await Kid.findOne({ _id: kidId, parent: userId });
    if (!kid) {
      throw new Error("Kid not found");
    }

    const task = kid.tasks.id(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    task.completed = completed;
    await kid.save();

    return task;
  } catch (error) {
    console.error("Error updating task completion:", error);
    throw new Error("Error updating task completion");
  }
};

export const addKidService = async (userId, kidData) => {
  const { name, gender, birthDate, selectedAvatar } = kidData;

  const user = await User.findById(userId);
  console.log(`User found: ${user}`);

  if (!user) {
    throw new Error("User not found");
  }

  const newKid = {
    name,
    gender,
    birthDate,
    selectedAvatar,
    points: 0,
  };

  user.kids.push(newKid);
  await user.save();

  return newKid;
};
